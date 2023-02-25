import { Module } from "@nestjs/common";
import { MemberRoleMapper } from "./member-role.mapper";

@Module({
  imports: [],
  providers: [MemberRoleMapper],
  exports: [],
})
export class MemberGraphqlModule {}
