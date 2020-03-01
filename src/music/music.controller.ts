import { Controller, Get, Post, Request, Body } from '@nestjs/common';
import { MusicService } from './music.service';
import { LikeMusicDto } from './dto/music.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @Get('MusicList')
  async getMusicList(): Promise<object> {
    return this.musicService.getMusicList();
  }

  @Get('Musics')
  async getMusics(): Promise<object> {
    return this.musicService.getMusics();
  }

  @Post('like')
  async like(@Body() likeMusicDto: LikeMusicDto): Promise<object> {
    return this.musicService.likeMusic(likeMusicDto.musicId);
  }

  @Post('dislike')
  async dislike(@Body() likeMusicDto: LikeMusicDto): Promise<object> {
    // console.log(likeMusicDto);
    return this.musicService.dislikeMusic(likeMusicDto.musicId);
  }
}