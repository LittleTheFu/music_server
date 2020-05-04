import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Profile } from '../profile/entity/profile.entity';
import { MusicCollection, RawMusic, Artist, MusicAlbum } from '../music/entity/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Md5 } from 'ts-md5/dist/md5';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class SeedService {
    host: string;
    constructor(
        private helperService: HelperService,

        @InjectRepository(RawMusic)
        private readonly rawMusicRepository: Repository<RawMusic>,

        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>,

        @InjectRepository(MusicAlbum)
        private readonly albumRepository: Repository<MusicAlbum>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Profile)
        private readonly profileReposity: Repository<Profile>,

        @InjectRepository(MusicCollection)
        private readonly collectionRepository: Repository<MusicCollection>) {

            this.host = this.helperService.getHost();

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

        const profile = new Profile();
        profile.avatar = '2.jpeg';
        const savedProfile = await this.profileReposity.save(profile);

        const u = new User();
        u.name = 'staff';
        u.password = Md5.hashStr('staff') as string;
        u.profile = savedProfile;
        await this.userRepository.save(u);

        const c1 = new MusicCollection();
        c1.cover = this.host + 'album/4.png';
        c1.name = 'recommend';
        c1.user = u;
        c1.musics = [];

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
