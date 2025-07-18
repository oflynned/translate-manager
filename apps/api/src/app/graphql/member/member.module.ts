import { Module } from "@nestjs/common";
import { MemberResolver } from "./member.resolver";
import { MemberModule } from "@translate-dashboard/domains";

@Module({
  imports: [MemberModule],
  providers: [MemberResolver],
})
export class MemberGraphqlModule {}
