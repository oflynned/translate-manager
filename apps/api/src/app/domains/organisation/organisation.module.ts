import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { OrganisationService } from "./organisation.service";
import { IOrganisationRepo, OrganisationRepo } from "./organisation.repo";
import { IOrganisationService } from "@translate-dashboard/service-definitions";

@Module({
  imports: [UserModule],
  providers: [
    { provide: IOrganisationService, useClass: OrganisationService },
    { provide: IOrganisationRepo, useClass: OrganisationRepo },
  ],
  exports: [IOrganisationService],
})
export class OrganisationModule {}
