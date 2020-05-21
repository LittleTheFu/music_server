import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entity/mail.entity';
import { User } from '../users/entity/user.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule, TypeOrmModule.forFeature([User, Mail])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }