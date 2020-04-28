import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log('before validate user : ' + username + ' ' + pass);
    const user = await this.usersService.findOne(username);
    const hashedPass = Md5.hashStr(pass) as string;
    if (user && user.password === hashedPass) {
      const { password, ...result } = user;
      // result.name = 'gggg';
      console.log('user-- : ' + JSON.stringify(user));
      console.log('user-result : ' + result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('local login : ' + JSON.stringify(user));
    const payload = { username: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}