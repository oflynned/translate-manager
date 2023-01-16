import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private readonly config: ConfigService) {}

  getDatabaseUrl(): string {
    return this.config.getOrThrow<string>("DATABASE_URL");
  }

  getRedisUrl(): string {
    return this.config.getOrThrow<string>("REDIS_URL");
  }
}
