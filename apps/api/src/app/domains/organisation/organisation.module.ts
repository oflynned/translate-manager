import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import {
  IOrganisationService,
  OrganisationService,
} from "./organisation.service";
import { IOrganisationRepo, OrganisationRepo } from "./organisation.repo";

@Module({
  imports: [UserModule],
  providers: [
    { provide: IOrganisationService, useClass: OrganisationService },
    { provide: IOrganisationRepo, useClass: OrganisationRepo },
  ],
  exports: [IOrganisationService],
})
export class OrganisationModule {}
