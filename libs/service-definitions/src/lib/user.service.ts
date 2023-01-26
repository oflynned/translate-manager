import {
  CreateUserDto,
  GetUserByEmailDto,
  GetUserByIdDto,
} from "@translate-dashboard/dto";
import { Result } from "ts-results";
import { UserEntity } from "@translate-dashboard/entities";
import {
  InvalidUserException,
  UserNotFoundException,
} from "@translate-dashboard/exceptions";

export abstract class IUserService {
  abstract createUser(
    dto: CreateUserDto
  ): Promise<Result<UserEntity, InvalidUserException>>;
  abstract getUserByEmail(
    dto: GetUserByEmailDto
  ): Promise<Result<UserEntity, UserNotFoundException>>;
  abstract getUserById(
    dto: GetUserByIdDto
  ): Promise<Result<UserEntity, UserNotFoundException>>;
}
