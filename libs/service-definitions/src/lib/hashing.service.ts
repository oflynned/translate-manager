import { Result } from "ts-results";
import { InvalidHashException } from "@translate-dashboard/exceptions";

export abstract class IHashingService {
  abstract toHash(
    password: string
  ): Promise<Result<string, InvalidHashException>>;
  abstract isValid(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<boolean>;
}
