import { Module } from "@nestjs/common";
import { MemberRoleMapper } from "./member-role.mapper";
import { MemberResolver } from "./member.resolver";
import { MemberModule } from "@translate-dashboard/domains";

@Module({
  imports: [MemberModule],
  providers: [MemberRoleMapper, MemberResolver],
})
export class MemberGraphqlModule {}
