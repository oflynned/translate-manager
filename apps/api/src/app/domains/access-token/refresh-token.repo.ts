import { Injectable } from "@nestjs/common";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { UserEntity } from "../user/repo/user.entity";
import { Result } from "ts-results";

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
  async revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<RefreshTokenEntity> {
    refreshToken.revokedAt = new Date();
    refreshToken.revoked = true;

    return refreshToken;
  }

  async getRefreshTokenById(id: string): Promise<RefreshTokenEntity | null> {
    return null;
  }

  async createRefreshToken(
    user: UserEntity,
    ttl: number
  ): Promise<RefreshTokenEntity> {
    return new RefreshTokenEntity();
  }
}
