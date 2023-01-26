import {
  GraphqlResultMapper,
  UserResult,
} from "@translate-manager/graphql-types";
import { UserEntity } from "../../../../../../libs/entities/src/lib/entities/user.entity";
import { InvalidUserException } from "../../../../../../libs/exceptions/src/lib/user/invalid-user.exception";
import { Injectable } from "@nestjs/common";
import { InvalidDtoException } from "../../../../../../libs/schema-validator/src/lib/invalid-dto.exception";

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
