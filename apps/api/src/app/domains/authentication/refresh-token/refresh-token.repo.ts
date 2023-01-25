import { Injectable } from "@nestjs/common";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { UserEntity } from "../../user/repo/user.entity";

export abstract class IRefreshTokenRepo {
  abstract createRefreshToken(
    user: UserEntity,
    ttl: number
  ): Promise<RefreshTokenEntity>;
  abstract revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<RefreshTokenEntity>;

  abstract getRefreshTokenById(id: string): Promise<RefreshTokenEntity | null>;
}

@Injectable()
export class RefreshTokenRepo implements IRefreshTokenRepo {
  private readonly refreshTokens: RefreshTokenEntity[] = [];

  async revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<RefreshTokenEntity> {
    refreshToken.revokedAt = new Date();
    refreshToken.revoked = true;

    return refreshToken;
  }

  async getRefreshTokenById(id: string): Promise<RefreshTokenEntity | null> {
    const token = this.refreshTokens.find((token) => token.id === id);

    return token ?? null;
  }

  async createRefreshToken(
    user: UserEntity,
    ttl: number
  ): Promise<RefreshTokenEntity> {
    const expiresAt = new Date(Date.now() + ttl);
    const refreshToken = new RefreshTokenEntity(user, expiresAt);

    this.refreshTokens.push(refreshToken);

    return refreshToken;
  }
}
