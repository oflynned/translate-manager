import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { GraphqlResultMapperModule } from "@translate-manager/graphql-types";
import { AuthenticationModule, UserModule } from "@translate-dashboard/domains";

@Module({
  imports: [UserModule, AuthenticationModule, GraphqlResultMapperModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserGraphQLModule {}
