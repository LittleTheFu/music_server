import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { Music } from '../music/entity/music.entity';
import { User } from '../users/entity/user.entity';


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

    async getMusicComments(musicId: number): Promise<Comment[]> {
        return this.CommentRepository.createQueryBuilder('comment')
                                    .innerJoin('comment.music', 'music')
                                    .where('comment.music.id = :id', { id: musicId }).getMany();
    }

    async postMusicComments(musicId: number, userId: number, content: string): Promise<Comment[]> {
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

        return this.CommentRepository.createQueryBuilder('comment')
                                    .innerJoin('comment.music', 'music')
                                    .where('comment.music.id = :id', { id: musicId }).getMany();
    }
}
