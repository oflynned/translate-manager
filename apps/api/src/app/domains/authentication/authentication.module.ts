import { Module } from "@nestjs/common";
import {
  AuthenticationService,
  IAuthenticationService,
} from "./authentication.service";
import { UserModule } from "../user/user.module";
import { HashingModule } from "../hashing/hashing.module";

@Module({
  imports: [UserModule, HashingModule],
  providers: [
    { provide: IAuthenticationService, useClass: AuthenticationService },
  ],
  exports: [IAuthenticationService],
})
export class AuthenticationModule {}
