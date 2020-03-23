import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { MusicModule } from '../music/music.module';
import { MusicCollection } from '../music/entity/music.entity';
import { Profile } from '../profile/entity/profile.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [forwardRef(()=>MailModule), forwardRef(()=>MusicModule),  TypeOrmModule.forFeature([User, MusicCollection, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}