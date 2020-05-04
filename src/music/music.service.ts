import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  Music,
  MusicCollection,
  RetCollectionDetail,
  Artist,
  RetAlbum,
  MusicAlbum,
  RawMusic,
  RetAlbumDetail,
  RetArtist,
} from './entity/music.entity';
import { User } from '../users/entity/user.entity';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class MusicService {
  host: string;
  constructor(
    private helperService: HelperService,

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

  private GetReturnMusic(r: RawMusic, userId: number): Music {
    const m = new Music();
    m.id = r.id;
    m.name = r.name;
    m.like = r.like;
    m.artist = r.musicArtist.name;
    m.artistId = r.musicArtist.id;
    m.albumId = r.musicAlbum.id;
    m.album = r.musicAlbum.name;
    m.address = this.helperService.getMusicAddress(r.musicAlbum.name, r.name);
    m.cover = this.helperService.getCoverAddress(r.musicAlbum.name);

    m.likedByCurrentUser = false;
    if (userId != null) {
      if (r.liker.find((usr) => { return usr.id === userId; })) {
        m.likedByCurrentUser = true;
      }
    }

    return m;
  }

  private GetReturnAlbum(a: MusicAlbum, userId: number): RetAlbum {
    const r = new RetAlbum();

    r.id = a.id;
    r.name = a.name;
    r.cover = this.helperService.getCoverAddress(a.name);
    r.musics = a.musics.map((m) => {
      return this.GetReturnMusic(m, userId);
    });

    return r;
  }

  async getMusicsByKeyword(userId: number, keyword: string): Promise<Music[]> {
    const musics = await this.rawMusicRepository.find({
      relations: ['musicAlbum', 'musicArtist', 'liker'],
      where: { name: Like('%' + keyword + '%') }
    });

    const rmusics = musics.map((m) => {
      return this.GetReturnMusic(m, userId);
    });

    return rmusics;
  }

  async getCollectionDetailById(userId: number, collectionId: number): Promise<RetCollectionDetail> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'],
      where: { id: collectionId }
    });

    const user = await this.UserRepository.findOne({ relations: ['likes', 'mixes'], where: { id: userId } });

    const musics = collection.musics.map((m) => {
      return this.GetReturnMusic(m, userId);
    });

    const foundCollection = user.mixes.find((c) => { return c.id === collectionId });

    const r = new RetCollectionDetail();
    r.name = collection.name;
    r.cover = collection.cover;
    r.canBeDeleted = (foundCollection != null);
    r.musics = musics;

    return r;
  }

  async getMusicListByCollectionId(userId: number, musicId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'],
      where: { id: musicId }
    });

    const musics = collection.musics.map((m) => {
      return this.GetReturnMusic(m, userId);
    });

    return musics;
  }

  async deleteCollection(collectionId: number): Promise<object> {

    await this.MusicCollectionRepository
      .createQueryBuilder()
      .delete()
      .from(MusicCollection)
      .where("id = :id", { id: collectionId })
      .execute();

    return { msg: 'success' };
  }

  async addMusicToCollection(collectionId: number, musicId: number): Promise<object> {
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    const music = await this.rawMusicRepository.findOne({ id: musicId });

    if (collection.musics.find(m => { m.id === music.id })) {
      return { msg: 'already in this list' }
    }

    collection.musics = collection.musics.concat(music);
    await this.MusicCollectionRepository.save(collection);

    return { msg: "success" }
  }

  async removeMusicFromCollection(musicId: number, collectionId: number): Promise<object> {
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    collection.musics = collection.musics.filter((m) => { return m.id !== musicId; });
    await this.MusicCollectionRepository.save(collection);

    return { msg: 'success' };
  }

  async likeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist', 'liker'], where: { id: musicId } });
    music.like++;

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    music.liker = music.liker.concat(user);

    await this.rawMusicRepository.save(music);

    const rMusic = this.GetReturnMusic(music, userId);

    return rMusic;
  }

  async dislikeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist', 'liker'], where: { id: musicId } });
    music.like--;

    music.liker = music.liker.filter((u) => {
      return u.id !== userId;
    })
    await this.rawMusicRepository.save(music);

    const rMusic = this.GetReturnMusic(music, userId);

    return rMusic;
  }

  async getPrivateMusicCollections(userId: number): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['mixes'], where: { id: userId } });
    return user.mixes;
  }

  async getPublicMusicCollections(): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['mixes'], where: { id: 1 } });
    return user.mixes;
  }

  async createCollection(userId: number, name: string): Promise<MusicCollection> {
    const user = await this.UserRepository.findOne(userId);

    const collection = new MusicCollection();
    collection.name = name;
    collection.user = user;
    collection.cover = '7.png';

    const retCollection = await this.MusicCollectionRepository.save(collection);
    retCollection.cover = this.helperService.getFakeCover(retCollection.cover);
    console.log(retCollection.cover);
    return retCollection;
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
      return this.GetReturnAlbum(album, userId);
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

    const r = this.GetReturnAlbum(album, userId);
    return r;
  }

  async getAllAlbums(userId: number): Promise<RetAlbum[]> {
    const albums = await this.albumRepository.find(
      { relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum', 'musics.liker'] });

    const retAlbums = albums.map((album) => {
      return this.GetReturnAlbum(album, userId);
    });

    return retAlbums;
  }

}
