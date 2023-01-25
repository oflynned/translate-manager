import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserModule } from "../../domains/user/user.module";
import { AuthenticationModule } from "../../domains/authentication/authentication.module";
import { UserMapper } from "./user.mapper";
import { CreateUserSchema } from "./schemas/create-user.schema";

@Module({
  imports: [UserModule, AuthenticationModule],
  providers: [UserResolver, UserMapper, CreateUserSchema],
  exports: [UserResolver],
})
export class UserGraphQLModule {}
