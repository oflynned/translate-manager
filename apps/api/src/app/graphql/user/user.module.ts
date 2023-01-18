import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserModule } from "../../domains/user/user.module";
import { AuthenticationModule } from "../../domains/authentication/authentication.module";

@Module({
  imports: [UserModule, AuthenticationModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserGraphQLModule {}
