import { UserEntity } from "./user.entity";
import { OrganisationEntity } from "./organisation.entity";
import { BaseEntity } from "./base.entity";
import { Entity, Enum, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { MemberRole } from "./role";

@Entity()
export class MemberEntity extends BaseEntity {
  @Property({ type: "datetime" })
  invitedAt!: Date;

  @Property({ type: "datetime", nullable: true })
  acceptedInviteAt?: Date;

  @Enum(() => MemberRole)
  role!: MemberRole;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @OneToOne(() => MemberEntity, { nullable: true })
  addedBy?: MemberEntity;

  @ManyToOne(() => OrganisationEntity)
  organisation!: OrganisationEntity;
}
