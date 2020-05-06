import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    readonly MUSICS_DIRECTORY = 'musics/';
    readonly ARTIST_DIRECTORY = 'artist/';
    readonly AVATAR_DIRECTORY = 'avatar/';

    port: string;
    hostName: string;
    host: string;

    constructor(private readonly configService: ConfigService) {

        this.hostName = this.configService.get<string>('HOSTNAME');
        this.port = this.configService.get<string>('PORT');

        this.host = 'http://' + this.hostName + (':') + this.port + '/';
    }

    getProt(): string {
        return this.port;
    }

    getHostName(): string {
        return this.hostName;
    }

    getHost(): string {
        return this.host;
    }

    private getMusicsRoot(): string {
        return this.host + this.MUSICS_DIRECTORY;
    }

    getMusicAddress(album: string, file: string): string {
        return this.getMusicsRoot() + album + '/' + file + '.mp3';
    }

    getCoverAddress(album: string): string {
        return this.getMusicsRoot() + album + '/' + 'cover.png';
    }

    private getArtistRoot(): string {
        return this.host + this.ARTIST_DIRECTORY;
    }

    getArtistAddress(artist: string): string {
        return this.getArtistRoot() + artist + '.png';
    }

    private getAvatarRoot(): string {
        return this.host + this.AVATAR_DIRECTORY;
    }

    getAvatarAddress(file: string): string {
        return this.getAvatarRoot() + file;
    }

    getFakeCover(file: string): string {
        return this.getHost() + 'mix' + '/' + file;
    }

    private randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    genMixCoverImg(): string {
        return this.randomInteger(0, 7) + '.png';
    }
}
