import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/repo/user.entity";
import { JwtService } from "@nestjs/jwt";
import { SignOptions } from "jsonwebtoken";
import { RefreshTokenEntity } from "../refresh-token/refresh-token.entity";
import { Err, Ok, Result } from "ts-results";
import { UserNotFoundException } from "../../user/service/exceptions/user-not-found.exception";
import { IApiConfigService } from "../../api-config/api-config.service";
import { IUserService } from "../../user/service/user.service";
import { MalformedAccessTokenException } from "../exceptions/malformed-access-token.exception";
import { InvalidAccessTokenException } from "../exceptions/invalid-access-token.exception";

export abstract class IAccessTokenService {
  abstract createAccessToken(
    user: UserEntity
  ): Promise<Result<string, MalformedAccessTokenException>>;
  abstract isAccessTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, InvalidAccessTokenException>>;
  abstract getUserFromAccessToken(
    encodedToken: string
  ): Promise<
    Result<UserEntity, InvalidAccessTokenException | UserNotFoundException>
  >;
  abstract createAccessTokenFromRefreshToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<string, MalformedAccessTokenException>>;
}

@Injectable()
export class AccessTokenService implements IAccessTokenService {
  constructor(
    private readonly config: IApiConfigService,
    private readonly userService: IUserService,
    private readonly jwtService: JwtService
  ) {}

  async createAccessToken(
    user: UserEntity
  ): Promise<Result<string, MalformedAccessTokenException>> {
    const issuer = this.config.getTokenIssuer();

    if (issuer.err) {
      return Err(new MalformedAccessTokenException());
    }

    const options: SignOptions = {
      issuer: issuer.val,
      audience: issuer.val,
      subject: user.id,
    };

    const token = await this.jwtService.signAsync({}, options);

    return Ok(token);
  }

  async isAccessTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, never>> {
    try {
      await this.jwtService.verifyAsync(encodedToken);

      return Ok(true);
    } catch (e) {
      return Ok(false);
    }
  }

  async getUserFromAccessToken(
    encodedToken: string
  ): Promise<
    Result<UserEntity, InvalidAccessTokenException | UserNotFoundException>
  > {
    const result = await this.jwtService.decode(encodedToken);

    if (!result) {
      return Err(new InvalidAccessTokenException());
    }

    return this.userService.getUserById({ id: result.sub });
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<string, MalformedAccessTokenException>> {
    return this.createAccessToken(refreshToken.user);
  }
}
