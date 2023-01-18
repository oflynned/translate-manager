import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigService, IApiConfigService } from "./api-config.service";

@Module({
  imports: [ConfigModule],
  providers: [{ provide: IApiConfigService, useClass: ApiConfigService }],
  exports: [IApiConfigService],
})
export class ApiConfigModule {}
