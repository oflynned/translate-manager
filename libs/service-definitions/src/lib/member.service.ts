import { Result } from "ts-results";
import { MemberEntity, UserEntity } from "@translate-dashboard/entities";
import {
  MemberNotFoundException,
  OrganisationNotFoundException,
} from "@translate-dashboard/exceptions";
import {
  GetOrganisationCreatorDto,
  GetOrganisationMemberDto,
  GetOrganisationMembersDto,
} from "@translate-dashboard/dto";

export abstract class IMemberService {
  abstract getMembers(
    dto: GetOrganisationMembersDto,
    user: UserEntity
  ): Promise<Result<MemberEntity[], OrganisationNotFoundException>>;
  abstract getMember(
    dto: GetOrganisationMemberDto,
    user: UserEntity
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
}
