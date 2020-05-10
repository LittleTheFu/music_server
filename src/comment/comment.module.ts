import { Module } from '@nestjs/common';
import { Comment } from './entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
import { MusicModule } from '../music/music.module';
import { RawMusic } from '../music/entity/music.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { HelperModule } from '../helper/helper.module';

// import { User } from '../users/entity/user.entity';

@Module({
  imports: [HelperModule, UsersModule, MusicModule, TypeOrmModule.forFeature([Comment, User, RawMusic])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }