import { Injectable } from '@nestjs/common';
import { Music } from './interfaces/music.interface';


@Injectable()
export class MusicService {
  index: number;
  private readonly musics: Music[] = [];
  constructor() {
    this.index = 0;
    this.musics.push({ address: 'http://localhost:9999/music/0.mp3', cover: 'http://localhost:9999/album/0.png', name: 'Honey Bunny My Love', artist: 'SHAKING PINK', album: 'しぇいきんぐ!SHAKING PINK' });
    this.musics.push({ address: 'http://localhost:9999/music/1.mp3', cover: 'http://localhost:9999/album/1.png', name: 'Tasty Carrots', artist: 'Shou (Discandy)', album: 'TastyCarrots' });
    this.musics.push({ address: 'http://localhost:9999/music/2.mp3', cover: 'http://localhost:9999/album/2.png', name: '萃梦想歌', artist: 'Silver Forest', album: 'Vermillion Summer' });
    this.musics.push({ address: 'http://localhost:9999/music/3.mp3', cover: 'http://localhost:9999/album/3.png', name: 'What’s Love?', artist: 'SKELT 8 BAMBINO', album: 'Whats Love? feat.SoulJa' });
    this.musics.push({ address: 'http://localhost:9999/music/4.mp3', cover: 'http://localhost:9999/album/4.png', name: 'Will ( Original Mix )', artist: 'SnoweeD', album: 'Will' });
    this.musics.push({ address: 'http://localhost:9999/music/5.mp3', cover: 'http://localhost:9999/album/5.png', name: 'Bubbles', artist: 'SnowFlakez!', album: 'Bubbles' });
    this.musics.push({ address: 'http://localhost:9999/music/6.mp3', cover: 'http://localhost:9999/album/6.png', name: 'Grayedout-Antifront- (Soleily Remix)', artist: 'Soleily', album: 'ANTiFRONT GEARS' });
    this.musics.push({ address: 'http://localhost:9999/music/7.mp3', cover: 'http://localhost:9999/album/7.png', name: 'Thalidomide Chocolat', artist: 'Sound.AVE', album: 'Reliance' });
  }

  getNextMusic(): Music {
    this.index++;
    return this.musics[this.index];
  }
}
