import { Injectable } from "@nestjs/common";
import {
  MemberEntity,
  OrganisationEntity,
  UserEntity,
} from "@translate-dashboard/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

export abstract class IOrganisationRepo {
  abstract createOrganisation(
    name: string,
    creator: UserEntity
  ): Promise<OrganisationEntity>;
  abstract findById(id: string): Promise<OrganisationEntity | null>;
  abstract deleteOrganisation(
    organisation: OrganisationEntity
  ): Promise<OrganisationEntity>;
}

@Injectable()
export class OrganisationRepo implements IOrganisationRepo {
  constructor(
    @InjectRepository(OrganisationEntity)
    private readonly repo: EntityRepository<OrganisationEntity>
  ) {}

  async findById(id: string): Promise<OrganisationEntity | null> {
    return this.repo.findOne({ id });
  }

  async createOrganisation(
    name: string,
    founder: UserEntity
  ): Promise<OrganisationEntity> {
    const organisation = new OrganisationEntity();

    organisation.name = name;
    organisation.founder = founder;

    await this.repo.persistAndFlush(organisation);

    return organisation;
  }

  async deleteOrganisation(
    organisation: OrganisationEntity
  ): Promise<OrganisationEntity> {
    organisation.deletedAt = new Date();

    await this.repo.flush();

    return organisation;
  }
}
