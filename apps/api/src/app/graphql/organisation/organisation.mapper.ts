import {
  GraphqlResultMapper,
  OrganisationResult,
} from "@translate-manager/graphql-types";
import { OrganisationEntity } from "../../../../../../libs/entities/src/lib/entities/organisation.entity";
import { Injectable } from "@nestjs/common";

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
      creator: null,
    };
  }
}
