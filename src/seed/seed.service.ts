import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Profile } from '../profile/entity/profile.entity';
import { Music, MusicCollection } from '../music/entity/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Md5 } from 'ts-md5/dist/md5';


@Injectable()
export class SeedService {

    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,

    @InjectRepository(Profile)
    private readonly profileReposity: Repository<Profile>,
    
    @InjectRepository(MusicCollection)
    private  readonly collectionRepository: Repository<MusicCollection>) {
        
    }

    getHello(): string {
        return 'Hello World!';
    }

    hello(): void {
        console.log('seed-service-hello');
    }

    async initDbData(): Promise<void> {
        console.log('init db data');

        const m1 = new Music();
        m1.like = 0;
        m1.address = 'http://localhost:9999/music/1.mp3';
        m1.cover = 'http://localhost:9999/album/1.png';
        m1.name = 'Tasty Carrots';
        m1.artist = 'Shou (Discandy)';
        m1.album = 'TastyCarrots';

        await this.musicRepository.save(m1);

        const m2 = new Music();
        m2.like = 0;
        m2.address = 'http://localhost:9999/music/2.mp3';
        m2.cover = 'http://localhost:9999/album/2.png';
        m2.name = '萃梦想歌';
        m2.artist = 'Silver Forest';
        m2.album = 'Vermillion Summer' ;

        await this.musicRepository.save(m2);

        const m3 = new Music();
        m3.like = 0;
        m3.address = 'http://localhost:9999/music/3.mp3';
        m3.cover = 'http://localhost:9999/album/3.png';
        m3.name = 'What’s Love?';
        m3.artist = 'SKELT 8 BAMBINO';
        m3.album = 'Whats Love? feat.SoulJa' ;

        await this.musicRepository.save(m3);

        const m4 = new Music();
        m4.like = 0;
        m4.address = 'http://localhost:9999/music/4.mp3';
        m4.cover = 'http://localhost:9999/album/4.png';
        m4.name = 'Will ( Original Mix )';
        m4.artist = 'SnoweeD';
        m4.album = 'Will';

        await this.musicRepository.save(m4);

        const profile = new Profile();
        profile.avatarUrl = 'http://localhost:9999/avatar/2.jpeg';
        const savedProfile = await this.profileReposity.save(profile);

        const u = new User();
        u.name = 'staff';
        u.password = Md5.hashStr('staff') as string;
        u.profile = savedProfile;
        await this.userRepository.save(u);

        const c1 = new MusicCollection();
        c1.cover = 'http://localhost:9999/album/4.png';
        c1.name = 'recommend';
        c1.user = u;
        c1.musics = [m1,m2,m3,m4];

        await this.collectionRepository.save(c1);
    }
}
