import { Injectable } from "@nestjs/common";
import { UserEntity } from "@translate-dashboard/entities";
import { JwtService } from "@nestjs/jwt";
import { SignOptions } from "jsonwebtoken";
import { RefreshTokenEntity } from "@translate-dashboard/entities";
import { Err, Ok, Result } from "ts-results";
import { UserNotFoundException } from "@translate-dashboard/exceptions";
import {
  MalformedAccessTokenException,
  InvalidAccessTokenException,
} from "@translate-dashboard/exceptions";
import {
  IApiConfigService,
  IUserService,
  IAccessTokenService,
} from "@translate-dashboard/service-definitions";

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
    const token = await this.jwtService.decode(encodedToken);

    if (!token) {
      return Err(new InvalidAccessTokenException());
    }

    return this.userService.getUserById({ id: token.sub });
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<string, MalformedAccessTokenException>> {
    return this.createAccessToken(refreshToken.user);
  }
}
