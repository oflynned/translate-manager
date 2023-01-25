import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../../../../../../../libs/dto/src/lib/user/create-user.dto";
import { z } from "zod";
import { SchemaValidator } from "@translate-dashboard/schema-validator";

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
