import { IApiConfigService } from "@translate-dashboard/service-definitions";
import { Options, defineConfig } from "@mikro-orm/postgresql";
import {
  MemberEntity,
  OrganisationEntity,
  RefreshTokenEntity,
  UserEntity,
} from "@translate-dashboard/entities";
import { ReflectMetadataProvider } from "@mikro-orm/core";

export const getDatabaseConfig = (
  configService: IApiConfigService
): Options => {
  const url = configService.getDatabaseUrl();

  if (url.err) {
    throw new Error(url.val.name);
  }

  return defineConfig({
    clientUrl: url.val,
    metadataProvider: ReflectMetadataProvider,
    debug: true,
    entities: [
      UserEntity,
      MemberEntity,
      OrganisationEntity,
      RefreshTokenEntity,
    ],
  });
};
