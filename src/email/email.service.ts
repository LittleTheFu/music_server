import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService) { }

        private getWelcomeMsg(): string {
            return 'please remeber the address: http://' + this.configService.get('HSTNAME');
        }

    public sendEmail(): void {
        this
            .mailerService
            .sendMail({
                to: this.configService.get('MAILER_EMAIL'), // list of receivers
                from: this.configService.get('MAILER_EMAIL'), // sender address
                subject: 'Thank you for registering!!!', // Subject line
                text: this.getWelcomeMsg(), // plaintext body
                html: this.getWelcomeMsg(), // HTML body content
            })
            .then(() => { console.log('email send!') })
            .catch((e) => { console.log(e); });
    }
}