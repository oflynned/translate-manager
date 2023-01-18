import { UserEntity } from "../../user/repo/user.entity";

export class RefreshTokenEntity {
  id: string;
  user: UserEntity;
  revoked: boolean;
  revokedAt: Date;
  expiresAt: Date;

  constructor(user: UserEntity, expiresAt: Date) {
    this.id = Date.now().toString();
    this.revoked = false;
    this.user = user;
    this.expiresAt = expiresAt;
  }
}
