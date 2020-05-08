import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetMail } from './entity/mail.entity';
import { DeleteMailDto, SendMailDto, GetMailDto } from './dto/mail.dto';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

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
    @Post('GetMail')
    async getMail(@Request() req, @Body() getMailDto: GetMailDto): Promise<RetMail> {
        return this.mailService.getMail(getMailDto.mailId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('DeleteMail')
    async deleteMail(@Request() req, @Body() deleteMailDto: DeleteMailDto): Promise<RetMsgObj> {
        console.log(deleteMailDto);
        return this.mailService.deleteMail(req.user.userId, deleteMailDto.mailId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('SendMail')
    async sendMail(@Request() req, @Body() sendMailDto: SendMailDto): Promise<RetMsgObj> {
        return this.mailService.sendMail(req.user.userId, sendMailDto.toId, sendMailDto.content)
    }
}