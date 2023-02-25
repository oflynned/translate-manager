import { Injectable } from "@nestjs/common";
import { UserEntity } from "@translate-dashboard/entities";
import { IUserRepo } from "./user.repo";
import {
  GetUserByEmailDto,
  CreateUserDto,
  GetUserByIdDto,
} from "@translate-dashboard/dto";
import { Err, Ok, Result } from "ts-results";
import {
  UserNotFoundException,
  InvalidUserException,
  InvalidPasswordException,
} from "@translate-dashboard/exceptions";
import {
  IHashingService,
  IUserService,
} from "@translate-dashboard/service-definitions";
import { CreateUserSchema } from "@translate-dashboard/schema-validator";

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly repo: IUserRepo,
    private readonly hashingService: IHashingService,
    private readonly createUserSchema: CreateUserSchema
  ) {}

  async createUser(
    dto: CreateUserDto
  ): Promise<
    Result<UserEntity, InvalidUserException | InvalidPasswordException>
  > {
    console.log(1);

    const payload = this.createUserSchema.validate(dto);
    console.log(2);

    if (payload.err) {
      return Err(new InvalidUserException());
    }

    console.log(3);
    const existingUser = await this.repo.getByEmail(dto.email);
    console.log(4);

    if (existingUser) {
      return Ok(existingUser);
    }
    console.log(5);

    const hash = await this.hashingService.toHash(dto.password);
    console.log(6);

    if (hash.err) {
      return Err(new InvalidUserException());
    }
    console.log(7);

    const user = await this.repo.create(dto.name, dto.email, hash.val);
    console.log(8);

    if (!user) {
      return Err(new InvalidUserException());
    }
    console.log(9);

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
