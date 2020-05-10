export class GetMusicCommentsDto {
    musicId: number;
    page: number;
}

export class PostMusicCommentsDto {
    musicId: number;
    content: string;
}