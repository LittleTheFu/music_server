import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  Music,
  MusicCollection,
  RetCollectionDetail,
  Artist,
  MusicAlbum,
  RawMusic,
  RetAlbumDetail,
  RetArtist,
} from './entity/music.entity';
import { User } from '../users/entity/user.entity';
import { HelperService } from '../helper/helper.service';
import { ConverterService } from '../converter/converter.service';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Injectable()
export class MusicService {
  host: string;
  constructor(
    private helperService: HelperService,
    private converterService: ConverterService,

    @InjectRepository(RawMusic)
    private readonly rawMusicRepository: Repository<RawMusic>,

    @InjectRepository(MusicAlbum)
    private readonly albumRepository: Repository<MusicAlbum>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(MusicCollection)
    private readonly MusicCollectionRepository: Repository<MusicCollection>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>) {
    this.host = this.helperService.getHost();
  }

  async getMusicsByKeyword(userId: number, keyword: string): Promise<Music[]> {
    const musics = await this.rawMusicRepository.find({
      relations: ['musicAlbum', 'musicArtist', 'liker'],
      where: { name: Like('%' + keyword + '%') }
    });

    const rmusics = musics.map((m) => {
      return this.converterService.GetReturnMusic(m, userId);
    });

    return rmusics;
  }

  async getCollectionDetailById(userId: number, collectionId: number): Promise<RetCollectionDetail> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'],
      where: { id: collectionId }
    });

    const user = await this.UserRepository.findOne({
      relations: ['likes',
        'mixes',
        'mixes.musics',
        'mixes.musics.musicArtist',
        'mixes.musics.musicAlbum',
        'mixes.musics.liker'],
      where: { id: userId }
    });

    const musics = collection.musics.map((m) => {
      return this.converterService.GetReturnMusic(m, userId);
    });

    const foundCollection = user.mixes.find((c) => { return c.id === collectionId });

    const canBeDeleted = (foundCollection != null);
    const r = this.converterService.getReturnMusicCollection(collection, userId, canBeDeleted);

    return r;
  }

  async getMusicListByCollectionId(userId: number, musicId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'],
      where: { id: musicId }
    });

    const musics = collection.musics.map((m) => {
      return this.converterService.GetReturnMusic(m, userId);
    });

    return musics;
  }

  async deleteCollection(collectionId: number): Promise<RetMsgObj> {

    await this.MusicCollectionRepository
      .createQueryBuilder()
      .delete()
      .from(MusicCollection)
      .where("id = :id", { id: collectionId })
      .execute();

      return new RetMsgObj()
  }

  async addMusicToCollection(collectionId: number, musicId: number): Promise<RetMsgObj> {
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    const music = await this.rawMusicRepository.findOne({ id: musicId });

    if (collection.musics.find(m => { m.id === music.id })) {
      return new RetMsgObj('already added');
    }

    collection.musics = collection.musics.concat(music);
    await this.MusicCollectionRepository.save(collection);

    return new RetMsgObj();
  }

  async removeMusicFromCollection(musicId: number, collectionId: number): Promise<RetMsgObj> {
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    collection.musics = collection.musics.filter((m) => { return m.id !== musicId; });
    await this.MusicCollectionRepository.save(collection);

    return new RetMsgObj();
  }

  async likeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist', 'liker'], where: { id: musicId } });
    music.like++;

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    music.liker = music.liker.concat(user);

    await this.rawMusicRepository.save(music);

    const rMusic = this.converterService.GetReturnMusic(music, userId);

    return rMusic;
  }

  async dislikeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist', 'liker'], where: { id: musicId } });
    music.like--;

    music.liker = music.liker.filter((u) => {
      return u.id !== userId;
    })
    await this.rawMusicRepository.save(music);

    const rMusic = this.converterService.GetReturnMusic(music, userId);

    return rMusic;
  }

  async getPrivateMusicCollections(userId: number): Promise<RetCollectionDetail[]> {
    const user = await this.UserRepository.findOne({
      relations: [
        'mixes',
        'mixes.musics',
        'mixes.musics.musicArtist',
        'mixes.musics.musicAlbum',
        'mixes.musics.liker'], where: { id: userId }
    });

    const r = user.mixes.map((c) => {
      return this.converterService.getReturnMusicCollection(c, userId, true);
    })

    return r;
  }

  async createCollection(userId: number, name: string): Promise<RetCollectionDetail> {
    const user = await this.UserRepository.findOne(userId);

    const collection = new MusicCollection();
    collection.name = name;
    collection.user = user;
    collection.cover = '7.png';

    const c = await this.MusicCollectionRepository.save(collection);
    // const r = this.converterService.getReturnMusicCollection(c, userId, true);
    const r = new RetCollectionDetail();
    r.canBeDeleted = true;
    r.cover = this.helperService.getFakeCover(collection.cover);
    r.name = c.name;
    r.id = c.id;

    return r;
  }

  async getArtistInfo(artistId: number, userId: number): Promise<RetArtist> {
    const artist = await this.artistRepository.findOne(
      {
        relations: ['musicAlbums',
          'musicAlbums.musics',
          'musicAlbums.musics.musicArtist',
          'musicAlbums.musics.musicAlbum',
          'musicAlbums.musics.liker'], where: { id: artistId }
      });

    const r = new RetArtist();
    r.id = artist.id;
    r.name = artist.name;
    r.albums = artist.musicAlbums.map((album) => {
      return this.converterService.GetReturnAlbum(album, userId);
    });

    r.avatar = this.helperService.getArtistAddress(artist.name);

    return r;
  }

  async getLyricFileName(musicId: number): Promise<string> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum'], where: { id: musicId } });
    return music.musicAlbum.name + '/' + music.name + '.lrc';
  }

  async getAlbum(albumId: number, userId: number): Promise<RetAlbumDetail> {
    const album = await this.albumRepository.findOne(
      {
        relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'],
        where: { id: albumId }
      });

    const r = this.converterService.GetReturnAlbum(album, userId);
    return r;
  }

  async getAllAlbums(userId: number): Promise<RetAlbumDetail[]> {
    const albums = await this.albumRepository.find(
      { relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'] });

    const retAlbums = albums.map((album) => {
      return this.converterService.GetReturnAlbum(album, userId);
    });

    return retAlbums;
  }

}
