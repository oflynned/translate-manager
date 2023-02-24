import { Result } from "ts-results";
import { MissingConfigItemException } from "@translate-dashboard/exceptions";

export abstract class IApiConfigService {
  abstract getDatabaseUrl(): Result<string, MissingConfigItemException>;
  abstract getRedisUrl(): Result<string, MissingConfigItemException>;
  abstract getTokenIssuer(): Result<string, MissingConfigItemException>;
  abstract getJwtSecret(): Result<string, MissingConfigItemException>;
  abstract getPort(): Result<number, MissingConfigItemException>;
}
