import { Controller, Post, Request, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegUserDto, DetailUserDto, FollowUserDto, GetUserFollowersDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetUserDetail, RetSimpleUser, RetFollower } from './entity/user.entity';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post('register')
    async register(@Body() regUser: RegUserDto): Promise<RetMsgObj> {
        const user = await this.usersService.createOne(regUser.username, regUser.password);
        if (user === null) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'name is already registered!',
            }, HttpStatus.FORBIDDEN);
        }

        return new RetMsgObj();
    }

    @UseGuards(JwtAuthGuard)
    @Post('me') async me(@Request() req): Promise<RetSimpleUser> {
        return this.usersService.getMe(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('detail') async detail(@Request() req, @Body() detailUserDto: DetailUserDto): Promise<RetUserDetail> {
        return this.usersService.getUserDetail(req.user.userId, detailUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('follow') async follow(@Request() req, @Body() followUserDto: FollowUserDto): Promise<RetMsgObj> {
        return this.usersService.followUser(req.user.userId, followUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollow') async unfollow(@Request() req, @Body() followUserDto: FollowUserDto): Promise<RetMsgObj> {
        return this.usersService.unfollowUser(req.user.userId, followUserDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('getUserFollowers') async getUserFollowers(@Request() req, @Body() getUserFollowersDto: GetUserFollowersDto): Promise<RetFollower[]> {
        return this.usersService.getUserFollowers(req.user.userId, getUserFollowersDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('getAllUsers') async getAllUsers(): Promise<RetSimpleUser[]> {
        return this.usersService.getAllUsers();
    }
}
