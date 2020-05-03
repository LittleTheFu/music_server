import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HelperService } from './helper/helper.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const helperService = app.get(HelperService);
  await app.listen(helperService.getProt(), helperService.getHostName());
}
bootstrap();
