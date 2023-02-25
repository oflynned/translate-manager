import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MemberEntity } from "@translate-dashboard/entities";
import { OrganisationModule } from "../organisation";
import { IMemberRepo, MemberRepo } from "./member.repo";
import { IMemberService } from "@translate-dashboard/service-definitions";
import { MemberService } from "./member.service";
import { UserModule } from "../user";

@Module({
  imports: [
    MikroOrmModule.forFeature([MemberEntity]),
    UserModule,
    OrganisationModule,
  ],
  providers: [
    {
      provide: IMemberRepo,
      useClass: MemberRepo,
    },
    {
      provide: IMemberService,
      useClass: MemberService,
    },
  ],
  exports: [IMemberService],
})
export class MemberModule {}
