import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { LikeMusicDto } from './dto/music.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('MusicList')
  async getMusicList(@Request() req): Promise<object> {
    console.log('req.user : ' + JSON.stringify(req.user));
    return this.musicService.getMusicList(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('Musics')
  async getMusics(@Request() req): Promise<object> {
    console.log('req.user : ' + JSON.stringify(req.user));
    return this.musicService.getMusics(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async like(@Request() req, @Body() likeMusicDto: LikeMusicDto): Promise<object> {
    return this.musicService.likeMusic(req.user.userId, likeMusicDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('dislike')
  async dislike(@Request() req, @Body() likeMusicDto: LikeMusicDto): Promise<object> {
    // console.log(likeMusicDto);
    return this.musicService.dislikeMusic(req.user.userId,likeMusicDto.musicId);
  }
}