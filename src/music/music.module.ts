import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicCollection, MusicAlbum, Artist, RawMusic } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ConverterModule } from '../converter/converter.module';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [ConverterModule, UsersModule, TypeOrmModule.forFeature([MusicAlbum, Artist, RawMusic, MusicCollection, User]) ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService]
})
export class MusicModule {}