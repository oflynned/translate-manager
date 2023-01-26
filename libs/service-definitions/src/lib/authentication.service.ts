import { GetUserByCredentialsDto } from "@translate-dashboard/dto";
import { Result } from "ts-results";
import { UserEntity } from "@translate-dashboard/entities";
import {
  UserNotFoundException,
  WrongPasswordException,
} from "@translate-dashboard/exceptions";

export abstract class IAuthenticationService {
  abstract getUserByCredentials(
    dto: GetUserByCredentialsDto
  ): Promise<
    Result<UserEntity, UserNotFoundException | WrongPasswordException>
  >;
}
