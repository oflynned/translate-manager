import { Module } from "@nestjs/common";
import {
  AuthenticationService,
  IAuthenticationService,
} from "./authentication.service";
import { UserModule } from "../user/user.module";
import { HashingModule } from "../hashing/hashing.module";
import {
  IRefreshTokenService,
  RefreshTokenService,
} from "./refresh-token/refresh-token.service";
import {
  AccessTokenService,
  IAccessTokenService,
} from "./access-token/access-token.service";
import {
  IRefreshTokenRepo,
  RefreshTokenRepo,
} from "./refresh-token/refresh-token.repo";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigModule } from "../api-config/api-config.module";
import { IApiConfigService } from "../api-config/api-config.service";

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
