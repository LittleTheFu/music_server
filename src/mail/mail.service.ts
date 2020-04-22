import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Mail, RetMail } from './entity/mail.entity';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(Mail)
        private readonly MailRepository: Repository<Mail>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {

    }

    async sendMail(fromId: number, toId: number, content: string): Promise<object> {
        const mail = new Mail();
        mail.content = content;

        const fromUser = await this.userRepository.findOne({id: fromId});
        const toUser = await this.userRepository.findOne({id: toId});

        mail.from = fromUser;
        mail.to = toUser;

        await this.MailRepository.save(mail);

        return {msg:'ok'};
    }

    async deleteMail(userId: number, mailId: number): Promise<RetMail[]> {
        console.log('mail : ' + mailId);
        await this.MailRepository
            .createQueryBuilder()
            .delete()
            .from(Mail)
            .where("id = :id", { id: mailId })
            .execute();

        const mails = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'user')
            .innerJoinAndSelect('mail.from', 'tuser')
            .where('user.id = :id', { id: userId })
            .getMany();

        const retMails = mails.map((m) => {
            const r = new RetMail();
            r.content = m.content;
            r.fromName = m.from.name;
            r.toName = m.to.name;
            r.id = m.id;

            return r;
        })

        return retMails;
    }

    async getMail(mailId: number): Promise<RetMail> {
        // const mail = await this.MailRepository.findOne(mailId);
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
            const r = new RetMail();
            r.content = m.content;
            r.fromName = m.from.name;
            r.toName = m.to.name;
            r.id = m.id;

            return r;
        })

        return retMails;

        // const m = new RetMail();
        // m.id = 1;
        // m.content = 'hello';
        // m.fromName = 'from';
        // m.toName = 'to';

        // const n = new RetMail();
        // n.id = 2;
        // n.content = 'n';
        // n.fromName = 'from';
        // n.toName = 'to';

        // const ret = [m,n];
        // return ret;
    }

}