import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiModule } from "./app/api.module";
import { IApiConfigService } from "@translate-dashboard/service-definitions";

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const config = app.get(IApiConfigService);

  const port = config.getPort();
  const portValue = port.err ? 3000 : port.val;

  await app.listen(portValue, () => {
    Logger.log(`🚀 Application is running on: http://localhost:${portValue}`);
  });
}

bootstrap();
