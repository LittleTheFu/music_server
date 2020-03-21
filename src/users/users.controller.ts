import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegUserDto } from './dto/user.dto';

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
}
