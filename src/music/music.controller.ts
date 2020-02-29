import { Controller, Get } from '@nestjs/common';
import { MusicService } from './music.service';

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
}