import { Injectable } from "@nestjs/common";
import { OrganisationEntity } from "./organisation.entity";
import { IOrganisationRepo } from "./organisation.repo";
import {
  CreateOrganisationDto,
  DeleteOrganisationDto,
  GetOrganisationByIdDto,
} from "@translate-dashboard/dto";
import { UserEntity } from "../user/repo/user.entity";
import { Err, Ok, Result } from "ts-results";
import { OrganisationNotFoundException } from "../../graphql/organisation/exception/organisation-not-found.exception";
import { InvalidOrganisationException } from "../../graphql/organisation/exception/invalid-organisation.exception";

export abstract class IOrganisationService {
  abstract createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<Result<OrganisationEntity, InvalidOrganisationException>>;

  abstract getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>>;

  abstract deleteOrganisation(
    dto: DeleteOrganisationDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>>;
}

@Injectable()
export class OrganisationService implements IOrganisationService {
  constructor(private readonly repo: IOrganisationRepo) {}

  async createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<Result<OrganisationEntity, InvalidOrganisationException>> {
    const organisation = await this.repo.create(dto.name, creator);

    if (!organisation) {
      return Err(new InvalidOrganisationException());
    }

    return Ok(organisation);
  }

  async getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>> {
    const organisation = await this.repo.getById(dto.id);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    return Ok(organisation);
  }

  async deleteOrganisation(
    dto: DeleteOrganisationDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>> {
    const organisation = await this.repo.deleteOrganisation(dto.id);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    return Ok(organisation);
  }
}
