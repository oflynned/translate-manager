import { Injectable } from "@nestjs/common";
import { IMemberRepo } from "./member.repo";
import { Err, Ok, Result } from "ts-results";
import { MemberEntity } from "@translate-dashboard/entities";
import {
  IOrganisationService,
  IUserService,
} from "@translate-dashboard/service-definitions";
import {
  MemberNotFoundException,
  OrganisationNotFoundException,
} from "@translate-dashboard/exceptions";

export abstract class IMemberService {
  abstract getOrganisationMembers(
    organisationId: string
  ): Promise<Result<MemberEntity[], never>>;
  abstract getOrganisationMember(
    organisationId: string,
    memberId: string
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
  abstract getOrganisationCreator(
    organisationId: string
  ): Promise<Result<MemberEntity, MemberNotFoundException>>;
}

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    private readonly repo: IMemberRepo,
    private readonly organisationService: IOrganisationService,
    private readonly userService: IUserService
  ) {}

  async getOrganisationMember(
    organisationId: string,
    memberId: string
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    const organisation = await this.organisationService.getOrganisationById({
      id: organisationId,
    });

    if (organisation.err) {
      return Err(new OrganisationNotFoundException());
    }

    const member = await this.repo.getMemberById(memberId);

    if (!member) {
      return Err(new MemberNotFoundException());
    }

    return Ok(member);
  }

  async getOrganisationMembers(
    organisationId: string
  ): Promise<Result<MemberEntity[], never>> {
    return Ok([]);
  }

  async getOrganisationCreator(
    organisationId: string
  ): Promise<Result<MemberEntity, MemberNotFoundException>> {
    return Err(new MemberNotFoundException());
  }
}
