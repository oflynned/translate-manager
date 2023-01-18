import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IAccessTokenService } from "../../domains/authentication/access-token/access-token.service";
import { JwtResult } from "@translate-manager/graphql-types";
import { IRefreshTokenService } from "../../domains/authentication/refresh-token/refresh-token.service";
import { IAuthenticationService } from "../../domains/authentication/authentication.service";
import { UserNotFoundException } from "../../domains/user/service/exceptions/user-not-found.exception";
import { RefreshTokenEntity } from "../../domains/authentication/refresh-token/refresh-token.entity";
import { RefreshTokenGuard } from "../../core/guards/refresh-token.guard";
import { RefreshToken } from "../../core/decorators/refresh-token.decorator";

@Injectable()
@Resolver()
export class JwtResolver {
  constructor(
    private readonly authenticationService: IAuthenticationService,
    private readonly accessTokenService: IAccessTokenService,
    private readonly refreshTokenService: IRefreshTokenService
  ) {}

  @Mutation("createRefreshToken")
  async createRefreshToken(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<JwtResult> {
    const userResult = await this.authenticationService.getUserByCredentials({
      email,
      passwordAttempt: password,
    });

    console.log({ userResult });

    if (userResult.err) {
      throw new UserNotFoundException(`User with email ${email} was not found`);
    }

    const refreshTokenResult =
      await this.refreshTokenService.createRefreshToken(userResult.val);

    const accessTokenResult = await this.accessTokenService.createAccessToken(
      userResult.val
    );

    console.log({ refreshTokenResult });
    console.log({ accessTokenResult });

    if (refreshTokenResult.err || accessTokenResult.err) {
      return {
        __typename: "MalformedJwt",
        message: "Could not create a valid jwt for the given user",
      };
    }

    return {
      __typename: "Jwt",
      accessToken: accessTokenResult.val,
      refreshToken: refreshTokenResult.val,
    };
  }

  @Mutation("revokeRefreshToken")
  async revokeRefreshToken(
    @RefreshToken() refreshToken: RefreshTokenEntity
  ): Promise<JwtResult> {
    if (refreshToken.expiresAt < new Date()) {
      return {
        __typename: "ExpiredJwt",
        expiredAt: refreshToken.expiresAt,
      };
    }

    const result = await this.refreshTokenService.revokeToken(refreshToken);

    return {
      __typename: "RevokedJwt",
      message: `Refresh token was revoked at ${result.val.revokedAt.toISOString()}`,
    };
  }

  @Mutation("refreshAccessToken")
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @RefreshToken() refreshToken: RefreshTokenEntity
  ): Promise<JwtResult> {
    const result =
      await this.accessTokenService.createAccessTokenFromRefreshToken(
        refreshToken
      );

    if (result.err) {
      return {
        __typename: "MalformedJwt",
        message: result.val.message,
      };
    }

    return {
      __typename: "Jwt",
      accessToken: result.val,
    };
  }
}
