import { Injectable } from "@nestjs/common";
import { OrganisationEntity } from "@translate-dashboard/entities";
import { IOrganisationRepo } from "./organisation.repo";
import {
  CreateOrganisationDto,
  DeleteOrganisationDto,
  GetOrganisationByIdDto,
  GetOrganisationCreatorDto,
} from "@translate-dashboard/dto";
import { UserEntity } from "@translate-dashboard/entities";
import { Err, Ok, Result } from "ts-results";
import {
  OrganisationNotFoundException,
  MissingPermissionException,
  InvalidOrganisationException,
} from "@translate-dashboard/exceptions";
import { IOrganisationService } from "@translate-dashboard/service-definitions";
import { CreateOrganisationSchema } from "../../../../schema-validator/src/lib/create-organisation.schema";

@Injectable()
export class OrganisationService implements IOrganisationService {
  constructor(
    private readonly repo: IOrganisationRepo,
    private readonly schema: CreateOrganisationSchema
  ) {}

  async createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<Result<OrganisationEntity, InvalidOrganisationException>> {
    const payload = this.schema.validate(dto);

    if (payload.err) {
      return Err(new InvalidOrganisationException());
    }

    const organisation = await this.repo.createOrganisation(
      payload.val.name,
      creator
    );

    return Ok(organisation);
  }

  async getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>> {
    const organisation = await this.repo.findById(dto.id);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    return Ok(organisation);
  }

  async deleteOrganisation(
    dto: DeleteOrganisationDto,
    user: UserEntity
  ): Promise<
    Result<
      OrganisationEntity,
      MissingPermissionException | OrganisationNotFoundException
    >
  > {
    const organisation = await this.repo.findById(dto.organisationId);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    if (organisation.founder !== user) {
      return Err(new MissingPermissionException());
    }

    const deletedOrganisation = await this.repo.deleteOrganisation(
      organisation
    );

    return Ok(deletedOrganisation);
  }

  async getOrganisationFounder(
    dto: GetOrganisationCreatorDto
  ): Promise<Result<UserEntity, OrganisationNotFoundException>> {
    const organisation = await this.repo.findById(dto.organisationId);

    if (!organisation) {
      return Err(new OrganisationNotFoundException());
    }

    return Ok(organisation.founder);
  }
}
