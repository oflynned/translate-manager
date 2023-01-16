import { Module } from "@nestjs/common";
import { ITermService, TermService } from "./term.service";

@Module({
  imports: [],
  providers: [{ provide: ITermService, useClass: TermService }],
  exports: [ITermService],
})
export class TermModule {}
