import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, RetComment, RetComments } from './entity/comment.entity';
import { RawMusic } from '../music/entity/music.entity';
import { User } from '../users/entity/user.entity';
import { HelperService } from '../helper/helper.service';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

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

    private getRetComment(c: Comment, userId: number): RetComment {
        const r = new RetComment();

        r.content = c.content;
        r.username = c.user.name;
        r.id = c.id;
        r.date = c.date;
        r.avatar = this.helperService.getAvatarAddress(c.user.profile.avatar);
        r.userId = c.user.id;
        r.canBeDeleted = (userId === r.userId);

        return r;
    }

    //page: 1,2,3......N
    async getMusicComments(musicId: number, page: number, userId: number): Promise<RetComments> {
        const NUM_PER_PAGE = 5;
        const comments = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .innerJoinAndSelect('comment.user', 'user')
            .innerJoinAndSelect('user.profile', 'pofile')
            .orderBy("comment.date", "DESC")
            .where('comment.music.id = :id', { id: musicId })
            .skip((page - 1) * NUM_PER_PAGE)
            .take(NUM_PER_PAGE)
            .getMany();

        const r = comments.map((c: Comment) => {
            return this.getRetComment(c, userId);
        })

        const retComments = new RetComments();
        retComments.comments = r;

        const count = await this.CommentRepository.createQueryBuilder('comment')
            .innerJoin('comment.music', 'music')
            .where('comment.music.id = :id', { id: musicId })
            .getCount();


        retComments.pageNum = Math.ceil(count / NUM_PER_PAGE);

        return retComments;
    }

    async deleteMusicComment(commentId: number): Promise<RetMsgObj> {
        await this.CommentRepository
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where("id = :id", { id: commentId })
        .execute();

        return new RetMsgObj();
    }

    async postMusicComments(musicId: number, userId: number, content: string): Promise<RetMsgObj> {
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

        return new RetMsgObj();
    }
}
