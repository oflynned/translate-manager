import { Options, defineConfig } from "@mikro-orm/postgresql";
import {
  MemberEntity,
  OrganisationEntity,
  RefreshTokenEntity,
  UserEntity,
} from "@translate-dashboard/entities";
import { ReflectMetadataProvider } from "@mikro-orm/core";
import * as process from "process";
export const getDatabaseConfig = (): Options => {
  return defineConfig({
    clientUrl: process.env.DATABASE_URL,
    metadataProvider: ReflectMetadataProvider,
    entities: [
      UserEntity,
      MemberEntity,
      OrganisationEntity,
      RefreshTokenEntity,
    ],
  });
};
