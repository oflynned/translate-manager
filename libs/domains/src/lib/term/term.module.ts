import { Module } from "@nestjs/common";
import { ITermService, TermService } from "./term.service";
import { ITermRepo, TermRepo } from "./term.repo";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { TermEntity } from "@translate-dashboard/entities";
import { TermGenderMapper } from "./term-gender.mapper";
import { OrganisationModule } from "../organisation";

@Module({
  imports: [OrganisationModule, MikroOrmModule.forFeature([TermEntity])],
  providers: [
    { provide: ITermService, useClass: TermService },
    { provide: ITermRepo, useClass: TermRepo },
    TermGenderMapper,
  ],
  exports: [ITermService, TermGenderMapper],
})
export class TermModule {}
