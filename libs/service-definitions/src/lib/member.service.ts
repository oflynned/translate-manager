import { Result } from "ts-results";
import { MemberEntity, UserEntity } from "@translate-dashboard/entities";
import {
  MemberNotFoundException,
  OrganisationNotFoundException,
} from "@translate-dashboard/exceptions";
import {
  AddMemberDto,
  GetMemberDto,
  GetOrganisationMemberDto,
  GetOrganisationMembersDto,
  RemoveMemberDto,
} from "@translate-dashboard/dto";
import { InvalidMemberException } from "../../../exceptions/src/lib/member/invalid-member.exception";

export abstract class IMemberService {
  abstract getMembers(
    dto: GetOrganisationMembersDto
  ): Promise<Result<MemberEntity[], OrganisationNotFoundException>>;
  abstract getOrganisationMember(
    dto: GetOrganisationMemberDto
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
  abstract getMember(
    dto: GetMemberDto
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
  abstract addMember(
    dto: AddMemberDto,
    user: UserEntity
  ): Promise<
    Result<MemberEntity, MemberNotFoundException | InvalidMemberException>
  >;
  abstract removeMember(
    dto: RemoveMemberDto,
    user: UserEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
}
