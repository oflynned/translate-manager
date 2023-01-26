import { Injectable } from "@nestjs/common";
import { OrganisationEntity } from "@translate-dashboard/entities";
import { IOrganisationRepo } from "./organisation.repo";
import {
  CreateOrganisationDto,
  DeleteOrganisationDto,
  GetOrganisationByIdDto,
} from "@translate-dashboard/dto";
import { UserEntity } from "@translate-dashboard/entities";
import { Err, Ok, Result } from "ts-results";
import {
  OrganisationNotFoundException,
  InvalidOrganisationException,
} from "@translate-dashboard/exceptions";
import { IOrganisationService } from "@translate-dashboard/service-definitions";

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
    dto: DeleteOrganisationDto,
    user: UserEntity
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>> {
    const organisation = await this.repo.deleteOrganisation(dto.id, user);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    return Ok(organisation);
  }
}
