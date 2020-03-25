import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,RetUserDetail } from './entity/user.entity';
import { MusicCollection } from '../music/entity/music.entity';
import { Profile } from '../profile/entity/profile.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, 
    
    @InjectRepository(MusicCollection)
    private readonly musicCollectionRepository: Repository<MusicCollection>,
    
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>) {
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
    collection.name = 'privateCollection_' + username;
    collection.cover = 'http://localhost:9999/album/1.png';
    user.playlist = collection;
    await this.musicCollectionRepository.save(collection);

    const profile = new Profile();
    user.profile = profile;
    await this.profileRepository.save(profile);

    const retUser = await this.usersRepository.save(user);
    return retUser;
  }

  async getUserDetail(userId: number): Promise<RetUserDetail> {
    // const user = await this.usersRepository.findOne({name: username});
    const user = await this.usersRepository.createQueryBuilder('user')
            // .leftJoinAndSelect('user.likes', 'music')
            // .leftJoinAndSelect('user.playlist', 'music_collection')
            .leftJoinAndSelect('user.profile', 'profile')
            // .leftJoinAndSelect('user.comments', 'comment')
            // .leftJoinAndSelect('user.sendMails', 'smail')
            // .leftJoinAndSelect('user.receiveMails', 'rmail')
            .where('user.id = :id', {id: userId})
            .getOne();

            
    console.log('GET USER DETAIL: ');
    console.log(user);

    const retUser = new RetUserDetail();
    retUser.name = user.name;
    retUser.avatarUrl = user.profile.avatarUrl;

    return retUser;
  }
}