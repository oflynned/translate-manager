import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";

@Entity()
export class RefreshTokenEntity extends BaseEntity {
  @Property()
  revoked = false;

  @Property()
  revokedAt?: Date;

  @Property()
  expiresAt!: Date;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
