import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigService } from "./api-config.service";
import { IApiConfigService } from "@translate-dashboard/service-definitions";

@Module({
  imports: [ConfigModule],
  providers: [{ provide: IApiConfigService, useClass: ApiConfigService }],
  exports: [IApiConfigService],
})
export class ApiConfigModule {}
