import { Injectable } from '@nestjs/common';
// import { Music } from './interfaces/music.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Music, MusicCollection } from './entity/music.entity';
import { User } from '../users/entity/user.entity';

@Injectable()
export class MusicService {
  // index: number;
  // private readonly musics: Music[] = [];
  constructor(
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
    const musics =  await this.MusicRepository.find({ name: Like('%' + keyword + '%') });

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if(m.id === l.id) {
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

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if(m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async getMusicList(userId: number): Promise<Music[]> {
    const collection = await this.MusicCollectionRepository.findOne({
      relations: ['musics'],
      where: { id: 1 }
    });
    const musics = collection.musics;
    console.log(collection);
    // console.log(musics);

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if(m.id === l.id) {
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

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    console.log(user);
    const likes = user.likes;
    musics.forEach((m) => {
      likes.forEach((l) => {
        if(m.id === l.id) {
          m.likedByCurrentUser = true;
        }
      })
    });

    return musics;
  }

  async likeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.MusicRepository.findOne(musicId);
    music.like++;

    const retMusic = await this.MusicRepository.save(music);
    retMusic.likedByCurrentUser = true;

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    user.likes.push(retMusic);

    await this.UserRepository.save(user);

    console.log('like : ' + retMusic.like);

    return retMusic;
  }

  async dislikeMusic(userId: number, musicId: number): Promise<Music> {
    const music = await this.MusicRepository.findOne(musicId);
    music.like--;

    const retMusic = await this.MusicRepository.save(music);
    retMusic.likedByCurrentUser = false;

    const user = await this.UserRepository.findOne({relations: ['likes'], where: { id: userId}});
    const newLikes = user.likes.filter((m) => {return m.id !== retMusic.id});
    user.likes = newLikes;

    await this.UserRepository.save(user);

    console.log('dislike : ' + retMusic.like);

    return retMusic;
  }

  async getMusicCollections(username: string): Promise<MusicCollection[]> {
    const privateCollectionName = 'privateCollection_' + username;
    const privateCollections = await this.MusicCollectionRepository.find( {name: privateCollectionName});
    const publicCollections = await this.MusicCollectionRepository.find( {name: Not(Like('%' + 'privateCollection_' + '%'))});
    const collections = privateCollections.concat(publicCollections);
    return collections;
  }
}
