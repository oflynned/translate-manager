import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../../../domains/user/service/dto/create-user.dto";
import { Err, Ok, Result } from "ts-results";
import { z } from "zod";
import { InvalidDtoException } from "../exceptions/invalid-dto.exception";

abstract class SchemaValidator<T> {
  abstract getSchema(): z.ZodSchema<T>;

  validate(dto: T): Result<T, InvalidDtoException> {
    const result = this.getSchema().safeParse(dto);

    if (result.success) {
      return Ok(result.data);
    }

    const [error] = result.error.errors;

    return Err(new InvalidDtoException(error.message));
  }
}

@Injectable()
export class CreateUserSchema extends SchemaValidator<CreateUserDto> {
  getSchema(): z.ZodSchema<CreateUserDto> {
    return z.object({
      name: z.string().min(1, "Name cannot be empty"),
      email: z.string().email("Email is not valid"),
      password: z
        .string()
        .min(6, "Password too short")
        .max(128, "Password too long"),
    });
  }
}
