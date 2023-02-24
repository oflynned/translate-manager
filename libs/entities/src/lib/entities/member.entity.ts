import { UserEntity } from "./user.entity";
import { OrganisationEntity } from "./organisation.entity";
import { BaseEntity } from "./base.entity";
import { Entity, Enum, ManyToOne, OneToOne } from "@mikro-orm/core";
import { MemberRole } from "./role";

@Entity()
export class MemberEntity extends BaseEntity {
  @Enum(() => MemberRole)
  role!: MemberRole;

  @OneToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => OrganisationEntity)
  organisation!: OrganisationEntity;
}
