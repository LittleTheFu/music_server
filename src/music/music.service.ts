import { Injectable } from '@nestjs/common';

@Injectable()
export class MusicService {
  index: number;
  constructor() {
    this.index = 0;
  }

  getNextMusic(): object {
    this.index++;
    const name = 'http://localhost:9999/music/' + ((this.index) % 8).toString() + '.mp3';
    const cover = 'http://localhost:9999/album/' + ((this.index) % 8).toString() + '.png';
    console.log(name);
    return { 'name': name, 'cover': cover };
  }
}
