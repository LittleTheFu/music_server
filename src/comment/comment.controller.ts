import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { Comment, RetComment } from './entity/comment.entity';
import { GetMusicCommentsDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly musicService: CommentService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicComments')
  async getMusicComments(@Request() req, @Body() getMusicCommentsDto: GetMusicCommentsDto): Promise<RetComment[]> {
      return this.musicService.getMusicComments(getMusicCommentsDto.musicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('PostMusicComments')
  async postMusicComments(@Request() req, @Body() getMusicCommentsDto: GetMusicCommentsDto): Promise<RetComment[]> {
      console.log('postMusicComments : music: ' + getMusicCommentsDto.musicId + '__ user:' + req.user.userId)
      return this.musicService.postMusicComments(getMusicCommentsDto.musicId, req.user.userId, getMusicCommentsDto.content);
  }
}

