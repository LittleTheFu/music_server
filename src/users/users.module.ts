import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, ResetInfo } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { MusicModule } from '../music/music.module';
import { MusicCollection } from '../music/entity/music.entity';
import { Profile } from '../profile/entity/profile.entity';
import { Mail } from '../mail/entity/mail.entity';
import { MailModule } from '../mail/mail.module';
import { ConverterModule } from '../converter/converter.module';
import { EventsModule } from '../events/events.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    EventsModule,
    ConverterModule,
    forwardRef(() => MailModule),
    forwardRef(() => MusicModule),
    TypeOrmModule.forFeature([User, MusicCollection, Profile, Mail, ResetInfo])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
}) 
export class UsersModule { }