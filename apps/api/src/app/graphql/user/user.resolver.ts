import { Injectable, UseGuards } from "@nestjs/common";
import { IUserService } from "../../domains/user/service/user.service";
import { Resolver, Query, Args, Context, Mutation } from "@nestjs/graphql";
import { UserEntity } from "../../domains/user/repo/user.entity";
import { UserResult } from "@translate-manager/graphql-types";
import { CurrentUser } from "../../core/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../core/guards/access-token.guard";

@Resolver()
@Injectable()
export class UserResolver {
  constructor(private readonly userService: IUserService) {}

  @Query("getMe")
  @UseGuards(AccessTokenGuard)
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResult> {
    return {
      __typename: "User",
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      lastUpdatedAt: null,
    };
  }

  @Query("getUserById")
  @UseGuards(AccessTokenGuard)
  async getUserById(@Args("userId") id: string): Promise<UserResult> {
    const result = await this.userService.getUserById({ id });

    if (result.err) {
      throw result.val;
    }

    const user = result.val;

    return {
      __typename: "User",
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      lastUpdatedAt: null,
    };
  }

  @Mutation("createUser")
  async createUser(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<UserResult> {
    // TODO use zod to validate user data?
    const userResult = await this.userService.createUser({
      name,
      email,
      password,
    });

    if (userResult.err) {
      return {
        __typename: "InvalidUser",
        message: userResult.val.message,
      };
    }

    return {
      __typename: "User",
      id: userResult.val.id,
      name: userResult.val.name,
      email: userResult.val.email,
      createdAt: userResult.val.createdAt,
    };
  }
}
