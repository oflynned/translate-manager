import { Injectable } from "@nestjs/common";
import {
  MemberEntity,
  MemberRole,
  OrganisationEntity,
  UserEntity,
} from "@translate-dashboard/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

export abstract class IMemberRepo {
  abstract getMemberById(id: string): Promise<MemberEntity | null>;
  abstract isAdmin(
    actor: UserEntity,
    organisation: OrganisationEntity
  ): Promise<boolean>;
  abstract getOrganisationMember(
    userId: string,
    organisationId
  ): Promise<MemberEntity | null>;
  abstract getOrganisationMembers(
    organisationId: string
  ): Promise<MemberEntity[]>;
  abstract addMember(
    role: MemberRole,
    user: UserEntity,
    addedBy: UserEntity,
    organisation: OrganisationEntity
  ): Promise<MemberEntity | null>;
  abstract removeMember(member: MemberEntity): Promise<MemberEntity>;
}

@Injectable()
export class MemberRepo implements IMemberRepo {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly repo: EntityRepository<MemberEntity>
  ) {}

  async getMemberById(id: string): Promise<MemberEntity | null> {
    return this.repo.findOne({ id });
  }

  async getOrganisationMembers(
    organisationId: string
  ): Promise<MemberEntity[]> {
    return this.repo.find({ organisation: { id: organisationId } });
  }

  async addMember(
    role: MemberRole,
    user: UserEntity,
    addedBy: UserEntity,
    organisation: OrganisationEntity
  ): Promise<MemberEntity | null> {
    const newMember = new MemberEntity();
    newMember.organisation = organisation;
    newMember.role = role;
    newMember.invitedAt = new Date();
    newMember.user = user;
    newMember.organisation.members.add(newMember);

    await this.repo.persistAndFlush(newMember);

    return newMember;
  }

  async isAdmin(
    user: UserEntity,
    organisation: OrganisationEntity
  ): Promise<boolean> {
    const result = await this.repo.count({
      user,
      organisation,
      role: MemberRole.ADMIN,
      deletedAt: null,
    });

    return result > 0;
  }

  async removeMember(member: MemberEntity): Promise<MemberEntity> {
    member.deletedAt = new Date();

    await this.repo.flush();

    return member;
  }

  async getOrganisationMember(
    userId: string,
    organisationId
  ): Promise<MemberEntity | null> {
    return this.repo.findOne({
      user: { id: userId },
      organisation: { id: organisationId },
      deletedAt: null,
    });
  }
}
