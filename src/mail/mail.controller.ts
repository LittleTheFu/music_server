import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetMail } from './entity/mail.entity';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('GetMails')
    async getMails(): Promise<RetMail[]> {
        return this.mailService.getMails(3);
    }
}