import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  MemberResult,
  Organisation,
  OrganisationMapper,
  OrganisationResult,
  Role,
  UserMapper,
  UserResult,
} from "@translate-manager/graphql-types";
import { MemberRole, UserEntity } from "@translate-dashboard/entities";
import { DeleteOrganisationDto } from "@translate-dashboard/dto";
import { UseGuards } from "@nestjs/common";
import {
  IMemberService,
  IOrganisationService,
} from "@translate-dashboard/service-definitions";
import { AccessTokenGuard, CurrentUser } from "@translate-dashboard/guards";

@Resolver("Organisation")
@UseGuards(AccessTokenGuard)
export class OrganisationResolver {
  constructor(
    private readonly organisationService: IOrganisationService,
    private readonly memberService: IMemberService,
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

    await this.memberService.addMember(
      {
        userId: user.id,
        organisationId: organisation.val.id,
        role: MemberRole.ADMIN,
      },
      user
    );

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
  async founder(@Parent() parent: Organisation): Promise<UserResult> {
    const founder = await this.organisationService.getOrganisationFounder({
      organisationId: parent.id,
    });

    if (founder.err) {
      return this.userMapper.toError(founder.val);
    }

    return this.userMapper.toResult(founder.val);
  }

  @ResolveField("members")
  async members(@Parent() parent: Organisation): Promise<MemberResult[]> {
    const members = await this.memberService.getMembers({
      organisationId: parent.id,
    });

    if (members.err) {
      return [];
    }

    return members.val.map((member) => {
      return {
        __typename: "Member",
        id: member.id,
        addedAt: member.createdAt,
        // role: this.memberRoleMapper.toOuter(member.role),
        role: Role.Admin,
        user: null,
      };
    });
  }
}
