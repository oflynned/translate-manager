import { Injectable } from "@nestjs/common";
import { GetUserByCredentialsDto } from "@translate-dashboard/dto";
import { Err, Ok, Result } from "ts-results";
import { UserEntity } from "@translate-dashboard/entities";
import {
  WrongPasswordException,
  UserNotFoundException,
} from "@translate-dashboard/exceptions";
import {
  IAuthenticationService,
  IHashingService,
  IUserService,
} from "@translate-dashboard/service-definitions";

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private readonly userService: IUserService,
    private readonly hashingService: IHashingService
  ) {}

  async getUserByCredentials(
    dto: GetUserByCredentialsDto
  ): Promise<
    Result<UserEntity, UserNotFoundException | WrongPasswordException>
  > {
    const user = await this.userService.getUserByEmail({ email: dto.email });

    if (user.err) {
      return Err(new UserNotFoundException());
    }

    const isValid = await this.hashingService.isValid(
      dto.passwordAttempt,
      user.val.hash
    );

    if (!isValid) {
      return Err(new WrongPasswordException());
    }

    return Ok(user.val);
  }
}
