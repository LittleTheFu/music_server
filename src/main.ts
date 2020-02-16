import { NestFactory, APP_FILTER } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  console.log(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // global['nestHttpServer'] = app;
  // await app.listen(9999,'localhost');
  await app.listen(9999);
}
bootstrap();
