import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { HelperModule } from './helper/helper.module';
import * as ormconfig from './ormconfig';
import { EventsModule } from './events/events.module';


@Module({
  imports: [
    HelperModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.email', '.env'],
    }),
    TypeOrmModule.forRoot(ormconfig),
    MusicModule,
    CommentModule,
    ProfileModule,
    MailModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
  }
}
