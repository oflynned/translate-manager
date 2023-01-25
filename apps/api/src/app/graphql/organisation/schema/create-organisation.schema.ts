import { CreateOrganisationDto } from "@translate-dashboard/dto";
import { SchemaValidator } from "@translate-dashboard/schema-validator";
import { z, ZodType } from "zod";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateOrganisationSchema extends SchemaValidator<CreateOrganisationDto> {
  protected getSchema(): ZodType<CreateOrganisationDto> {
    return z.object({
      name: z.string().min(3, "Name is too short").max(128, "Name is too long"),
    });
  }
}
