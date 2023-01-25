import { Module } from "@nestjs/common";
import { OrganisationResolver } from "./organisation.resolver";
import { CreateOrganisationSchema } from "./schema/create-organisation.schema";
import { OrganisationMapper } from "./organisation.mapper";
import { OrganisationModule } from "../../domains/organisation/organisation.module";
import { AuthenticationModule } from "../../domains/authentication/authentication.module";

@Module({
  imports: [OrganisationModule, AuthenticationModule],
  providers: [
    OrganisationResolver,
    CreateOrganisationSchema,
    OrganisationMapper,
  ],
  exports: [OrganisationResolver],
})
export class OrganisationGraphqlModule {}
