import { Module } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import { OrganisationMapper } from "./organisation.mapper";

@Module({
  imports: [],
  providers: [UserMapper, OrganisationMapper],
  exports: [UserMapper, OrganisationMapper],
})
export class GraphqlResultMapperModule {}
