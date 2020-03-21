import { Controller, Get, Post, Request, Body, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
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
    // console.log('GET USER AVATAR ------');
    // const p = new Profile();
    // p.id = 1;
    // p.avatarUrl = 'http://localhost:9999/avatar/1.jpeg';
    // return p
    return this.musicService.getProfileByName(profileDto.username);
  }

  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log('UPLOAD');
    console.log(file);

    return 'goood';
  }
}