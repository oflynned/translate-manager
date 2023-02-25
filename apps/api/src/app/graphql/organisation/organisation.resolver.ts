import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  Organisation,
  OrganisationMapper,
  OrganisationResult,
  UserMapper,
  UserResult,
} from "@translate-manager/graphql-types";
import { UserEntity } from "@translate-dashboard/entities";
import { DeleteOrganisationDto } from "@translate-dashboard/dto";
import { UseGuards } from "@nestjs/common";
import { IOrganisationService } from "@translate-dashboard/service-definitions";
import { AccessTokenGuard, CurrentUser } from "@translate-dashboard/guards";

@Resolver()
@UseGuards(AccessTokenGuard)
export class OrganisationResolver {
  constructor(
    private readonly organisationService: IOrganisationService,
    private readonly organisationMapper: OrganisationMapper,
    private readonly userMapper: UserMapper
  ) {}

  @Query("getOrganisationById")
  async getOrganisationById(
    @CurrentUser() user: UserEntity,
    @Args("organisationId") organisationId: string
  ): Promise<OrganisationResult> {
    const organisation = await this.organisationService.getOrganisationById({
      id: organisationId,
    });

    if (organisation.err) {
      return this.organisationMapper.toError(organisation.val);
    }

    return this.organisationMapper.toResult(organisation.val);
  }

  @Mutation("createOrganisation")
  async createOrganisation(
    @CurrentUser() user: UserEntity,
    @Args("name") name: string
  ): Promise<OrganisationResult> {
    const organisation = await this.organisationService.createOrganisation(
      { name },
      user
    );

    if (organisation.err) {
      return this.organisationMapper.toError(organisation.val);
    }

    return this.organisationMapper.toResult(organisation.val);
  }
  @Mutation("deleteOrganisation")
  async deleteOrganisation(
    @CurrentUser() user: UserEntity,
    @Args("id") id: string
  ): Promise<OrganisationResult> {
    const dto: DeleteOrganisationDto = { organisationId: id };
    const organisation = await this.organisationService.deleteOrganisation(
      dto,
      user
    );

    if (organisation.err) {
      return this.organisationMapper.toError(organisation.val);
    }

    return this.organisationMapper.toResult(organisation.val);
  }

  @ResolveField("founder")
  async founder(@Parent() organisation: Organisation): Promise<UserResult> {
    const founder = await this.organisationService.getOrganisationFounder({
      organisationId: organisation.id,
    });

    if (founder.err) {
      return this.userMapper.toError(founder.val);
    }

    return this.userMapper.toResult(founder.val);
  }
}
