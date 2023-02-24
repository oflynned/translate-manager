import {
  InvalidDtoException,
  InvalidUserException,
} from "@translate-dashboard/exceptions";
import { Injectable } from "@nestjs/common";
import { GraphqlResultMapper } from "./mapper";
import { UserResult } from "../generated/types";
import { UserEntity } from "@translate-dashboard/entities";

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
