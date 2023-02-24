import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { UserModule } from "../user/user.module";
import { HashingModule } from "../hashing/hashing.module";
import { RefreshTokenService } from "./refresh-token/refresh-token.service";
import { AccessTokenService } from "./access-token/access-token.service";
import {
  IRefreshTokenRepo,
  RefreshTokenRepo,
} from "./refresh-token/refresh-token.repo";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigModule } from "../api-config/api-config.module";
import {
  IAccessTokenService,
  IApiConfigService,
  IAuthenticationService,
  IRefreshTokenService,
} from "@translate-dashboard/service-definitions";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RefreshTokenEntity } from "@translate-dashboard/entities";

@Module({
  imports: [
    UserModule,
    HashingModule,
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [IApiConfigService],
      useFactory: (config: IApiConfigService) => {
        const secret = config.getJwtSecret();

        if (secret.err) {
          throw secret.val;
        }

        return {
          secret: secret.val,
          signOptions: {
            expiresIn: "1h",
          },
        };
      },
    }),
    MikroOrmModule.forFeature([RefreshTokenEntity]),
    ApiConfigModule,
  ],
  providers: [
    { provide: IAuthenticationService, useClass: AuthenticationService },
    { provide: IRefreshTokenService, useClass: RefreshTokenService },
    { provide: IRefreshTokenRepo, useClass: RefreshTokenRepo },
    { provide: IAccessTokenService, useClass: AccessTokenService },
  ],
  exports: [IAuthenticationService, IRefreshTokenService, IAccessTokenService],
})
export class AuthenticationModule {}
