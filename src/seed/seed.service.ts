import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Profile } from '../profile/entity/profile.entity';
import { Music, MusicCollection, RawMusic, Artist, MusicAlbum } from '../music/entity/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Md5 } from 'ts-md5/dist/md5';


@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(RawMusic)
        private readonly rawMusicRepository: Repository<RawMusic>,

        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>,

        @InjectRepository(MusicAlbum)
        private readonly albumRepository: Repository<MusicAlbum>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Music)
        private readonly musicRepository: Repository<Music>,

        @InjectRepository(Profile)
        private readonly profileReposity: Repository<Profile>,

        @InjectRepository(MusicCollection)
        private readonly collectionRepository: Repository<MusicCollection>) {

    }

    getHello(): string {
        return 'Hello World!';
    }

    hello(): void {
        console.log('seed-service-hello');
    }

    private createRawMusic = ( name: string, artist: Artist, album: MusicAlbum ): void => {
        const rm = new RawMusic();

        rm.name = name;
        rm.musicArtist = artist;
        rm.musicAlbum = album;

        this.rawMusicRepository.save(rm);
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
        m2.album = 'Vermillion Summer';

        await this.musicRepository.save(m2);

        const m3 = new Music();
        m3.like = 0;
        m3.address = 'http://localhost:9999/music/3.mp3';
        m3.cover = 'http://localhost:9999/album/3.png';
        m3.name = 'What’s Love?';
        m3.artist = 'SKELT 8 BAMBINO';
        m3.album = 'Whats Love? feat.SoulJa';

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
        c1.musics = [m1, m2, m3, m4];

        await this.collectionRepository.save(c1);

        // ------------------------------------------------------------------------------------------
        const albumWT = new MusicAlbum();
        albumWT.name = 'Walküre Trap!';

        const albumTMNN = new MusicAlbum();
        albumTMNN.name = 'ワルキューレがとまらない';

        const artJunna = new Artist();
        artJunna.name = 'JUNNA';
        artJunna.musicAlbums = [albumWT];
        await this.artistRepository.save(artJunna);

        const artAye = new Artist();
        artAye.name = '安野希世乃';
        artAye.musicAlbums = [albumWT];
        await this.artistRepository.save(artAye);

        const artDsny = new Artist();
        artDsny.name = '東山奈央';
        artDsny.musicAlbums = [albumWT];
        await this.artistRepository.save(artDsny);

        const artXtwj = new Artist();
        artXtwj.name = '西田望見';
        artXtwj.musicAlbums = [albumWT];
        await this.artistRepository.save(artXtwj);

        const artSzk = new Artist();
        artSzk.name = '鈴木みのり';
        artSzk.musicAlbums = [albumWT, albumTMNN];
        await this.artistRepository.save(artSzk)

        this.createRawMusic('God Bless You', artSzk, albumWT);
        this.createRawMusic('LOVE! THUNDER GLOW', artJunna, albumWT);
        this.createRawMusic('Silent Hacker', artDsny, albumWT);
        this.createRawMusic('おにゃの子☆girl', artXtwj, albumWT);
        this.createRawMusic('涙目爆発音', artAye, albumWT);
        this.createRawMusic('風は予告なく吹く ~Freyja Solo~', artSzk, albumWT);

        this.createRawMusic('鈴木みのり - 僕らの戦場～Freyja Solo Edition～', artSzk, albumTMNN);
        this.createRawMusic('鈴木みのり - 星間飛行～Freyja Ver.～', artSzk, albumTMNN);
    }
}
