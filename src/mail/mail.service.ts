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

    async getMails(userId: number): Promise<RetMail[]> {
        // return this.MailRepository.find();
        const m = new RetMail();
        m.content = 'hello';
        m.fromName = 'from';
        m.toName = 'to';

        const n = new RetMail();
        n.content = 'n';
        n.fromName = 'from';
        n.toName = 'to';

        const ret = [m,n];
        return ret;
    }

}