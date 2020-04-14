import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegUserDto, DetailUserDto, FollowUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetUserDetail } from './entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post('register')
    async register(@Body() regUser: RegUserDto): Promise<object> {
        this.usersService.createOne(regUser.username, regUser.password);
        console.log('CREATE ONE USER');
        console.log(regUser);
        return {msg: 'successs'};
    }

    @UseGuards(JwtAuthGuard)
    @Post('detail')async detail(@Body() detailUserDto: DetailUserDto): Promise<RetUserDetail> {
        return this.usersService.getUserDetail(detailUserDto.userId);
        // console.log('CREATE ONE USER');
        // return {msg: 'detail'};
    }

    @UseGuards(JwtAuthGuard)
    @Post('follow')async follow(@Body() followUserDto: FollowUserDto): Promise<object> {
        return this.usersService.followUser(followUserDto.userId);
        // console.log('FOLLOW USER');
        // return {msg: 'success'};
    }
}
