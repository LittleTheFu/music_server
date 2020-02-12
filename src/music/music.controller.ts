import { Controller, Get, Res, Header } from '@nestjs/common';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  // @Get()
  // findAll(): object {
  //     return {'name' : 'http://localhost:9999/public/1.mp3'};
  // }

  @Get()
  // @Header('Content-Type', 'audio/mpeg')
  findAll(@Res() res): Promise<void> {
    return res.sendFile('1.mp3', { root: './public' });
  }
}
