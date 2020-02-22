import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { Music, MusicCollection } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Music, MusicCollection])],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
