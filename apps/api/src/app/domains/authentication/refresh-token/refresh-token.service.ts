import { Injectable } from "@nestjs/common";
import { UserEntity, RefreshTokenEntity } from "@translate-dashboard/entities";
import { Err, Ok, Result } from "ts-results";
import { RefreshToken } from "./refresh-token";
import { JwtService } from "@nestjs/jwt";
import { IRefreshTokenRepo } from "./refresh-token.repo";
import {
  MissingRefreshTokenException,
  RevokedRefreshTokenException,
  InvalidRefreshTokenException,
  ExpiredRefreshTokenException,
  MalformedRefreshTokenException,
} from "@translate-dashboard/exceptions";
import { SignOptions } from "jsonwebtoken";
import {
  IApiConfigService,
  IRefreshTokenService,
  IUserService,
} from "@translate-dashboard/service-definitions";

export type LongLivedToken = {
  user: UserEntity;
  refreshToken: RefreshTokenEntity;
};

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
