require("dotenv").config();

import { defineConfig } from "@mikro-orm/postgresql";
import {
  MemberEntity,
  OrganisationEntity,
  RefreshTokenEntity,
  UserEntity,
} from "./libs/entities/src";
import { ReflectMetadataProvider } from "@mikro-orm/core";

export default defineConfig({
  entities: [UserEntity, MemberEntity, OrganisationEntity, RefreshTokenEntity],
  metadataProvider: ReflectMetadataProvider,
  clientUrl: process.env.DATABASE_URL,
});
