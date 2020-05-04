import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, RetComment } from './entity/comment.entity';
import { RawMusic } from '../music/entity/music.entity';
import { User } from '../users/entity/user.entity';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly helperService: HelperService,

        @InjectRepository(Comment)
        private readonly CommentRepository: Repository<Comment>,

        @InjectRepository(RawMusic)
        private readonly rawMusicRepository: Repository<RawMusic>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {

    }

    private getRetComment(c: Comment): RetComment {
        const r = new RetComment();

        r.content = c.content;
        r.username = c.user.name;
        r.id = c.id;
        r.date = c.date;
        r.avatar = this.helperService.getAvatarAddress(c.user.profile.avatar);
        r.userId = c.user.id;

        return r;
    }

    async getMusicComments(musicId: number): Promise<RetComment[]> {
        const comments = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .innerJoinAndSelect('comment.user', 'user')
            .innerJoinAndSelect('user.profile', 'pofile')
            .orderBy("comment.date", "DESC")
            .where('comment.music.id = :id', { id: musicId })
            .getMany();

        const retComments = comments.map((c: Comment) => {
            return this.getRetComment(c);
        })

        return retComments;
    }

    async postMusicComments(musicId: number, userId: number, content: string): Promise<RetComment[]> {
        const comment = new Comment;
        comment.content = content;

        const music = await this.rawMusicRepository.findOne({
            id: musicId,
        });

        comment.music = music;

        const user = await this.userRepository.findOne({
            id: userId,
        });
        comment.user = user;

        console.log('comment : ');
        console.log(comment);

        await this.CommentRepository.save(comment);

        const comments = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .innerJoinAndSelect('comment.user', 'user')
            .innerJoinAndSelect('user.profile', 'pofile')
            .orderBy("comment.date", "DESC")
            .where('comment.music.id = :id', { id: musicId }).getMany();

        const retComments = comments.map((c: Comment) => {
            return this.getRetComment(c);
        })

        return retComments;
    }
}
