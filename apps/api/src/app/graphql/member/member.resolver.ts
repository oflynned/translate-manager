import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { IMemberService } from "@translate-dashboard/service-definitions";
import {
  Member,
  MemberResult,
  Role,
  UserResult,
} from "@translate-manager/graphql-types";
import { CurrentUser } from "@translate-dashboard/guards";
import { UserEntity } from "@translate-dashboard/entities";
import { MemberRoleMapper } from "./member-role.mapper";

@Resolver("Member")
export class MemberResolver {
  constructor(
    private readonly memberService: IMemberService,
    private readonly roleMapper: MemberRoleMapper
  ) {}

  @Mutation("addMember")
  async addMember(
    @Args("role") role: Role,
    @Args("userId") userId: string,
    @Args("organisationId") organisationId: string,
    @CurrentUser() user: UserEntity
  ): Promise<MemberResult> {
    const newMember = await this.memberService.addMember(
      { userId, organisationId, role: this.roleMapper.toInner(role) },
      user
    );

    if (newMember.err) {
      return {
        __typename: "MemberNotFound",
        message: newMember.val.name,
      };
    }

    const memberRole = this.roleMapper.toOuter(newMember.val.role);

    return {
      __typename: "Member",
      id: newMember.val.id,
      addedAt: newMember.val.createdAt,
      role: memberRole,
      user: null,
    };
  }

  @Mutation("removeMember")
  async removeMember(
    @Args("memberId") memberId: string,
    @CurrentUser() user: UserEntity
  ): Promise<MemberResult> {
    const member = await this.memberService.removeMember({ memberId }, user);

    if (member.err) {
      return {
        __typename: "MemberNotFound",
        message: member.val.name,
      };
    }

    return {
      __typename: "Member",
      id: member.val.id,
      addedAt: member.val.invitedAt,
      role: this.roleMapper.toOuter(member.val.role),
      user: null,
    };
  }

  @ResolveField("user")
  async user(@Parent() parent: Member): Promise<UserResult> {
    console.log("here?");
    const member = await this.memberService.getMember({ memberId: parent.id });

    if (member.err) {
      return {
        __typename: "UserNotFound",
        message: "",
      };
    }

    const user = member.val.user;

    return {
      __typename: "User",
      id: user.id,
      email: user.email,
      name: user.name,
      lastUpdatedAt: user.lastUpdatedAt,
      createdAt: user.createdAt,
    };
  }
}
