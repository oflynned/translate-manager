/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ApiModule } from "./app/api.module";
import { IApiConfigService } from "@translate-dashboard/service-definitions";

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const config = app.get(IApiConfigService);
  const portResult = config.getPort();
  const port = portResult.err ? 3000 : portResult.val;

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
