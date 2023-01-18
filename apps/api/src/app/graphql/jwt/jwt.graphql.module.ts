import { Module } from "@nestjs/common";
import { JwtResolver } from "./jwt.resolver";
import { AuthenticationModule } from "../../domains/authentication/authentication.module";

@Module({
  imports: [AuthenticationModule],
  providers: [JwtResolver],
  exports: [JwtResolver],
})
export class JwtGraphQLModule {}
