import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Profile } from '../profile/entity/profile.entity';
import { MusicCollection, RawMusic, Artist, MusicAlbum } from '../music/entity/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    private createRawMusic = ( name: string, artist: Artist, album: MusicAlbum ): void => {
        const rm = new RawMusic();

        rm.name = name;
        rm.musicArtist = artist;
        rm.musicAlbum = album;

        this.rawMusicRepository.save(rm);
    }

    async initDbData(): Promise<void> {

        const albumWT = new MusicAlbum();
        albumWT.name = 'Walküre_Trap!';

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
