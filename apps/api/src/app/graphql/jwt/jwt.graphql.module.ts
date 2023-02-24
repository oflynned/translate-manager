import { Module } from "@nestjs/common";
import { JwtResolver } from "./jwt.resolver";
import { AuthenticationModule } from "@translate-dashboard/domains";

@Module({
  imports: [AuthenticationModule],
  providers: [JwtResolver],
  exports: [JwtResolver],
})
export class JwtGraphQLModule {}
