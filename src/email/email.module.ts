import { Module } from '@nestjs/common';
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

//Warning: you shuold set these variables in .env file
// MAILER_EMAIL=
// MAILER_PASSWORD=
// MAILER_HOST=

@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            transport: `smtps://${configService.get(
                'MAILER_EMAIL',
            )}:${configService.get('MAILER_PASSWORD')}@${configService.get(
                'MAILER_HOST',
            )}`,
            defaults: {
                from: '"nest-modules" <modules@nestjs.com>',
            },
        }),
        inject: [ConfigService],
    })],
    providers: [EmailService],
    exports: [EmailService],
})

export class EmailModule { }