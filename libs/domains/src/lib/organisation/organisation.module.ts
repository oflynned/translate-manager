import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { OrganisationService } from "./organisation.service";
import { IOrganisationRepo, OrganisationRepo } from "./organisation.repo";
import { IOrganisationService } from "@translate-dashboard/service-definitions";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { OrganisationEntity } from "@translate-dashboard/entities";
import { CreateOrganisationSchema } from "../../../../schema-validator/src/lib/create-organisation.schema";

@Module({
  imports: [UserModule, MikroOrmModule.forFeature([OrganisationEntity])],
  providers: [
    { provide: IOrganisationService, useClass: OrganisationService },
    { provide: IOrganisationRepo, useClass: OrganisationRepo },
    CreateOrganisationSchema,
  ],
  exports: [IOrganisationService],
})
export class OrganisationModule {}
