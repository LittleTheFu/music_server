import { Controller, Get, Post, Request, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegUserDto, DetailUserDto, FollowUserDto, GetUserFollowersDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetUserDetail, RetMe } from './entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post('register')
    async register(@Body() regUser: RegUserDto): Promise<object> {
        const user = await this.usersService.createOne(regUser.username, regUser.password);
        if (user === null) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'name is already registered!',
            }, HttpStatus.FORBIDDEN);
        }

        return { msg: 'successs' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('me') async me(@Request() req): Promise<RetMe> {
        return this.usersService.getMe(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('detail') async detail(@Request() req, @Body() detailUserDto: DetailUserDto): Promise<RetUserDetail> {
        return this.usersService.getUserDetail(req.user.userId, detailUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('follow') async follow(@Request() req, @Body() followUserDto: FollowUserDto): Promise<object> {
        return this.usersService.followUser(req.user.userId, followUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollow') async unfollow(@Request() req, @Body() followUserDto: FollowUserDto): Promise<object> {
        return this.usersService.unfollowUser(req.user.userId, followUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('getUserFollowers') async getUserFollowers(@Request() req, @Body() getUserFollowersDto: GetUserFollowersDto): Promise<object> {
        return this.usersService.getUserFollowers(req.user.userId, getUserFollowersDto.userId);
    }
}
