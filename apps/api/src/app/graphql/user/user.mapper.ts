import {
  GraphqlResultMapper,
  UserResult,
} from "@translate-manager/graphql-types";
import { UserEntity } from "@translate-dashboard/entities";
import { InvalidUserException } from "@translate-dashboard/exceptions";
import { Injectable } from "@nestjs/common";
import { InvalidDtoException } from "@translate-dashboard/schema-validator";

@Injectable()
export class UserMapper extends GraphqlResultMapper<UserEntity, UserResult> {
  toError(error: Error): UserResult {
    if (
      error instanceof InvalidDtoException ||
      error instanceof InvalidUserException
    ) {
      return {
        __typename: "InvalidUser",
        message: error.message,
      };
    }

    return {
      __typename: "UserNotFound",
      message: error.message,
    };
  }

  toResult(user: UserEntity): UserResult {
    if (user.deletedAt) {
      return {
        __typename: "DeletedUser",
        id: user.id,
        deletedAt: user.deletedAt,
      };
    }

    return {
      __typename: "User",
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lastUpdatedAt: user.lastUpdatedAt,
    };
  }
}
