import { Injectable } from "@nestjs/common";
import { IMemberRepo } from "./member.repo";
import { Err, Ok, Result } from "ts-results";
import { MemberEntity, UserEntity } from "@translate-dashboard/entities";
import {
  IMemberService,
  IOrganisationService,
  IUserService,
} from "@translate-dashboard/service-definitions";
import {
  InvalidMemberException,
  MemberNotFoundException,
  OrganisationNotFoundException,
  RoleNotPowerfulEnoughException,
} from "@translate-dashboard/exceptions";
import {
  AddMemberDto,
  GetMemberDto,
  GetOrganisationMemberDto,
  GetOrganisationMembersDto,
  RemoveMemberDto,
} from "@translate-dashboard/dto";

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    private readonly repo: IMemberRepo,
    private readonly userService: IUserService,
    private readonly organisationService: IOrganisationService
  ) {}

  async getMember(
    dto: GetMemberDto
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const member = await this.repo.getMemberById(dto.memberId);

    if (!member) {
      return Err(new MemberNotFoundException());
    }

    return Ok(member);
  }

  async getOrganisationMember(
    dto: GetOrganisationMemberDto
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const organisation = await this.organisationService.getOrganisationById({
      id: dto.organisationId,
    });

    if (organisation.err) {
      return Err(new OrganisationNotFoundException());
    }

    const member = await this.repo.getMemberById(dto.memberId);

    if (!member) {
      return Err(new MemberNotFoundException());
    }

    return Ok(member);
  }

  async getMembers(
    dto: GetOrganisationMembersDto
  ): Promise<Result<MemberEntity[], OrganisationNotFoundException>> {
    const organisation = await this.organisationService.getOrganisationById({
      id: dto.organisationId,
    });

    if (organisation.err) {
      return Err(new OrganisationNotFoundException());
    }

    const members = await this.repo.getOrganisationMembers(dto.organisationId);

    return Ok(members);
  }

  async addMember(
    dto: AddMemberDto,
    addedByUser: UserEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const user = await this.userService.getUserById({ id: dto.userId });
    const organisation = await this.organisationService.getOrganisationById({
      id: dto.organisationId,
    });

    if (user.err || organisation.err) {
      return Err(
        new InvalidMemberException("User or organisation does not exist")
      );
    }

    const existingMember = await this.repo.getOrganisationMember(
      dto.userId,
      dto.organisationId
    );

    if (existingMember) {
      return Ok(existingMember);
    }

    const member = await this.repo.addMember(
      dto.role,
      user.val,
      addedByUser,
      organisation.val
    );

    if (!member) {
      return Err(new InvalidMemberException());
    }

    return Ok(member);
  }

  async removeMember(
    dto: RemoveMemberDto,
    removedBy: UserEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const member = await this.repo.getMemberById(dto.memberId);

    if (!member) {
      return Err(new MemberNotFoundException());
    }

    const canPerformAction = await this.repo.isAdmin(
      removedBy,
      member.organisation
    );

    if (canPerformAction || member.user === removedBy) {
      const removedMember = await this.repo.removeMember(member);

      return Ok(removedMember);
    }

    return Err(new RoleNotPowerfulEnoughException());
  }
}
