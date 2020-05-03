import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(SeedModule);

  const configService = app.get(ConfigService);

  const hostName = configService.get<string>('HOSTNAME');
  const port = configService.get<string>('PORT');

  await app.listen(port, hostName);

  const ss = app.get(SeedService);
  //   console.log(ss);
  ss.initDbData();
}
bootstrap();