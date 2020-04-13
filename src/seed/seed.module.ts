import { DynamicModule, Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { MusicModule } from '../music/music.module';
import { CommentModule } from '../comment/comment.module';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MailModule } from '../mail/mail.module';
import * as ormconfig from '../ormconfig';
import { Music, MusicCollection } from '../music/entity/music.entity';
 
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    MusicModule,
    TypeOrmModule.forFeature([Music, MusicCollection]),
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
