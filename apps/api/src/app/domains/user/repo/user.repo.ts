import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";

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
  async create(
    name: string,
    email: string,
    hash: string
  ): Promise<UserEntity | null> {
    return null;
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    return null;
  }

  async getById(id: string): Promise<UserEntity | null> {
    return null;
  }
}
