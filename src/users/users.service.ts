import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>) {
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      name: username
    });
    return user;
  }

  async createOne(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.create({name: username, password: password});
    const retUser = await this.usersRepository.save(user);
    return retUser;
  }
}