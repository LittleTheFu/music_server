import { Injectable } from '@nestjs/common';

@Injectable()
export class MusicService {
  getMusic(): string {
    return 'music!';
  }
}
