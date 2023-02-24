import { Module } from "@nestjs/common";
import { CreateUserSchema } from "./create-user.schema";
import { CreateOrganisationSchema } from "./create-organisation.schema";

@Module({
  imports: [],
  providers: [CreateUserSchema, CreateOrganisationSchema],
  exports: [CreateUserSchema, CreateOrganisationSchema],
})
export class ValidatorModule {}
