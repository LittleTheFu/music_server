// import { Controller, Get, Res, HttpCode, Header, Req } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { MusicService } from './music.service';
// import { Request } from 'express';

// import * as fs from "fs";

@Controller('music')
export class MusicController {
  index: number;
  constructor(private readonly musicService: MusicService) {
    this.index = 4;
  }

  @Get('nextMusic')
  getNextMusic(): object {
    this.index++;
    const name = 'http://localhost:9999/music/' + ((this.index) % 8).toString() + '.mp3';
    const cover = 'http://localhost:9999/album/' + ((this.index) % 8).toString() + '.png';
    console.log(name);
    return { 'name': name, 'cover': cover };
  }

  // @Get()
  // findAll(): string {
  //     return "a";
  // }

  // @Get()
  // @Header('Content-Type', 'audio/mpeg')
  // // @HttpCode(206)
  // findAll(@Req() request: Request,@Res() res): void {
  //   // async findAll(): Promise<string> {
  //   this.index++;
  //   const name = ((this.index) % 8).toString() + '.mp3';
  //   console.log('--------------')
  //   console.log(request.headers.range);
  //   console.log(name);
  //   console.log('next route');
  //   // for( let i = 0; i < 1600000000; i++)
  //   // {
  //   //   if(i===1000) console.log('aaaa');
  //   // }
  //   // console.log('done')

  //   res.sendFile(name, { root: './public'});
  //   // const rstream = fs.createReadStream('./public/' + name);
  //   // rstream.pipe(res);
  //   // res.end();
  //   // fs.readFile('./public/' + name,  (err, data) =>{
  //   //   res.end(data);
  //   // })
  // //  return name;
  // // return new Promise(resolve => {
  // //   this.index++;
  // //   const name = ((this.index) % 8).toString() + '.mp3';
  // //   console.log(name);
  // //   console.log('next route');
  // //   for( let i = 0; i < 1600000000; i++)
  // //   {
  // //     if(i===1000) console.log('aaaa');
  // //   }
  // //       console.log('done');
  // //   resolve(name);
  // // });
  // console.log('***********')
  // }

  // // @Get('next')
  // // getNextMusic(@Res() res): Promise<void> {
  // //   this.index++;
  // //   const name = ((this.index) % 2).toString() + '.mp3';
  // //   console.log(name);
  // //   console.log('next route');
  // //   return res.sendFile('name.mp3', { root: './public' });
  // // }
}