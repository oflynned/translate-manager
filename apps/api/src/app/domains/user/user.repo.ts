import { Injectable } from "@nestjs/common";
import { UserEntity } from "@translate-dashboard/entities";

export abstract class IUserRepo {
  abstract create(
    name: string,
    email: string,
    hash: string
  ): Promise<UserEntity | null>;
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract getById(id: string): Promise<UserEntity | null>;
}

@Injectable()
export class UserRepo implements IUserRepo {
  private readonly users: UserEntity[] = [];

  async create(
    name: string,
    email: string,
    hash: string
  ): Promise<UserEntity | null> {
    const user = new UserEntity(name, email, hash);

    this.users.push(user);

    return user;
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    const result = this.users.find((user) => user.email === email);

    return result ?? null;
  }

  async getById(id: string): Promise<UserEntity | null> {
    const result = this.users.find((user) => user.id === id);

    return result ?? null;
  }
}
