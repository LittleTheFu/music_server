import { Injectable } from '@nestjs/common';
// import { Music } from './interfaces/music.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import {
  Music,
  MusicCollection,
  RetCollectionDetail,
  Artist,
  RetAlbum,
  MusicAlbum,
  RawMusic,
} from './entity/music.entity';
import { User } from '../users/entity/user.entity';

@Injectable()
export class MusicService {
  // index: number;
  // private readonly musics: Music[] = [];
  constructor(
    @InjectRepository(RawMusic)
    private readonly rawMusicRepository: Repository<RawMusic>,

    @InjectRepository(MusicAlbum)
    private readonly albumRepository: Repository<MusicAlbum>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(MusicCollection)
    private readonly MusicCollectionRepository: Repository<MusicCollection>,

    @InjectRepository(Music)
    private readonly MusicRepository: Repository<Music>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>) {

    // this.index = 0;
    // this.musics.push({ address: 'http://localhost:9999/music/0.mp3', cover: 'http://localhost:9999/album/0.png', name: 'Honey Bunny My Love', artist: 'SHAKING PINK', album: 'しぇいきんぐ!SHAKING PINK' });
    // this.musics.push({ address: 'http://localhost:9999/music/1.mp3', cover: 'http://localhost:9999/album/1.png', name: 'Tasty Carrots', artist: 'Shou (Discandy)', album: 'TastyCarrots' });
    // this.musics.push({ address: 'http://localhost:9999/music/2.mp3', cover: 'http://localhost:9999/album/2.png', name: '萃梦想歌', artist: 'Silver Forest', album: 'Vermillion Summer' });
    // this.musics.push({ address: 'http://localhost:9999/music/3.mp3', cover: 'http://localhost:9999/album/3.png', name: 'What’s Love?', artist: 'SKELT 8 BAMBINO', album: 'Whats Love? feat.SoulJa' });
    // this.musics.push({ address: 'http://localhost:9999/music/4.mp3', cover: 'http://localhost:9999/album/4.png', name: 'Will ( Original Mix )', artist: 'SnoweeD', album: 'Will' });
    // this.musics.push({ address: 'http://localhost:9999/music/5.mp3', cover: 'http://localhost:9999/album/5.png', name: 'Bubbles', artist: 'SnowFlakez!', album: 'Bubbles' });
    // this.musics.push({ address: 'http://localhost:9999/music/6.mp3', cover: 'http://localhost:9999/album/6.png', name: 'Grayedout-Antifront- (Soleily Remix)', artist: 'Soleily', album: 'ANTiFRONT GEARS' });
    // this.musics.push({ address: 'http://localhost:9999/music/7.mp3', cover: 'http://localhost:9999/album/7.png', name: 'Thalidomide Chocolat', artist: 'Sound.AVE', album: 'Reliance' });
  }

