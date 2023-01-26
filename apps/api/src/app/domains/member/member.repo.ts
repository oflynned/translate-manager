import { Injectable } from "@nestjs/common";
import { MemberEntity } from "@translate-dashboard/entities";

export abstract class IMemberRepo {
  abstract getMemberById(id: string): Promise<MemberEntity | null>;
}

@Injectable()
export class MemberRepo implements IMemberRepo {
  async getMemberById(id: string): Promise<MemberEntity | null> {
    return null;
  }
}
