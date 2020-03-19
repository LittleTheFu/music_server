import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';
import { GetMusicCommentsDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly musicService: CommentService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetMusicComments')
  async getMusicComments(@Request() req, @Body() getMusicCommentsDto: GetMusicCommentsDto): Promise<Comment[]> {
      return this.musicService.getMusicComments(getMusicCommentsDto.musicId);
  }
}

