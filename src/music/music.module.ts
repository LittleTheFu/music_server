import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { Music, MusicCollection } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Music, MusicCollection, User]) ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
