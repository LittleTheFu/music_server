import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { HelperService } from './helper/helper.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);

  const helperService = app.get(HelperService);

  const hostName = helperService.getHostName();
  const port = helperService.getProt();

  await app.listen(port, hostName);

  const ss = app.get(SeedService);
  ss.initDbData();
}
bootstrap();