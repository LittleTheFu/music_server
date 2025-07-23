import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Mail, RetMail } from './entity/mail.entity';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';
import { EventsGateway } from '../events/events.gateway';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class MailService {
    constructor(
        private helperService: HelperService,
        private eventsGateway: EventsGateway,

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
        r.read = m.read;
        r.date = m.date;
        r.fromAvatar = this.helperService.getAvatarAddress(m.from.profile.avatar);

        return r;
    }

    async sendMail(fromId: number, toId: number, content: string): Promise<RetMsgObj> {
        const mail = new Mail();
        mail.content = content;

        const fromUser = await this.userRepository.findOneBy({ id: fromId });
        const toUser = await this.userRepository.findOneBy({ id: toId });

        mail.from = fromUser;
        mail.to = toUser;

        await this.MailRepository.save(mail);

        this.eventsGateway.notifyNewMail(toId);

        return new RetMsgObj();
    }

    async deleteMail(userId: number, mailId: number): Promise<RetMsgObj> {
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
            .innerJoinAndSelect('mail.to', 'to')
            .innerJoinAndSelect('mail.from', 'from')
            .innerJoinAndSelect('from.profile', 'profile')
            .where('mail.id = :id', { id: mailId })
            .getOne();

        mail.read = true;
        const savedMail = await this.MailRepository.save(mail);

        const retMail = this.getReturnMail(savedMail);
        return retMail;
    }

    async getMails(userId: number): Promise<RetMail[]> {
        const mails = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'to')
            .innerJoinAndSelect('mail.from', 'from')
            .innerJoinAndSelect('from.profile', 'profile')
            .where('to.id = :id', { id: userId })
            .orderBy("mail.date", "DESC")
            .getMany();

        const retMails = mails.map((m) => {
            return this.getReturnMail(m);
        })

        return retMails;
    }

    async getUnreadMailNum(userId: number): Promise<number> {
        const cnt = await this.MailRepository
            .createQueryBuilder('mail')
            .innerJoinAndSelect('mail.to', 'user')
            .where('user.id = :id', { id: userId })
            .andWhere('read = false')
            .getCount();

        return cnt;
    }

}