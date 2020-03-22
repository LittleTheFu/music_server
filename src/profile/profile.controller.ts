import { Controller, Get, Post, Request, Body, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(@UploadedFile() file, @Request() req) {
    console.log('UPLOAD');
    console.log(file);
    console.log(req.user);
    // console.log(req);

    const url = await this.musicService.setProfileAvatar(req.user.username,file.filename);
    const response = {
      remoteUrl: url,
    };
    return response;
  }
}