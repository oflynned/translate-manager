import { Injectable } from "@nestjs/common";
import { OrganisationEntity, UserEntity } from "@translate-dashboard/entities";

export abstract class IOrganisationRepo {
  abstract create(
    name: string,
    creator: UserEntity
  ): Promise<OrganisationEntity>;
  abstract getById(id: string): Promise<OrganisationEntity | null>;
  abstract addMember(
    newMemberId: string,
    user: UserEntity
  ): Promise<UserEntity[]>;
  abstract removeMember(
    unwantedMemberId: string,
    user: UserEntity
  ): Promise<UserEntity[]>;
  abstract deleteOrganisation(
    id: string,
    user: UserEntity
  ): Promise<OrganisationEntity | null>;
}

@Injectable()
export class OrganisationRepo implements IOrganisationRepo {
  async getById(id: string): Promise<OrganisationEntity | null> {
    return null;
  }

  async create(name: string, creator: UserEntity): Promise<OrganisationEntity> {
    return new OrganisationEntity(name, creator);
  }

  async addMember(
    newMemberId: string,
    user: UserEntity
  ): Promise<UserEntity[]> {
    return [];
  }

  async removeMember(
    unwantedMemberId: string,
    user: UserEntity
  ): Promise<UserEntity[]> {
    return [];
  }

  async deleteOrganisation(
    id: string,
    user: UserEntity
  ): Promise<OrganisationEntity | null> {
    return null;
  }
}
