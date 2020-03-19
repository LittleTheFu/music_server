import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly CommentRepository: Repository<Comment>) {

    }

    async getMusicComments(musicId: number): Promise<Comment[]> {
        // return this.CommentRepository.find({relations: ['music'], where: { music.id === musicId }});
        return this.CommentRepository.createQueryBuilder('comment')
                                    .innerJoin('comment.music', 'music')
                                    .where('comment.music.id = :id', { id: musicId }).getMany();
    }
}
