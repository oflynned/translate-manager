import { Result } from "ts-results";
import { InvalidHashException } from "@translate-dashboard/exceptions";

export abstract class IHashingAlgorithm {
  abstract compare(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<Result<boolean, InvalidHashException>>;
  abstract hash(
    password: string
  ): Promise<Result<string, InvalidHashException>>;
}
