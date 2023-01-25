import { Injectable, UseGuards } from "@nestjs/common";
import { IUserService } from "../../domains/user/service/user.service";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UserEntity } from "../../domains/user/repo/user.entity";
import { UserResult } from "@translate-manager/graphql-types";
import { CurrentUser } from "../../core/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../core/guards/access-token.guard";
import { UserMapper } from "./user.mapper";
import { CreateUserSchema } from "./schemas/create-user.schema";

@Resolver()
@Injectable()
export class UserResolver {
  constructor(
    private readonly userService: IUserService,
    private readonly mapper: UserMapper,
    private readonly schema: CreateUserSchema
  ) {}

  @Query("getMe")
  @UseGuards(AccessTokenGuard)
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResult> {
    return this.mapper.toResult(user);
  }

  @Query("getUserById")
  @UseGuards(AccessTokenGuard)
  async getUserById(@Args("userId") id: string): Promise<UserResult> {
    const result = await this.userService.getUserById({ id });

    if (result.err) {
      return this.mapper.toError(result.val);
    }

    return this.mapper.toResult(result.val);
  }

  @Mutation("createUser")
  async createUser(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<UserResult> {
    const dto = this.schema.validate({
      name,
      email,
      password,
    });

    if (dto.err) {
      return this.mapper.toError(dto.val);
    }

    const user = await this.userService.createUser(dto.val);

    if (user.err) {
      return this.mapper.toError(user.val);
    }

    return this.mapper.toResult(user.val);
  }
}
