import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccessTokenGuard } from "../../core/guards/access-token.guard";
import { OrganisationResult } from "@translate-manager/graphql-types";
import { CreateOrganisationSchema } from "./schema/create-organisation.schema";
import { CurrentUser } from "../../core/decorators/current-user.decorator";
import { UserEntity } from "@translate-dashboard/entities";
import { OrganisationMapper } from "./organisation.mapper";
import {
  DeleteOrganisationDto,
  GetOrganisationByIdDto,
} from "@translate-dashboard/dto";
import { UseGuards } from "@nestjs/common";
import { IOrganisationService } from "@translate-dashboard/service-definitions";

@Resolver()
@UseGuards(AccessTokenGuard)
export class OrganisationResolver {
  constructor(
    private readonly organisationService: IOrganisationService,
    private readonly schema: CreateOrganisationSchema,
    private readonly mapper: OrganisationMapper
  ) {}

  @Query("getOrganisationById")
  async getOrganisationById(
    @CurrentUser() user: UserEntity,
    @Args("organisationId") id: string
  ): Promise<OrganisationResult> {
    const dto: GetOrganisationByIdDto = { id };
    const organisation = await this.organisationService.getOrganisationById(
      dto
    );

    if (organisation.err) {
      return this.mapper.toError(organisation.val);
    }

    return this.mapper.toResult(organisation.val);
  }

  @Mutation("createOrganisation")
  async createOrganisation(
    @CurrentUser() user: UserEntity,
    @Args("name") name: string
  ): Promise<OrganisationResult> {
    const dto = this.schema.validate({ name });

    if (dto.err) {
      return this.mapper.toError(dto.val);
    }

    const organisation = await this.organisationService.createOrganisation(
      dto.val,
      user
    );

    if (organisation.err) {
      return this.mapper.toError(organisation.val);
    }

    return this.mapper.toResult(organisation.val);
  }
  @Mutation("deleteOrganisation")
  async deleteOrganisation(
    @CurrentUser() user: UserEntity,
    @Args("id") id: string
  ): Promise<OrganisationResult> {
    const dto: DeleteOrganisationDto = { id };
    const organisation = await this.organisationService.deleteOrganisation(
      dto,
      user
    );

    if (organisation.err) {
      return this.mapper.toError(organisation.val);
    }

    return this.mapper.toResult(organisation.val);
  }

  // @ResolveField("creator")
  // async creator(@Parent() organisation: Organisation): MemberResult {
  //   const member = await this.
  //   return {
  //     __typename: "Member",
  //
  //   };
  // }
}
