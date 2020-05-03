import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { MusicModule } from '../music/music.module';
import { CommentModule } from '../comment/comment.module';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MailModule } from '../mail/mail.module';
import * as ormconfig from '../ormconfig';
import { MusicCollection, RawMusic, MusicAlbum, Artist } from '../music/entity/music.entity';
import { User } from '../users/entity/user.entity';
import { Profile } from '../profile/entity/profile.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    MusicModule,
    TypeOrmModule.forFeature([RawMusic, MusicAlbum, Artist, MusicCollection, User, Profile]),
    CommentModule,
    ProfileModule,
    MailModule,],
  controllers: [SeedController],
  providers: [SeedService],
//   exports: [SeedService],
})

export class SeedModule {
  constructor(private readonly connection: Connection) {
      console.log("Seed");
      console.log(ormconfig.entities);      
      console.log("ed");
  }
}
