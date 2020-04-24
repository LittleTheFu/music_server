import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,RetUserDetail, RetFollower, RetMe } from './entity/user.entity';
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

  async getMe(userId: number) : Promise<RetMe> {
    const result = await this.usersRepository
    .createQueryBuilder('user')
    .innerJoinAndSelect('user.profile', 'profile')
    .where('user.id = :id', { id: userId })
    .getOne();

    // console.log(result);
    const ret = new RetMe();
    ret.id = result.id;
    ret.name = result.name;
    ret.avatarUrl = result.profile.avatarUrl;

    // console.log('MEMEME');
    // console.log(ret);
    // console.log('MEMEME')

    return ret;
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      name: username
    });
    return user;
  }

  async createOne(username: string, password: string): Promise<User> {
    const user = new User();
    user.name = username;
    user.password = password;

    // const collection = new MusicCollection();
    // collection.name = 'privateCollection_' + username;
    // collection.cover = 'http://localhost:9999/album/1.png';
    // user.playlist = collection;
    // await this.musicCollectionRepository.save(collection);

    const profile = new Profile();
    user.profile = profile;
    await this.profileRepository.save(profile);

    const retUser = await this.usersRepository.save(user);
    return retUser;
  }

  async getUserDetail(meId: number, userId: number): Promise<RetUserDetail> {
    const me = await this.usersRepository.findOne({ relations: ['following'], where: { id: meId}});
    const user = await this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.playlist', 'collections')
            .where('user.id = :id', {id: userId})
            .getOne();

    const filteredFollower = me.following.find((u)=>{return u.id === user.id});

    const retUser = new RetUserDetail();
    retUser.name = user.name;
    retUser.avatarUrl = user.profile.avatarUrl;
    retUser.collections = user.playlist;
    retUser.isFollowed = (filteredFollower != null);

    return retUser;
  }

  async followUser(userId: number, followerId: number): Promise<object> {
    const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId } });
    const follower = await this.usersRepository.findOne({id: followerId});
    
    user.following.push(follower);
    await this.usersRepository.save(user);

    return {msg: 'success'};
  }

  async unfollowUser(userId: number, followerId: number): Promise<object> {
    const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId } });
    
    user.following = user.following.filter((u)=>{u.id != followerId});
    await this.usersRepository.save(user);

    return {msg: 'success'};
  }

  async getUserFollowers(meId: number, userId: number): Promise<RetFollower[]> {
    const me = await this.usersRepository.findOne({ relations: ['following'], where: { id: meId}});
    // const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId}});

    const user = await this.usersRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.following', 'following')
    .leftJoinAndSelect('following.profile', 'following_profile')
    .where('user.id = :id', {id: userId})
    .getOne();

    const ret = user.following.map((f)=>{
      const r = new RetFollower();
      r.id = f.id;
      r.avatarUrl = f.profile.avatarUrl;
      r.name = f.name;
      r.isFollowed = false;

      me.following.forEach((mf)=>{if(mf.id === f.id) {
        r.isFollowed = true;
      }});

      return r;
    })

    // console.log(user.following);
    // console.log(ret);

    return ret;
  }
}