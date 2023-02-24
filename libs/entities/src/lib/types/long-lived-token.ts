import { RefreshTokenEntity, UserEntity } from "@translate-dashboard/entities";

export type LongLivedToken = {
  user: UserEntity;
  refreshToken: RefreshTokenEntity;
};
