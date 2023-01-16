import { Injectable } from "@nestjs/common";
import { OrganisationEntity } from "./organisation.entity";
import { UserEntity } from "../user/repo/user.entity";

export abstract class IOrganisationRepo {
  abstract create(
    name: string,
    creator: UserEntity
  ): Promise<OrganisationEntity>;
  abstract getById(id: string): Promise<OrganisationEntity | null>;
  abstract addMember(memberId: string): Promise<UserEntity[]>;
  abstract removeMember(memberId: string): Promise<UserEntity[]>;
  // TODO policies?
}

@Injectable()
export class OrganisationRepo implements IOrganisationRepo {
  async getById(id: string): Promise<OrganisationEntity | null> {
    return null;
  }

  async create(name: string, creator: UserEntity): Promise<OrganisationEntity> {
    return new OrganisationEntity(name, creator);
  }

  async addMember(memberId: string): Promise<UserEntity[]> {
    return [];
  }

  async removeMember(memberId: string): Promise<UserEntity[]> {
    return [];
  }
}
