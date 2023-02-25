import {
  OneToMany,
  Entity,
  Property,
  Collection,
  OneToOne,
} from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { MemberEntity } from "./member.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { OrganisationEntity } from "./organisation.entity";

@Entity()
export class UserEntity extends BaseEntity {
  @Property({ type: "string" })
  name!: string;

  @Property({ type: "string" })
  email!: string;

  @Property({ type: "string" })
  hash!: string;

  @OneToMany(() => OrganisationEntity, (organisation) => organisation.founder)
  founderOf = new Collection<OrganisationEntity>(this);

  @OneToMany(() => MemberEntity, (member) => member.user)
  memberOf = new Collection<MemberEntity>(this);

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens = new Collection<RefreshTokenEntity>(this);
}
