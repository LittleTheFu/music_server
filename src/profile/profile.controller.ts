import { Controller, Post, Request, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Profile } from './entity/profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly musicService: ProfileService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('GetUserAvatar')
  async getUserAvatar(@Request() req, @Body() profileDto: ProfileDto): Promise<Profile> {
    return this.musicService.getProfileByName(profileDto.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(@UploadedFile() file, @Request() req) {
    const url = await this.musicService.setProfileAvatar(req.user.username,file.filename);
    const response = {
      remoteUrl: url,
    };
    return response;
  }
}