import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import {  RetComments } from './entity/comment.entity';
import { PostMusicCommentsDto, GetMusicCommentsDto, DeleteMusicCommentsDto } from './dto/comment.dto';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly musicService: CommentService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('DeleteMusicComment')
  async deleteMusicComment(@Body() deleteMusicCommentsDto: DeleteMusicCommentsDto): Promise<RetMsgObj> {
    return this.musicService.deleteMusicComment(deleteMusicCommentsDto.commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicComments')
  async getMusicComments(@Request() req, @Body() getMusicCommentsDto: GetMusicCommentsDto): Promise<RetComments> {
    return this.musicService.getMusicComments(getMusicCommentsDto.musicId, getMusicCommentsDto.page, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('PostMusicComments')
  async postMusicComments(@Request() req, @Body() getMusicCommentsDto: PostMusicCommentsDto): Promise<RetMsgObj> {
    return this.musicService.postMusicComments(getMusicCommentsDto.musicId, req.user.userId, getMusicCommentsDto.content);
  }
}

