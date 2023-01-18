import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Err, Ok, Result } from "ts-results";
import { InvalidHashException } from "./exceptions/invalid-hash.exception";

export abstract class IHashingAlgorithm {
  abstract compare(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<Result<boolean, InvalidHashException>>;
  abstract hash(
    password: string
  ): Promise<Result<string, InvalidHashException>>;
}

@Injectable()
export class BcryptAlgorithm implements IHashingAlgorithm {
  private readonly SALT_ROUNDS = 10;

  async compare(
    passwordAttempt: string,
    hashedPassword: string
  ): Promise<Result<boolean, InvalidHashException>> {
    try {
      const isMatch = await bcrypt.compare(passwordAttempt, hashedPassword);

      return Ok(isMatch);
    } catch (e) {
      return Err(new InvalidHashException());
    }
  }

  async hash(password: string): Promise<Result<string, InvalidHashException>> {
    try {
      const hash = await bcrypt.hash(password, this.SALT_ROUNDS);

      return Ok(hash);
    } catch (e) {
      return Err(new InvalidHashException());
    }
  }
}
