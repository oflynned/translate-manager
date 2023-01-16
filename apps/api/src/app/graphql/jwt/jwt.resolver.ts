import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IAccessTokenService } from "../../domains/access-token/access-token.service";
import { JwtResult } from "@translate-manager/graphql-types";
import { IRefreshTokenService } from "../../domains/access-token/refresh-token.service";
import { IAuthenticationService } from "../../domains/authentication/authentication.service";
import { WrongPasswordException } from "../../domains/authentication/exceptions/wrong-password.exception";
import { ApolloError } from "apollo-server-express";
import { UserNotFoundException } from "../../domains/user/service/exceptions/user-not-found.exception";

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

    if (userResult.err) {
      // TODO disguise this as user not found?
      throw new UserNotFoundException();
    }

    const refreshTokenResult =
      await this.refreshTokenService.createRefreshToken(userResult.val);

    if (refreshTokenResult.err) {
      return {
        __typename: "MalformedJwt",
        message: refreshTokenResult.val.message,
      };
    }

    const accessToken = await this.accessTokenService.createAccessToken(
      userResult.val
    );

    if (accessToken.err) {
      return {
        __typename: "MalformedJwt",
        message: accessToken.val.message,
      };
    }

    return {
      __typename: "Jwt",
      accessToken: accessToken.val,
      refreshToken: refreshTokenResult.val,
    };
  }
}
