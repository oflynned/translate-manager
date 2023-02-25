import { Injectable } from "@nestjs/common";
import { UserEntity } from "@translate-dashboard/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

export abstract class IUserRepo {
  abstract create(
    name: string,
    email: string,
    hash: string
  ): Promise<UserEntity>;
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract getById(id: string): Promise<UserEntity | null>;
}

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: EntityRepository<UserEntity>
  ) {}

  async create(name: string, email: string, hash: string): Promise<UserEntity> {
    console.log({ name, email, hash });
    console.log("a");
    const user = new UserEntity();
    console.log("b");

    user.name = name;
    user.email = email;
    user.hash = hash;
    console.log("c");

    try {
      await this.repo.persistAndFlush(user);
      console.log("all g");
    } catch (e) {
      console.error(e);
    }
    console.log("d");

    return user;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ email });
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ id });
  }
}
