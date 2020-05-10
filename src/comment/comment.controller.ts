import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { RetComment, RetComments } from './entity/comment.entity';
import { PostMusicCommentsDto, GetMusicCommentsDto } from './dto/comment.dto';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly musicService: CommentService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicComments')
  async getMusicComments(@Request() req, @Body() getMusicCommentsDto: GetMusicCommentsDto): Promise<RetComments> {
    return this.musicService.getMusicComments(getMusicCommentsDto.musicId, getMusicCommentsDto.page);
  }

  @UseGuards(JwtAuthGuard)
  @Post('PostMusicComments')
  async postMusicComments(@Request() req, @Body() getMusicCommentsDto: PostMusicCommentsDto): Promise<RetMsgObj> {
    // console.log('postMusicComments : music: ' + getMusicCommentsDto.musicId + '__ user:' + req.user.userId)
    return this.musicService.postMusicComments(getMusicCommentsDto.musicId, req.user.userId, getMusicCommentsDto.content);
  }
}

