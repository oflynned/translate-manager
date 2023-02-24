import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UserGraphQLModule } from "./graphql/user/user.module";
import { JwtGraphQLModule } from "./graphql/jwt/jwt.graphql.module";
import { OrganisationGraphqlModule } from "./graphql/organisation/organisation.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { IApiConfigService } from "@translate-dashboard/service-definitions";
import { getDatabaseConfig } from "@translate-dashboard/mikro-orm";
import {
  ApiConfigModule,
  AuthenticationModule,
  AuthorisationModule,
  HashingModule,
  MemberModule,
  OrganisationModule,
  UserModule,
} from "@translate-dashboard/domains";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [IApiConfigService],
      useFactory: (configService: IApiConfigService) => {
        return getDatabaseConfig(configService);
      },
    }),
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
    MemberModule,
    OrganisationModule,
    UserModule,
    UserGraphQLModule,
    JwtGraphQLModule,
    OrganisationGraphqlModule,
  ],
})
export class ApiModule {}
