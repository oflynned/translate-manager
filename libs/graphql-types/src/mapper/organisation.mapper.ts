import { Injectable } from "@nestjs/common";
import { GraphqlResultMapper } from "./mapper";
import { OrganisationResult } from "../generated/types";
import { OrganisationEntity } from "@translate-dashboard/entities";

@Injectable()
export class OrganisationMapper extends GraphqlResultMapper<
  OrganisationEntity,
  OrganisationResult
> {
  toError(error: Error): OrganisationResult {
    return {
      __typename: "OrganisationNotFound",
      message: error.message,
    };
  }

  toResult(entity: OrganisationEntity): OrganisationResult {
    if (entity.deletedAt) {
      return {
        __typename: "DeletedOrganisation",
        id: entity.id,
        deletedAt: entity.deletedAt,
      };
    }

    return {
      __typename: "Organisation",
      id: entity.id,
      createdAt: entity.createdAt,
      lastUpdatedAt: entity.lastUpdatedAt,
      members: null,
      founder: null,
    };
  }
}
