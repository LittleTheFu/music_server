import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Mail, RetMail } from './entity/mail.entity';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(Mail)
        private readonly MailRepository: Repository<Mail>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {

    }

    private getReturnMail(m: Mail): RetMail {
        const r = new RetMail();

        r.id = m.id;
        r.fromId = m.from.id;
        r.fromName = m.from.name;
        r.toName = m.to.name;
        r.content = m.content;

        return r;
    }

    async sendMail(fromId: number, toId: number, content: string): Promise<RetMsgObj> {
        const mail = new Mail();
        mail.content = content;

        const fromUser = await this.userRepository.findOne({ id: fromId });
        const toUser = await this.userRepository.findOne({ id: toId });

        mail.from = fromUser;
        mail.to = toUser;

        await this.MailRepository.save(mail);

        return new RetMsgObj();
    }

    async deleteMail(userId: number, mailId: number): Promise<RetMsgObj> {
        console.log('mail : ' + mailId);
        await this.MailRepository
            .createQueryBuilder()
            .delete()
            .from(Mail)
            .where("id = :id", { id: mailId })
            .execute();

        return new RetMsgObj();
    }

    async getMail(mailId: number): Promise<RetMail> {
        const mail = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'user')
            .innerJoinAndSelect('mail.from', 'tuser')
            .where('mail.id = :id', { id: mailId })
            .getOne();

        const retMail = new RetMail();
        retMail.id = mail.id;
        retMail.fromName = mail.from.name;
        retMail.toName = mail.to.name;
        retMail.content = mail.content;
        retMail.fromId = mail.from.id;

        return retMail;
    }

    async getMails(userId: number): Promise<RetMail[]> {
        const mails = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'user')
            .innerJoinAndSelect('mail.from', 'tuser')
            .where('user.id = :id', { id: userId })
            .getMany();


        const retMails = mails.map((m) => {
           return this.getReturnMail(m);
        })

        return retMails;
    }

}