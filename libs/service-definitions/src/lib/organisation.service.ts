import {
  CreateOrganisationDto,
  DeleteOrganisationDto,
  GetOrganisationByIdDto,
  GetOrganisationCreatorDto,
} from "@translate-dashboard/dto";
import { OrganisationEntity, UserEntity } from "@translate-dashboard/entities";
import { Result } from "ts-results";
import {
  InvalidOrganisationException,
  MissingPermissionException,
  OrganisationNotFoundException,
} from "@translate-dashboard/exceptions";

export abstract class IOrganisationService {
  abstract createOrganisation(
    dto: CreateOrganisationDto,
    creator: UserEntity
  ): Promise<Result<OrganisationEntity, InvalidOrganisationException>>;

  abstract getOrganisationById(
    dto: GetOrganisationByIdDto
  ): Promise<Result<OrganisationEntity, OrganisationNotFoundException>>;

  abstract deleteOrganisation(
    dto: DeleteOrganisationDto,
    user: UserEntity
  ): Promise<
    Result<
      OrganisationEntity,
      MissingPermissionException | OrganisationNotFoundException
    >
  >;

  abstract getOrganisationFounder(
    dto: GetOrganisationCreatorDto
  ): Promise<Result<UserEntity, OrganisationNotFoundException>>;
}
