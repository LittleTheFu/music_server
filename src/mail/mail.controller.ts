import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetMail } from './entity/mail.entity';
import { DeleteMailDto } from './dto/mail.dto';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('GetMails')
    async getMails(@Request() req): Promise<RetMail[]> {
        return this.mailService.getMails(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('DeleteMail')
    async deleteMail(@Request() req, @Body() deleteMailDto: DeleteMailDto): Promise<RetMail[]> {
        console.log(deleteMailDto);
        return this.mailService.deleteMail(req.user.userId, deleteMailDto.mailId);
    }
}