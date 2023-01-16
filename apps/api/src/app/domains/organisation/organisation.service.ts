import { Injectable } from "@nestjs/common";
import { OrganisationEntity } from "./organisation.entity";
import { IOrganisationRepo } from "./organisation.repo";
import { CreateOrganisationDto } from "./dto/create-organisation.dto";
import { GetOrganisationByIdDto } from "./dto/get-organisation-by-id.dto";
import { UserEntity } from "../user/repo/user.entity";

export abstract class IOrganisationService {
  abstract createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<OrganisationEntity>;

  abstract getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<OrganisationEntity | null>;
}

@Injectable()
export class OrganisationService implements IOrganisationService {
  constructor(private readonly repo: IOrganisationRepo) {}

  async createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<OrganisationEntity> {
    return this.repo.create(dto.name, creator);
  }

  async getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<OrganisationEntity | null> {
    return this.repo.getById(dto.id);
  }
}
