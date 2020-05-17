import { Controller, Get, Request, Post, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
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
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
