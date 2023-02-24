import { Injectable } from "@nestjs/common";
import { RefreshTokenEntity, UserEntity } from "@translate-dashboard/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";

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
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: EntityRepository<RefreshTokenEntity>
  ) {}

  async revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<RefreshTokenEntity> {
    refreshToken.revokedAt = new Date();
    refreshToken.revoked = true;

    return refreshToken;
  }

  async getRefreshTokenById(id: string): Promise<RefreshTokenEntity | null> {
    return this.repo.findOne({ id });
  }

  async createRefreshToken(
    user: UserEntity,
    ttl: number
  ): Promise<RefreshTokenEntity> {
    const refreshToken = new RefreshTokenEntity();

    refreshToken.user = user;
    refreshToken.expiresAt = new Date(Date.now() + ttl);

    await this.repo.persistAndFlush(refreshToken);

    return refreshToken;
  }
}
