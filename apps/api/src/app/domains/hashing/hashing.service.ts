import { Injectable } from "@nestjs/common";
import { IHashingAlgorithm } from "./bcrypt-algorithm.service";
import { InvalidHashException } from "./exceptions/invalid-hash.exception";
import { Result } from "ts-results";

export abstract class IHashingService {
  abstract toHash(
    password: string
  ): Promise<Result<string, InvalidHashException>>;
  abstract isValid(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<boolean>;
}

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
