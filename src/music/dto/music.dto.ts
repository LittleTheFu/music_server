export class LikeMusicDto { 
    musicId: number;
}

export class PersonalListMusicDto {
    musicId: number;
}

export class GetMusicByCollectionNameDto {
    name: string;
}

export class GetMusicByCollectionIdDto {
    id: number;
}

export class DeleteCollectionDto {
    id: number;
}

export class AddMusicToCollectionDto {
    collectionId: number;
    musicId: number;
}

export class GetMusicByKeywordDto {
    keyword: string;
}

export class GetMusicLyricDto {
    musicId: number;
}

export class CreateCollectionDto {
    name: string;
}