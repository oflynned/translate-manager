import { Module } from "@nestjs/common";
import { JwtResolver } from "./jwt.resolver";

@Module({
  imports: [],
  providers: [JwtResolver],
  exports: [JwtResolver],
})
export class JwtGraphQLModule {}
