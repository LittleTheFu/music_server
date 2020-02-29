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
  like(@Body() likeMusicDto: LikeMusicDto): string {
    console.log('like music');
    console.log(likeMusicDto);
    return 'like-music';
  }
}