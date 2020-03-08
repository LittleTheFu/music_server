import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { LikeMusicDto, GetMusicByCollectionNameDto } from './dto/music.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('MusicList')
  async getMusicList(@Request() req): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    console.log('req.header : ' + JSON.stringify(req.body));
    return this.musicService.getMusicList(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicsByCollectionName')
  async getMusicsByCollectionName(@Request() req, @Body() getMusicByCollectionNameDto: GetMusicByCollectionNameDto): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    // console.log('req : ' + JSON.stringify(req.body));
    // console.log('body : ' + JSON.stringify(getMusicByCollectionNameDto));
    console.log('body : ' + getMusicByCollectionNameDto.name);
    const name = getMusicByCollectionNameDto.name;
    return this.musicService.getMusicListByCollectionName(req.user.userId, name);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('Musics')
  async getMusics(@Request() req): Promise<object> {
    console.log('req.user : ' + JSON.stringify(req.user));
    return this.musicService.getMusics(req.user.userId);
  }

  @Get('Collections')
  async getMusicCollections(): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    return this.musicService.getMusicCollections();
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async like(@Request() req, @Body() likeMusicDto: LikeMusicDto): Promise<object> {
    console.log(likeMusicDto);
    return this.musicService.likeMusic(req.user.userId, likeMusicDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('dislike')
  async dislike(@Request() req, @Body() likeMusicDto: LikeMusicDto): Promise<object> {
    // console.log(likeMusicDto);
    return this.musicService.dislikeMusic(req.user.userId,likeMusicDto.musicId);
  }
}