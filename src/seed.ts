import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  await app.listen(9999);

  const ss = app.get(SeedService);
//   console.log(ss);
  ss.initDbData();
}
bootstrap();