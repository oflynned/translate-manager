import { Injectable } from "@nestjs/common";
import { IUserService } from "../user/service/user.service";
import { IHashingService } from "../hashing/hashing.service";
import { GetUserByCredentialsDto } from "@translate-dashboard/dto";
import { Err, Ok, Result } from "ts-results";
import { WrongPasswordException } from "./exceptions/wrong-password.exception";
import { UserEntity } from "../user/repo/user.entity";
import { UserNotFoundException } from "../user/service/exceptions/user-not-found.exception";

export abstract class IAuthenticationService {
  abstract getUserByCredentials(
    dto: GetUserByCredentialsDto
  ): Promise<
    Result<UserEntity, UserNotFoundException | WrongPasswordException>
  >;
}

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
