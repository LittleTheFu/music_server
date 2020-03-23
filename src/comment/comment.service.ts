import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Comment, RetComment } from './entity/comment.entity';
import { Music } from '../music/entity/music.entity';
import { User } from '../users/entity/user.entity';
import { rootCertificates } from 'tls';


@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly CommentRepository: Repository<Comment>,

        @InjectRepository(Music)
        private readonly musicRepository: Repository<Music>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {

    }

    async getMusicComments(musicId: number): Promise<RetComment[]> {
        const comments = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .innerJoinAndSelect('comment.user', 'user')
            .innerJoinAndSelect('user.profile', 'pofile')
            .where('comment.music.id = :id', { id: musicId })
            .getMany();

        // console.log(comments);

        const retComments = comments.map((c: Comment) => {
            const rc = new RetComment();
            rc.content = c.content;
            rc.username = c.user.name;
            rc.id = c.id;
            rc.avatar = c.user.profile.avatarUrl;
            rc.userId = c.user.id;
            return rc;
        })

        // console.log(retComments);

        return retComments;
    }

    async postMusicComments(musicId: number, userId: number, content: string): Promise<RetComment[]> {
        const comment = new Comment;
        comment.content = content;

        const music = await this.musicRepository.findOne({
            id: musicId,
        });
        comment.music = music;

        const user = await this.userRepository.findOne({
            id: userId,
        });
        comment.user = user;

        await this.CommentRepository.save(comment);

        const comments = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .innerJoinAndSelect('comment.user', 'user')
            .innerJoinAndSelect('user.profile', 'pofile')
            .where('comment.music.id = :id', { id: musicId }).getMany();

        // console.log(comments);

        const retComments = comments.map((c: Comment) => {
            const rc = new RetComment();
            rc.content = c.content;
            rc.username = c.user.name;
            rc.id = c.id;
            rc.avatar = c.user.profile.avatarUrl;
            rc.userId = c.user.id;
            return rc;
        })

        // console.log(retComments);

        return retComments;
    }
}
