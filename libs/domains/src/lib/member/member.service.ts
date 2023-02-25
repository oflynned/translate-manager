import { Injectable } from "@nestjs/common";
import { IMemberRepo } from "./member.repo";
import { Err, Ok, Result } from "ts-results";
import {
  MemberEntity,
  MemberRole,
  OrganisationEntity,
  UserEntity,
} from "@translate-dashboard/entities";
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

  private async addInitialMember(
    user: UserEntity,
    organisation: OrganisationEntity
  ): Promise<Result<MemberEntity, never>> {
    const member = await this.repo.addMember(
      MemberRole.ADMIN,
      user,
      organisation
    );

    return Ok(member);
  }

  private async addSubsequentMembers(
    role: MemberRole,
    userBeingAdded: UserEntity,
    addedByUser: UserEntity,
    organisation: OrganisationEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const addedBy = await this.repo.getOrganisationMember(
      addedByUser.id,
      organisation.id
    );

    if (!addedBy) {
      return Err(
        new InvalidMemberException(
          "User adding new member is not part of the organisation"
        )
      );
    }

    const existingMember = await this.repo.getOrganisationMember(
      userBeingAdded.id,
      organisation.id
    );

    if (existingMember) {
      return Ok(existingMember);
    }

    const member = await this.repo.addMember(
      role,
      userBeingAdded,
      organisation,
      addedBy
    );

    return Ok(member);
  }

  async addMember(
    dto: AddMemberDto,
    addedByUser: UserEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const userBeingAdded = await this.userService.getUserById({
      id: dto.userId,
    });
    const organisation = await this.organisationService.getOrganisationById({
      id: dto.organisationId,
    });

    if (userBeingAdded.err || organisation.err) {
      return Err(
        new InvalidMemberException("User or organisation does not exist")
      );
    }

    if (addedByUser.id === dto.userId) {
      return this.addInitialMember(userBeingAdded.val, organisation.val);
    }

    return this.addSubsequentMembers(
      dto.role,
      userBeingAdded.val,
      addedByUser,
      organisation.val
    );
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
