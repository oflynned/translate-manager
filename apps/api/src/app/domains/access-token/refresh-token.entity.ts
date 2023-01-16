import { UserEntity } from "../user/repo/user.entity";

export class RefreshTokenEntity {
  id: string;
  user: UserEntity;
  revoked: boolean;
  revokedAt: Date;
  expiresAt: Date;
}
