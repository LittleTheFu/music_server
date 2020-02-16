import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
}
