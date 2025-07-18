import { Module } from "@nestjs/common";
import { TermResolver } from "./term.resolver";
import { MemberModule, TermModule } from "@translate-dashboard/domains";

@Module({
  imports: [TermModule, MemberModule],
  providers: [TermResolver],
})
export class TermGraphqlModule {}
