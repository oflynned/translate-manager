import { Module } from "@nestjs/common";
import { OrganisationResolver } from "./organisation.resolver";
import { CreateOrganisationSchema } from "./schema/create-organisation.schema";
import { OrganisationMapper } from "./organisation.mapper";

@Module({
  imports: [],
  providers: [
    OrganisationResolver,
    CreateOrganisationSchema,
    OrganisationMapper,
  ],
  exports: [OrganisationResolver],
})
export class OrganisationModule {}
