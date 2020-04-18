import { Controller, Get, Post, Request, Body, UseGuards, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateCollectionDto, LikeMusicDto, GetMusicByCollectionNameDto, GetMusicByKeywordDto, PersonalListMusicDto, GetMusicLyricDto } from './dto/music.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicsByKeyword')
  async getMusicsByKeyword(@Request() req, @Body() getMusicByKeywordDto: GetMusicByKeywordDto): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    // console.log('req.header : ' + JSON.stringify(req.body));
    const keyword = getMusicByKeywordDto.keyword;
    return this.musicService.getMusicsByKeyword(req.user.userId, keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('PlayListMusicList')
  async getPlayListMusicList(@Request() req): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    console.log('req.header : ' + JSON.stringify(req.body));
    return this.musicService.getPlayListMusicList(req.user.userId, req.user.username);
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

  @UseGuards(JwtAuthGuard)
  @Post('Collections')
  async getMusicCollections(@Request() req): Promise<object> {
    // console.log('req.user : ' + JSON.stringify(req.user));
    return this.musicService.getMusicCollections(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('AddMusicToMyList')
  async addMusicToMyList(@Request() req, @Body() addMusicDto: PersonalListMusicDto): Promise<object> {
    return this.musicService.addMusicToPersonalCollection(req.user.username, addMusicDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('RemoveMusicFromMyList')
  async removeMusicFromMyList(@Request() req, @Body() removeMusicDto: PersonalListMusicDto): Promise<object> {
    return this.musicService.removeMusicFromPersonalCollection(req.user.username, removeMusicDto.musicId);
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
    return this.musicService.dislikeMusic(req.user.userId, likeMusicDto.musicId);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('getLyric')
  async getLyric(@Res() res, @Body() getMusicLyricDto: GetMusicLyricDto): Promise<void> {
    const fileName = getMusicLyricDto.musicId + '.lrc';
    return res.sendFile(fileName, { root: './public/lyric' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('createCollection')
  async createCollection(@Request() req, @Body() createCollectionDto: CreateCollectionDto): Promise<object> {
    // console.log(likeMusicDto);
    return this.musicService.createCollection(req.user.userId, createCollectionDto.name);
  }
}