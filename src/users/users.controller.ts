import { Controller, Post, Request, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    RegUserDto,
    DetailUserDto,
    FollowUserDto,
    GetUserFollowersDto,
    EditPasswordDto,
    ForgetPasswordDto,
    ResetPasswordDto
} from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RetUserDetail, RetSimpleUser, RetFollower } from './entity/user.entity';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('edit_password')
    async editPassword(@Request() req, @Body() editPasswordDto: EditPasswordDto): Promise<RetMsgObj> {
        return this.usersService.changePassword(req.user.userId, editPasswordDto.password);
    }

    @Post('register')
    async register(@Body() regUser: RegUserDto): Promise<RetMsgObj> {
        const user = await this.usersService.createOne(regUser.username, regUser.password, regUser.email);
        if (user === null) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'name is already registered!',
            }, HttpStatus.FORBIDDEN);
        }

        return new RetMsgObj();
    }

    @Post('forget_password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<RetMsgObj> {
        return this.usersService.sendResetPasswordMail(forgetPasswordDto.username, forgetPasswordDto.email);
    }

    @Post('reset_password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<RetMsgObj> {
        return this.usersService.resetPassword(resetPasswordDto.key);
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
