import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";

@Entity()
export class RefreshTokenEntity extends BaseEntity {
  @Property({ type: "boolean" })
  revoked = false;

  @Property({ type: "datetime", nullable: true })
  revokedAt?: Date;

  @Property({ type: "datetime" })
  expiresAt!: Date;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
