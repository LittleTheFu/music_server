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

    public sendEmail(address: string, subject: string, msg: string): void {
        this
            .mailerService
            .sendMail({
                to: address, // list of receivers
                from: this.configService.get('MAILER_EMAIL'), // sender address
                subject: subject, // Subject line
                text: msg, // plaintext body
                html: msg, // HTML body content
            })
            .then(() => { console.log('email send!') })
            .catch((e) => { console.log(e); });
    }
}