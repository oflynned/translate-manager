import { Injectable } from "@nestjs/common";
import { InvalidHashException } from "@translate-dashboard/exceptions";
import { Result } from "ts-results";
import {
  IHashingAlgorithm,
  IHashingService,
} from "@translate-dashboard/service-definitions";

@Injectable()
export class HashingService implements IHashingService {
  constructor(private readonly algorithm: IHashingAlgorithm) {}

  async isValid(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await this.algorithm.compare(
      passwordAttempt,
      hashedPassword
    );

    if (result.err) {
      return false;
    }

    return result.val;
  }

  async toHash(
    password: string
  ): Promise<Result<string, InvalidHashException>> {
    return this.algorithm.hash(password);
  }
}
