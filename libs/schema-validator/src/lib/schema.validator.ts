import { z } from "zod";
import { Err, Ok, Result } from "ts-results";
import { InvalidDtoException } from "./invalid-dto.exception";

export abstract class SchemaValidator<T> {
  protected abstract getSchema(): z.ZodSchema<T>;

  validate(dto: T): Result<T, InvalidDtoException> {
    const result = this.getSchema().safeParse(dto);

    if (result.success) {
      return Ok(result.data);
    }

    const [error] = result.error.errors;

    return Err(new InvalidDtoException(error.message));
  }
}
