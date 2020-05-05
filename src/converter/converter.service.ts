import { Injectable } from '@nestjs/common';
import {
    Music,
    MusicCollection,
    RetCollectionDetail,
    MusicAlbum,
    RawMusic,
    RetAlbumDetail,
} from '../music/entity/music.entity';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class ConverterService {
    constructor(
        private helperService: HelperService) {

    }

    GetReturnMusic(r: RawMusic, userId: number): Music {
        const m = new Music();
        m.id = r.id;
        m.name = r.name;
        m.like = r.like;
        m.artist = r.musicArtist.name;
        m.artistId = r.musicArtist.id;
        m.albumId = r.musicAlbum.id;
        m.album = r.musicAlbum.name;
        m.address = this.helperService.getMusicAddress(r.musicAlbum.name, r.name);
        m.cover = this.helperService.getCoverAddress(r.musicAlbum.name);

        m.likedByCurrentUser = false;
        if (userId != null) {
            if (r.liker.find((usr) => { return usr.id === userId; })) {
                m.likedByCurrentUser = true;
            }
        }

        return m;
    }

    GetReturnAlbum(a: MusicAlbum, userId: number): RetAlbumDetail {
        const r = new RetAlbumDetail();

        r.id = a.id;
        r.name = a.name;
        r.cover = this.helperService.getCoverAddress(a.name);
        r.musics = a.musics.map((m) => {
            return this.GetReturnMusic(m, userId);
        });

        return r;
    }

    getReturnMusicCollection(c: MusicCollection, userId: number, canBeDeleted = false): RetCollectionDetail {
        const r = new RetCollectionDetail();

        r.id = c.id;
        r.cover = this.helperService.getFakeCover(c.cover);
        r.name = c.name;
        r.musics = c.musics.map((m) => {
            return this.GetReturnMusic(m, userId);
        });

        r.canBeDeleted = canBeDeleted;

        return r;
    }


}