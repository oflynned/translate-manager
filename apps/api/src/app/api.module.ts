import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthenticationModule } from "./domains/authentication/authentication.module";
import { OrganisationModule } from "./domains/organisation/organisation.module";
import { UserModule } from "./domains/user/user.module";
import { HashingModule } from "./domains/hashing/hashing.module";
import { AuthorisationModule } from "./domains/authorisation/authorisation.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApiConfigModule } from "./domains/api-config/api-config.module";
import { UserGraphQLModule } from "./graphql/user/user.module";
import { JwtGraphQLModule } from "./graphql/jwt/jwt.graphql.module";
import { OrganisationGraphqlModule } from "./graphql/organisation/organisation.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ApiConfigModule],
      useFactory: () => {
        return {
          cache: "bounded",
          allowBatchedHttpRequests: true,
          useGlobalPrefix: true,
          playground: true,
          debug: true,
          typePaths: ["**/*.graphql"],
        };
      },
    }),
    AuthenticationModule,
    AuthorisationModule,
    HashingModule,
    OrganisationModule,
    UserModule,
    UserGraphQLModule,
    JwtGraphQLModule,
    OrganisationGraphqlModule,
  ],
})
export class ApiModule {}