  async getMusicsByKeyword(userId: number, keyword: string): Promise<Music[]> {
    const musics = await this.MusicRepository.find({ name: Like('%' + keyword + '%') });

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async getCollectionDetailById(userId: number, collectionId: number): Promise<RetCollectionDetail> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics'],
      where: { id: collectionId }
    });
    const musics = collection.musics;

    const user = await this.UserRepository.findOne({ relations: ['likes', 'playlist'], where: { id: userId } });
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    const foundCollection = user.playlist.find((c) => { return c.id === collectionId });
    console.log('BEGIN foundCollection');
    console.log(foundCollection);
    console.log('END foundCollection');

    const r = new RetCollectionDetail();
    r.musics = musics;
    r.name = collection.name;
    r.cover = collection.cover;
    r.canBeDeleted = (foundCollection != null);

    console.log(r);

    return r;
  }

  async getMusicListByCollectionId(userId: number, musicId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics'],
      where: { id: musicId }
    });
    const musics = collection.musics;
    console.log(collection);
    // console.log(musics);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    // console.log(musics);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async getMusicListByCollectionName(userId: number, name: string): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics'],
      where: { name: name }
    });
    const musics = collection.musics;
    console.log(collection);
    // console.log(musics);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
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
    // const privateCollectionName = 'privateCollection_' + username;
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    const music = await this.MusicRepository.findOne({ id: musicId });

    if (collection.musics.find(m => { m.id === music.id })) {
      return { msg: 'already in this list' }
    }

    collection.musics = collection.musics.concat(music);
    await this.MusicCollectionRepository.save(collection);

    return { msg: "success" }
  }

  async removeMusicFromCollection(musicId: number, collectionId: number): Promise<object> {
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { id: collectionId } });
    console.log('remove : ' + collectionId);
    console.log(collection);
    collection.musics = collection.musics.filter((m) => { return m.id !== musicId; });
    await this.MusicCollectionRepository.save(collection);

    return { msg: 'success' };
  }

  async getPlayListMusicList(userId: number, username: string): Promise<Music[]> {
    const privateCollectionName = 'privateCollection_' + username;
    const collection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { name: privateCollectionName } });

    // const collection = await this.MusicCollectionRepository.findOne({
    //   relations: ['musics'],
    //   where: { id: 1 }
    // });
    const musics = collection.musics;
    console.log(collection);
    // console.log(musics);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async getMusics(userId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics'],
      where: { id: 2 }
    });
    const musics = collection.musics;
    // console.log(collection);
    console.log(musics);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if (m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async likeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne( { relations: ['musicAlbum', 'musicArtist'], where: { id: musicId} });
    music.like++;
    this.rawMusicRepository.save(music);

    const rMusic = new Music();
    rMusic.id = music.id;
    rMusic.cover = 'http://localhost:9999/musics/' + music.musicAlbum.name + '/' + 'cover.png';
    rMusic.name = music.name;
    rMusic.artist = music.musicArtist.name;
    rMusic.likedByCurrentUser = true;
    rMusic.like = music.like;
    rMusic.address = 'http://localhost:9999/musics/' + music.musicAlbum.name + '/' + music.name + '.mp3';

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    user.likes.push(rMusic);

    await this.UserRepository.save(user);

    return rMusic;
  }

  async dislikeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne( { relations: ['musicAlbum', 'musicArtist'], where: { id: musicId} });
    music.like--;
    this.rawMusicRepository.save(music);

    const rMusic = new Music();
    rMusic.id = music.id;
    rMusic.cover = music.musicAlbum.name;
    rMusic.name = music.name;
    rMusic.artist = music.musicArtist.name;
    rMusic.likedByCurrentUser = false;
    rMusic.like = music.like;

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    const newLikes = user.likes.filter((m) => { return m.id !== rMusic.id });
    user.likes = newLikes;

    await this.UserRepository.save(user);

    return rMusic;
  }

  async getMusicCollections(username: string): Promise<MusicCollection[]> {
    const privateCollectionName = 'privateCollection_' + username;
    const privateCollections = await this.MusicCollectionRepository.find({ name: privateCollectionName });
    const publicCollections = await this.MusicCollectionRepository.find({ name: Not(Like('%' + 'privateCollection_' + '%')) });
    const collections = privateCollections.concat(publicCollections);
    return collections;
  }

  async getPrivateMusicCollections(userId: number): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['playlist'], where: { id: userId } });
    return user.playlist;
  }

  async getPublicMusicCollections(): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['playlist'], where: { id: 1 } });
    return user.playlist;
  }

  async addMusicToPersonalCollection(username: string, musicId: number): Promise<Music[]> {
    const privateCollectionName = 'privateCollection_' + username;
    const privateCollection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { name: privateCollectionName } });

    const music = await this.MusicRepository.findOne({ id: musicId });

    console.log('private_collection : ' + privateCollection.id + '  ' + privateCollection.name);
    console.log('musics : ...' + privateCollection.musics);

    privateCollection.musics = privateCollection.musics.concat(music);

    await this.MusicCollectionRepository.save(privateCollection);
    return privateCollection.musics;
  }

  async removeMusicFromPersonalCollection(username: string, musicId: number): Promise<Music[]> {
    const privateCollectionName = 'privateCollection_' + username;
    const privateCollection = await this.MusicCollectionRepository.findOne({ relations: ['musics'], where: { name: privateCollectionName } });

    // const music = await this.MusicRepository.findOne( {id: musicId} );

    console.log('private_collection : ' + privateCollection.id + '  ' + privateCollection.name);
    console.log('musics : ...' + privateCollection.musics);
    console.log('remove....id : ' + musicId);

    privateCollection.musics = privateCollection.musics.filter(m => { return (m.id != musicId); });

    await this.MusicCollectionRepository.save(privateCollection);
    return privateCollection.musics;
  }

  async createCollection(userId: number, name: string): Promise<MusicCollection> {
    const user = await this.UserRepository.findOne(userId);

    const collection = new MusicCollection();
    collection.name = name;
    collection.user = user;
    collection.cover = 'http://localhost:9999/album/7.png';

    const retCollection = await this.MusicCollectionRepository.save(collection);

    console.log('create collection');
    console.log(retCollection);

    return retCollection;
  }

  async getArtistInfo(artistId: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ relations: ['musicAlbums'], where: { id: artistId } });

    return artist;
  }

  async getAllAlbums(userId: number): Promise<RetAlbum[]> {
    const albums = await this.albumRepository.find({ relations: ['musics', 'musics.musicArtist'] });
    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);

    const retAlbums = albums.map((album) => {
      const retAlbum = new RetAlbum();

      retAlbum.id = album.id;
      retAlbum.name = album.name;
      retAlbum.cover = 'http://localhost:9999/musics/' + retAlbum.name + '/cover.png';

      const retMusics = album.musics.map((music) => {
        const retMusic = new Music();

        retMusic.id = music.id;
        retMusic.address = 'http://localhost:9999/musics/' + retAlbum.name + '/' + music.name + '.mp3';
        retMusic.cover = retAlbum.cover;
        retMusic.artist = music.musicArtist.name;
        retMusic.album = retAlbum.name;

        retMusic.like = music.like;

        retMusic.likedByCurrentUser = false;
        const likes = user.likes;
        likes.forEach((l) => {
          if (retMusic.id === l.id) {
            retMusic.likedByCurrentUser = true;
          }
        });

        retMusic.comments = [];

        return retMusic;
      })

      retAlbum.musics = retMusics;

      return retAlbum;
    });

    console.log('RETURN ALBUNMS')
    console.log(retAlbums);

    return retAlbums;
  }

}
