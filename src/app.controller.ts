import { Controller, Get, Request, Post, UseGuards, UseInterceptors, UploadedFile} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  index: number;
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService) { this.index = 0; }

  @Get()
  getHello(): string {
    this.index++;
    return (this.index.toString());
    // return this.appService.getHello(); 
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('profile')
  // getProfile(@Request() req) {
  //   console.log('profile');
  //   console.log(req);
  //   return req.user;
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file) {
  //   console.log('UPLOAD');
  //   console.log(file);

  //   return 'goood';
  // }
}
