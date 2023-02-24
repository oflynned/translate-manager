import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Err, Ok, Result } from "ts-results";
import { MissingConfigItemException } from "@translate-dashboard/exceptions";
import { IApiConfigService } from "@translate-dashboard/service-definitions";

@Injectable()
export class ApiConfigService implements IApiConfigService {
  constructor(private readonly config: ConfigService) {}

  private getValue<T>(key: string): Result<T, MissingConfigItemException> {
    const value = this.config.get<T>(key);

    if (!value) {
      return Err(new MissingConfigItemException(`Missing env var: ${key}`));
    }

    return Ok(value);
  }

  getDatabaseUrl(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("DATABASE_URL");
  }

  getRedisUrl(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("REDIS_URL");
  }

  getTokenIssuer(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("SERVICE_NAME");
  }

  getJwtSecret(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("JWT_SECRET");
  }

  getPort(): Result<number, MissingConfigItemException> {
    return this.getValue<number>("PORT");
  }
}
