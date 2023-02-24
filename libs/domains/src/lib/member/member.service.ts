import { Injectable } from "@nestjs/common";
import { IMemberRepo } from "./member.repo";
import { Err, Ok, Result } from "ts-results";
import { MemberEntity } from "@translate-dashboard/entities";
import {
  IMemberService,
  IOrganisationService,
} from "@translate-dashboard/service-definitions";
import {
  MemberNotFoundException,
  OrganisationNotFoundException,
} from "@translate-dashboard/exceptions";
import {
  GetOrganisationMemberDto,
  GetOrganisationMembersDto,
} from "@translate-dashboard/dto";

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    private readonly repo: IMemberRepo,
    private readonly organisationService: IOrganisationService
  ) {}

  async getMember(
    dto: GetOrganisationMemberDto
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const organisation = await this.organisationService.getOrganisationById({
      organisationId: dto.organisationId,
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
      organisationId: dto.organisationId,
    });

    if (organisation.err) {
      return Err(new OrganisationNotFoundException());
    }

    const members = await this.repo.getOrganisationMembers(dto.organisationId);

    return Ok(members);
  }
}
