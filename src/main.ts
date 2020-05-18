import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HelperService } from './helper/helper.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const helperService = app.get(HelperService);

//  app.enableCors({
//     origin: [
//       'http://localhost:3000',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 200,
//     credentials: true,
//     allowedHeaders:
//       'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
//   })

  await app.listen(helperService.getProt());
}
bootstrap();
