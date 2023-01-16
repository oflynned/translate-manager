import { Injectable } from "@nestjs/common";
import { IUserService } from "../../domains/user/service/user.service";
import { Resolver, Query, Args, Context } from "@nestjs/graphql";
import { UserEntity } from "../../domains/user/repo/user.entity";
import { UserResult } from "@translate-manager/graphql-types";

@Resolver()
@Injectable()
export class UserResolver {
  constructor(private readonly userService: IUserService) {}

  @Query("getMe")
  async getMe(@Context("user") user: UserEntity): Promise<UserResult> {
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
}
