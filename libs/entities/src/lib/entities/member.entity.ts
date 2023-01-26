import { UserEntity } from "./user.entity";
import { OrganisationEntity } from "./organisation.entity";
import { Role } from "../types/role";

export class MemberEntity {
  id: string;
  role: Role;
  user: UserEntity;
  organisation: OrganisationEntity;
}
