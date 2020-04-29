import { Controller, Get, Post, Request, Body, UseGuards, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import {
  GetMusicByCollectionIdDto,
  CreateCollectionDto,
  LikeMusicDto,
  GetMusicByCollectionNameDto,
  GetMusicByKeywordDto,
  PersonalListMusicDto,
  GetMusicLyricDto,
  DeleteCollectionDto,
  AddMusicToCollectionDto,
  RemoveMusicFromCollectionDto,
  GetArtistInfoDto,
  GetAlbumDetailDto,
} from './dto/music.dto';
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
  @Post('GetMusicsByCollectionId')
  async getMusicsByCollectionId(@Request() req, @Body() getMusicByCollectionIdDto: GetMusicByCollectionIdDto): Promise<object> {
    return this.musicService.getMusicListByCollectionId(req.user.userId, getMusicByCollectionIdDto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetCollectionDetailById')
  async getCollectionDetailById(@Request() req, @Body() getMusicByCollectionIdDto: GetMusicByCollectionIdDto): Promise<object> {
    return this.musicService.getCollectionDetailById(req.user.userId, getMusicByCollectionIdDto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('DeleteCollection')
  async deleteCollection(@Body() deleteCollectionDto: DeleteCollectionDto): Promise<object> {
    return this.musicService.deleteCollection(deleteCollectionDto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('AddMusicToCollection')
  async addMusicToCollection(@Body() addMusicToCollectionDto: AddMusicToCollectionDto): Promise<object> {
    return this.musicService.addMusicToCollection(addMusicToCollectionDto.collectionId, addMusicToCollectionDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('Collections')
  async getMusicCollections(@Request() req): Promise<object> {
    return this.musicService.getMusicCollections(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getPrivateMusicCollections')
  async getPrivateMusicCollections(@Request() req): Promise<object> {
    return this.musicService.getPrivateMusicCollections(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getPublicMusicCollections')
  async getPublicMusicCollections(): Promise<object> {
    return this.musicService.getPublicMusicCollections();
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
    return this.musicService.dislikeMusic(req.user.userId, likeMusicDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getLyric')
  async getLyric(@Res() res, @Body() getMusicLyricDto: GetMusicLyricDto): Promise<void> {
    const fileName = await this.musicService.getLyricFileName(getMusicLyricDto.musicId);
    return res.sendFile(fileName, { root: './public/musics/' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('createCollection')
  async createCollection(@Request() req, @Body() createCollectionDto: CreateCollectionDto): Promise<object> {
    return this.musicService.createCollection(req.user.userId, createCollectionDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('removeMusicFromCollection')
  async removeMusicFromCollection(@Body() removeMusicFromCollectionDto: RemoveMusicFromCollectionDto): Promise<object> {
    return this.musicService.removeMusicFromCollection(removeMusicFromCollectionDto.musicId, removeMusicFromCollectionDto.collectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getArtistInfo')
  async getArtistInfo(@Body() getArtistInfoDtG: GetArtistInfoDto): Promise<object> {
    return this.musicService.getArtistInfo(getArtistInfoDtG.artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getAlbums')
  async getAlbums(@Request() req): Promise<object> {
    return this.musicService.getAllAlbums(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getAlbumDetail')
  async getAlbumDetail(@Body() getAlbumDetailDto: GetAlbumDetailDto): Promise<object> {
    return this.musicService.getAlbum(getAlbumDetailDto.albumId);
  }
}