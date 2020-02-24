import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  index : number;
  constructor(private readonly appService: AppService) {this.index = 0;}

  @Get()
  getHello(): string {
    this.index++;
    return (this.index.toString());
    // return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
