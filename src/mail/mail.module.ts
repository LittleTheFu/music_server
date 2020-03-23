import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
// import { Comment } from './entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entity/mail.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
// import { MusicModule } from '../music/music.module';
// import { Music } from '../music/entity/music.entity';
// import { CommentController } from './comment.controller';
// import { CommentService } from './comment.service';

// import { User } from '../users/entity/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Mail]) ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}