import { Injectable } from "@nestjs/common";
import { MemberEntity } from "@translate-dashboard/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

export abstract class IMemberRepo {
  abstract getMemberById(id: string): Promise<MemberEntity | null>;
  abstract getOrganisationMembers(
    organisationId: string
  ): Promise<MemberEntity[]>;
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
}
