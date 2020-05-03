import { Injectable } from '@nestjs/common';
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

  async getMusicsByKeyword(userId: number, keyword: string): Promise<Music[]> {
    const musics = await this.rawMusicRepository.find({
      relations: ['musicAlbum', 'musicArtist'],
      where: { name: Like('%' + keyword + '%') }
    });

    console.log(musics);

    const rmusics = musics.map((m) => {
      const rm = new Music();
      rm.id = m.id;
      rm.name = m.name;
      rm.like = m.like;
      rm.artist = m.musicArtist.name;
      rm.artistId = m.musicArtist.id;
      rm.albumId = m.musicAlbum.id;
      rm.album = m.musicAlbum.name;
      rm.address = this.helperService.getMusicAddress(m.musicAlbum.name, m.name);
      rm.cover = this.helperService.getCoverAddress(m.musicAlbum.name);
      rm.likedByCurrentUser = false;

      return rm;
    });

    console.log(musics);

    return rmusics;
  }

  async getCollectionDetailById(userId: number, collectionId: number): Promise<RetCollectionDetail> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum'],
      where: { id: collectionId }
    });

    const user = await this.UserRepository.findOne({ relations: ['likes', 'playlist'], where: { id: userId } });
    const likes = user.likes;

    const musics = collection.musics.map((m) => {
      const rm = new Music();
      rm.id = m.id;
      rm.name = m.name;
      rm.like = m.like;
      rm.artist = m.musicArtist.name;
      rm.artistId = m.musicArtist.id;
      rm.albumId = m.musicAlbum.id;
      rm.album = m.musicAlbum.name;
      rm.address = this.helperService.getMusicAddress(m.musicAlbum.name, m.name);
      rm.cover = this.helperService.getCoverAddress(m.musicAlbum.name);
      rm.likedByCurrentUser = false;

      likes.forEach((l) => {
        if (m.id === l.id) {
          rm.likedByCurrentUser = true;
        }
      })

      return rm;
    });

    const foundCollection = user.playlist.find((c) => { return c.id === collectionId });

    const r = new RetCollectionDetail();
    r.name = collection.name;
    r.cover = collection.cover;
    r.canBeDeleted = (foundCollection != null);
    r.musics = musics;

    console.log(r);

    return r;
  }

  async getMusicListByCollectionId(userId: number, musicId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics', 'musics.musicArtist', 'musics.musicAlbum'],
      where: { id: musicId }
    });

    const user = await this.UserRepository.findOne({ relations: ['likes', 'playlist'], where: { id: userId } });
    const likes = user.likes;

    const musics = collection.musics.map((m) => {
      const rm = new Music();
      rm.id = m.id;
      rm.name = m.name;
      rm.like = m.like;
      rm.artist = m.musicArtist.name;
      rm.artistId = m.musicArtist.id;
      rm.albumId = m.musicAlbum.id;
      rm.album = m.musicAlbum.name;
      rm.address = this.helperService.getMusicAddress(m.musicAlbum.name, m.name);
      rm.cover = this.helperService.getCoverAddress(m.musicAlbum.name);
      rm.likedByCurrentUser = false;

      likes.forEach((l) => {
        if (m.id === l.id) {
          rm.likedByCurrentUser = true;
        }
      })

      return rm;
    });

    console.log(musics);

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

    console.log('+++++++++');
    console.log(collection);

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

  async likeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist'], where: { id: musicId } });
    music.like++;
    this.rawMusicRepository.save(music);

    const rMusic = new Music();
    rMusic.id = music.id;
    rMusic.cover = this.helperService.getCoverAddress(music.musicAlbum.name);
    rMusic.name = music.name;
    rMusic.artist = music.musicArtist.name;
    rMusic.artistId = music.musicArtist.id;
    rMusic.albumId = music.musicAlbum.id;
    rMusic.likedByCurrentUser = true;
    rMusic.like = music.like;
    rMusic.address = this.helperService.getMusicAddress(music.musicAlbum.name, music.name);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    user.likes.push(rMusic);

    await this.UserRepository.save(user);

    return rMusic;
  }

  async dislikeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum', 'musicArtist'], where: { id: musicId } });
    music.like--;
    this.rawMusicRepository.save(music);

    const rMusic = new Music();
    rMusic.id = music.id;
    rMusic.cover = this.helperService.getCoverAddress(music.musicAlbum.name);
    rMusic.name = music.name;
    rMusic.artist = music.musicArtist.name;
    rMusic.artistId = music.musicArtist.id;
    rMusic.albumId = music.musicAlbum.id;
    rMusic.likedByCurrentUser = false;
    rMusic.like = music.like;
    rMusic.address = this.helperService.getMusicAddress(music.musicAlbum.name, music.name);

    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    const newLikes = user.likes.filter((m) => { return m.id !== rMusic.id });
    user.likes = newLikes;

    await this.UserRepository.save(user);

    return rMusic;
  }

  async getPrivateMusicCollections(userId: number): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['playlist'], where: { id: userId } });
    return user.playlist;
  }

  async getPublicMusicCollections(): Promise<MusicCollection[]> {
    const user = await this.UserRepository.findOne({ relations: ['playlist'], where: { id: 1 } });
    return user.playlist;
  }

  async createCollection(userId: number, name: string): Promise<MusicCollection> {
    const user = await this.UserRepository.findOne(userId);

    const collection = new MusicCollection();
    collection.name = name;
    collection.user = user;
    collection.cover = this.host + 'album/7.png';

    const retCollection = await this.MusicCollectionRepository.save(collection);

    console.log('create collection');
    console.log(retCollection);

    return retCollection;
  }

  async getArtistInfo(artistId: number): Promise<RetArtist> {
    const artist = await this.artistRepository.findOne({ relations: ['musicAlbums', 'musicAlbums.musics'], where: { id: artistId } });

    const r = new RetArtist();
    r.id = artist.id;
    r.name = artist.name;
    r.albums = artist.musicAlbums.map((album) => {
      const retAlbum = new RetAlbum();
      retAlbum.id = album.id;
      retAlbum.name = album.name;
      retAlbum.cover = this.helperService.getCoverAddress(album.name);
      retAlbum.musics = album.musics.map((m) => {
        const rMusic = new Music();

        rMusic.id = m.id;
        rMusic.artist = artist.name;
        rMusic.artistId = artist.id;
        rMusic.albumId = album.id;
        rMusic.cover = retAlbum.cover;
        rMusic.name = m.name;
        rMusic.address = this.helperService.getMusicAddress(retAlbum.name, m.name);

        return rMusic;
      })

      return retAlbum;
    });

    r.avatar = this.helperService.getArtistAddress(artist.name);

    return r;
  }

  async getLyricFileName(musicId: number): Promise<string> {
    const music = await this.rawMusicRepository.findOne({ relations: ['musicAlbum'], where: { id: musicId } });
    return music.musicAlbum.name + '/' + music.name + '.lrc';
  }

  async getAlbum(albumId: number): Promise<RetAlbumDetail> {
    const album = await this.albumRepository.findOne(
      {
        relations: ['musics', 'musics.musicArtist'],
        where: { id: albumId }
      });

    const retAlbum = new RetAlbumDetail();
    retAlbum.id = album.id;
    retAlbum.cover = this.helperService.getCoverAddress(album.name);
    retAlbum.name = album.name;

    const retMusics = album.musics.map((m) => {
      const rMusic = new Music();

      rMusic.id = m.id;
      rMusic.artist = m.musicArtist.name;
      rMusic.artistId = m.musicArtist.id;
      rMusic.albumId = album.id;
      rMusic.cover = retAlbum.cover;
      rMusic.name = m.name;
      rMusic.address = this.helperService.getMusicAddress(retAlbum.name, m.name);

      return rMusic;
    })

    retAlbum.musics = retMusics;

    console.log(retAlbum);

    return retAlbum;
  }

  async getAllAlbums(userId: number): Promise<RetAlbum[]> {
    const albums = await this.albumRepository.find({ relations: ['musics', 'musics.musicArtist'] });
    const user = await this.UserRepository.findOne({ relations: ['likes'], where: { id: userId } });
    console.log(user);

    const retAlbums = albums.map((album) => {
      const retAlbum = new RetAlbum();

      retAlbum.id = album.id;
      retAlbum.name = album.name;
      retAlbum.cover = this.helperService.getCoverAddress(album.name);

      const retMusics = album.musics.map((music) => {
        const retMusic = new Music();

        retMusic.id = music.id;
        retMusic.address = this.helperService.getMusicAddress(retAlbum.name, music.name);
        retMusic.cover = retAlbum.cover;
        retMusic.artist = music.musicArtist.name;
        retMusic.artistId = music.musicArtist.id;
        retMusic.albumId = album.id;
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
