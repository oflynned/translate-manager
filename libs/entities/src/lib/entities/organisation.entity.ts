import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { MemberEntity } from "./member.entity";
import { TermEntity } from "./term.entity";

@Entity()
export class OrganisationEntity extends BaseEntity {
  @Property({ type: "string" })
  name!: string;

  @ManyToOne(() => UserEntity)
  founder!: UserEntity;

  @OneToMany(() => MemberEntity, (member) => member.organisation)
  members = new Collection<MemberEntity>(this);

  @OneToMany(() => TermEntity, (term) => term.organisation)
  terms = new Collection<TermEntity>(this);
}
