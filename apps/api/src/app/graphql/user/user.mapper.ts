import { UserResult } from "@translate-manager/graphql-types";
import { UserEntity } from "../../domains/user/repo/user.entity";
import { InvalidUserException } from "../../domains/user/service/exceptions/invalid-user.exception";
import { Injectable } from "@nestjs/common";
import { InvalidDtoException } from "./exceptions/invalid-dto.exception";

@Injectable()
export class UserMapper {
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
