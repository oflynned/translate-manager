import { Module } from "@nestjs/common";
import { OrganisationResolver } from "./organisation.resolver";
import { GraphqlResultMapperModule } from "@translate-manager/graphql-types";
import {
  AuthenticationModule,
  OrganisationModule,
  UserModule,
} from "@translate-dashboard/domains";
import { CreateOrganisationSchema } from "@translate-dashboard/schema-validator";

@Module({
  imports: [
    OrganisationModule,
    AuthenticationModule,
    UserModule,
    GraphqlResultMapperModule,
  ],
  providers: [OrganisationResolver, CreateOrganisationSchema],
  exports: [OrganisationResolver],
})
export class OrganisationGraphqlModule {}
