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
            .where('user.id = :id', { id: userId })
            .getMany();


        const retMails = mails.map((m) => {
            const r = new RetMail();
            r.content = m.content;
            r.fromName = 'from';
            r.toName = 'to';
            r.id = m.id;

            return r;
        })

        return retMails;
    }

    async getMails(userId: number): Promise<RetMail[]> {
        const mails = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'user')
            .where('user.id = :id', { id: userId })
            .getMany();


        const retMails = mails.map((m) => {
            const r = new RetMail();
            r.content = m.content;
            r.fromName = 'from';
            r.toName = 'to';
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