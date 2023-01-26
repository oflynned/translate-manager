import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/repo/user.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { Err, Ok, Result } from "ts-results";
import { RefreshToken } from "./refresh-token";
import { JwtService } from "@nestjs/jwt";
import { IUserService } from "../../user/service/user.service";
import { IRefreshTokenRepo } from "./refresh-token.repo";
import { MissingRefreshTokenException } from "../exceptions/missing-refresh-token.exception";
import { RevokedRefreshTokenException } from "../exceptions/revoked-refresh-token.exception";
import { InvalidRefreshTokenException } from "../exceptions/invalid-refresh-token.exception";
import { ExpiredRefreshTokenException } from "../exceptions/expired-refresh-token.exception";
import { MalformedRefreshTokenException } from "../exceptions/malformed-refresh-token.exception";
import { SignOptions } from "jsonwebtoken";
import { IApiConfigService } from "../../api-config/api-config.service";

export type LongLivedToken = {
  user: UserEntity;
  refreshToken: RefreshTokenEntity;
};

export abstract class IRefreshTokenService {
  abstract isRefreshTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, never>>;
  abstract createRefreshToken(
    user: UserEntity
  ): Promise<Result<string, MalformedRefreshTokenException>>;
  abstract resolveRefreshToken(
    encodedToken: string
  ): Promise<
    Result<
      LongLivedToken,
      | InvalidRefreshTokenException
      | MissingRefreshTokenException
      | RevokedRefreshTokenException
      | ExpiredRefreshTokenException
      | MalformedRefreshTokenException
    >
  >;
  abstract getStoredTokenFromRefreshTokenPayload(
    payload: RefreshToken
  ): Promise<
    Result<
      RefreshTokenEntity,
      InvalidRefreshTokenException | MissingRefreshTokenException
    >
  >;
  abstract revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<RefreshTokenEntity, never>>;
}

const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 90;

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: IApiConfigService,
    private readonly userService: IUserService,
    private readonly refreshTokenRepo: IRefreshTokenRepo
  ) {}

  async createRefreshToken(
    user: UserEntity
  ): Promise<Result<string, MalformedRefreshTokenException>> {
    const token = await this.refreshTokenRepo.createRefreshToken(
      user,
      REFRESH_TOKEN_TTL
    );

    const serviceName = this.configService.getTokenIssuer();

    if (serviceName.err) {
      return Err(new MalformedRefreshTokenException());
    }

    const options: SignOptions = {
      issuer: serviceName.val,
      audience: serviceName.val,
      subject: user.id,
      jwtid: token.id,
    };

    const refreshToken = await this.jwtService.signAsync({}, options);

    return Ok(refreshToken);
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshToken
  ): Promise<
    Result<
      RefreshTokenEntity,
      InvalidRefreshTokenException | MissingRefreshTokenException
    >
  > {
    const tokenId = payload.jti;

    if (!tokenId) {
      return Err(new InvalidRefreshTokenException());
    }

    const refreshToken = await this.refreshTokenRepo.getRefreshTokenById(
      tokenId
    );

    if (!refreshToken) {
      return Err(new MissingRefreshTokenException());
    }

    return Ok(refreshToken);
  }

  async isRefreshTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, never>> {
    try {
      await this.jwtService.verifyAsync(encodedToken);

      return Ok(true);
    } catch (e) {
      return Ok(false);
    }
  }

  async resolveRefreshToken(
    encodedToken: string
  ): Promise<
    Result<
      LongLivedToken,
      | InvalidRefreshTokenException
      | MissingRefreshTokenException
      | RevokedRefreshTokenException
      | ExpiredRefreshTokenException
      | MalformedRefreshTokenException
    >
  > {
    const payload = (await this.jwtService.decode(
      encodedToken
    )) as RefreshToken;

    // TODO can the service return null? account for this case and align types?

    if (!payload.jti) {
      return Err(new InvalidRefreshTokenException());
    }

    const token = await this.refreshTokenRepo.getRefreshTokenById(payload.jti);

    if (!token) {
      return Err(new MissingRefreshTokenException());
    }

    if (token.revoked) {
      return Err(new RevokedRefreshTokenException());
    }

    if (token.expiresAt < new Date()) {
      return Err(new ExpiredRefreshTokenException());
    }

    const user = await this.userService.getUserById({ id: payload.sub });

    if (user.err) {
      return Err(new MalformedRefreshTokenException());
    }

    return Ok({ user: user.val, refreshToken: token });
  }

  async revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<RefreshTokenEntity, never>> {
    const revokedToken = await this.refreshTokenRepo.revokeToken(refreshToken);

    return Ok(revokedToken);
  }
}
