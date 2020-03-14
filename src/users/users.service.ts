import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { MusicCollection } from '../music/entity/music.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, 
    
    @InjectRepository(MusicCollection)
    private readonly musicCollectionRepository: Repository<MusicCollection>) {
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      name: username
    });
    return user;
  }

  async createOne(username: string, password: string): Promise<User> {
    // const user = await this.usersRepository.create({name: username, password: password});
    const user = new User();
    user.name = username;
    user.password = password;

    const collection = new MusicCollection();
    collection.name = username;
    collection.cover = 'http://localhost:9999/album/1.png';

    user.playlist = collection;
    await this.musicCollectionRepository.save(collection);
    const retUser = await this.usersRepository.save(user);
    return retUser;
  }
}