import { UserEntity } from "./user.entity";
import { OrganisationEntity } from "./organisation.entity";
import { Role } from "./role";

export class MemberEntity {
  id: string;
  role: Role;
  user: UserEntity;
  organisation: OrganisationEntity;
}
