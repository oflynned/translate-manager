import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Err, Ok, Result } from "ts-results";
import { MissingConfigItemException } from "./missing-config-item.exception";

export abstract class IApiConfigService {
  abstract getDatabaseUrl(): Result<string, MissingConfigItemException>;
  abstract getRedisUrl(): Result<string, MissingConfigItemException>;
  abstract getServiceName(): Result<string, MissingConfigItemException>;
}

@Injectable()
export class ApiConfigService implements IApiConfigService {
  constructor(private readonly config: ConfigService) {}

  private getValue<T>(key: string): Result<T, MissingConfigItemException> {
    const value = this.config.get<T>(key);

    if (!value) {
      return Err(new MissingConfigItemException());
    }

    return Ok(value);
  }

  getDatabaseUrl(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("DATABASE_URL");
  }

  getRedisUrl(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("REDIS_URL");
  }

  getServiceName(): Result<string, MissingConfigItemException> {
    return this.getValue<string>("SERVICE_NAME");
  }
}
