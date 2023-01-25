import { Injectable } from "@nestjs/common";
import { UserEntity } from "../repo/user.entity";
import { IUserRepo } from "../repo/user.repo";
import { GetUserByEmailDto } from "./dto/get-user-by-email.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { IHashingService } from "../../hashing/hashing.service";
import { GetUserByIdDto } from "./dto/get-user-by-id.dto";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";
import { Err, Ok, Result } from "ts-results";
import { InvalidUserException } from "./exceptions/invalid-user.exception";
import { InvalidPasswordException } from "./exceptions/invalid-password.exception";

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

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly repo: IUserRepo,
    private readonly hashingService: IHashingService
  ) {}

  async createUser(
    dto: CreateUserDto
  ): Promise<Result<UserEntity, InvalidPasswordException>> {
    const existingUser = await this.repo.getByEmail(dto.email);

    if (existingUser) {
      return Ok(existingUser);
    }

    const hash = await this.hashingService.toHash(dto.password);

    if (hash.err) {
      return Err(new InvalidUserException());
    }

    const user = await this.repo.create(dto.name, dto.email, hash.val);

    if (!user) {
      return Err(new InvalidUserException());
    }

    return Ok(user);
  }

  async getUserByEmail(
    dto: GetUserByEmailDto
  ): Promise<Result<UserEntity, UserNotFoundException>> {
    const user = await this.repo.getByEmail(dto.email);

    if (!user) {
      return Err(new UserNotFoundException());
    }

    return Ok(user);
  }

  async getUserById(
    dto: GetUserByIdDto
  ): Promise<Result<UserEntity, UserNotFoundException>> {
    const user = await this.repo.getById(dto.id);

    if (!user) {
      return Err(new UserNotFoundException());
    }

    return Ok(user);
  }
}
