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
  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  hash!: string;

  @OneToMany(() => OrganisationEntity, (organisation) => organisation.founder)
  founderOf = new Collection<OrganisationEntity>(this);

  @OneToOne(() => MemberEntity, (member) => member.user)
  memberOf = new Collection<MemberEntity>(this);

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens = new Collection<RefreshTokenEntity>(this);
}
