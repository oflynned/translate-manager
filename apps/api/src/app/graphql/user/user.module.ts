import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserModule } from "../../domains/user/user.module";

@Module({
  imports: [UserModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserGraphQLModule {}
