import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { Music, MusicCollection, MusicAlbum, Artist, RawMusic } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([MusicAlbum, Artist, RawMusic, Music, MusicCollection, User]) ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService]
})
export class MusicModule {}