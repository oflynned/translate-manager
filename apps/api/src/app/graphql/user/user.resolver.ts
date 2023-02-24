import { Injectable, UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UserEntity } from "@translate-dashboard/entities";
import { UserMapper, UserResult } from "@translate-manager/graphql-types";
import { IUserService } from "@translate-dashboard/service-definitions";
import { AccessTokenGuard, CurrentUser } from "@translate-dashboard/guards";

@Resolver()
@Injectable()
export class UserResolver {
  constructor(
    private readonly userService: IUserService,
    private readonly userMapper: UserMapper
  ) {}

  @Query("getMe")
  @UseGuards(AccessTokenGuard)
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResult> {
    return this.userMapper.toResult(user);
  }

  @Query("getUserById")
  @UseGuards(AccessTokenGuard)
  async getUserById(@Args("userId") id: string): Promise<UserResult> {
    const result = await this.userService.getUserById({ id });

    if (result.err) {
      return this.userMapper.toError(result.val);
    }

    return this.userMapper.toResult(result.val);
  }

  @Mutation("createUser")
  async createUser(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<UserResult> {
    const user = await this.userService.createUser({ name, email, password });

    if (user.err) {
      return this.userMapper.toError(user.val);
    }

    return this.userMapper.toResult(user.val);
  }
}
