import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  RetUserDetail,
  RetFollower,
  RetSimpleUser,
  ResetInfo
} from './entity/user.entity';
import { MusicCollection } from '../music/entity/music.entity';
import { Profile } from '../profile/entity/profile.entity';
import * as crypto from 'crypto';
import { HelperService } from '../helper/helper.service';
import { ConverterService } from '../converter/converter.service';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';
import { MailService } from '../mail/mail.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly emailService: EmailService,
    private readonly mailService: MailService,
    private readonly converterService: ConverterService,
    private readonly helperService: HelperService,

    @InjectRepository(ResetInfo)
    private readonly resetInfoRepository: Repository<ResetInfo>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(MusicCollection)
    private readonly musicCollectionRepository: Repository<MusicCollection>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>) {
  }

  async getMe(userId: number): Promise<RetSimpleUser> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.receiveMails', 'receive')
      .where('user.id = :id', { id: userId })
      .getOne();

    const cnt = await this.mailService.getUnreadMailNum(userId);

    const ret = new RetSimpleUser();
    ret.id = result.id;
    ret.name = result.name;
    ret.avatarUrl = this.helperService.getAvatarAddress(result.profile.avatar);
    ret.unreadMailNum = cnt;

    return ret;
  }

  async changePassword(userId: number, password: string): Promise<RetMsgObj> {
    const u = await this.usersRepository.findOneBy({ id: userId });
    if (u) {
      u.password = crypto.createHash('md5').update(password).digest('hex');
    }

    await this.usersRepository.save(u);

    return new RetMsgObj();
  }

  async resetPassword(key: string): Promise<RetMsgObj> {
    const info = await this.resetInfoRepository.createQueryBuilder('info')
      .orderBy('info.date', 'DESC')
      .where('info.key = :key', { key: key })
      .getOne();

    console.log('info:');
    console.log(info);

    if(!info) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'no such key!',
      }, HttpStatus.FORBIDDEN);
    }

    const user = await this.usersRepository.findOneBy({
      name: info.name,
      email: info.email
    });

    if(!user) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'no such user!',
      }, HttpStatus.FORBIDDEN);
    }

    user.password = crypto.createHash('md5').update('1234').digest('hex');
    await this.usersRepository.save(user);

    await this.resetInfoRepository.delete({ name: info.name});

    return new RetMsgObj('your password is 1234, please change it after you login!');
  }

  async sendResetPasswordMail(username: string, email: string): Promise<RetMsgObj> {
    console.log('reset password');
    const user = await this.usersRepository.findOneBy({
      name: username,
      email: email
    });

    console.log(user);
    if (!user) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'invalid input!',
      }, HttpStatus.FORBIDDEN);
    }

    const resetInfo = new ResetInfo();
    resetInfo.name = username;
    resetInfo.email = email;
    resetInfo.key = crypto.createHash('md5').update((Math.random() * 1000).toString()).digest('hex');

    await this.resetInfoRepository.save(resetInfo);

    this.emailService.sendEmail(email, 'click here to reset', this.helperService.getResetUrl(resetInfo.key));

    return new RetMsgObj('we send an email to you,it could be moved to trashbox by your email block system.');
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({
      name: username
    });
    return user;
  }

  async createOne(username: string, password: string, email: string): Promise<User> {
    const exsitUser = await this.findOne(username)

    if (exsitUser != null) {
      return null;
    }

    const user = new User();
    user.name = username;
    user.password = crypto.createHash('md5').update(password).digest('hex');
    user.email = email;

    const profile = new Profile();
    user.profile = profile;
    await this.profileRepository.save(profile);

    const retUser = await this.usersRepository.save(user);

    console.log('before email');
    this.emailService.sendEmail(retUser.email, 'welcome', 'welcome');
    console.log('end email');
    return retUser;
  }

  async getUserDetail(meId: number, userId: number): Promise<RetUserDetail> {
    const me = await this.usersRepository.findOne({ relations: ['following'], where: { id: meId } });
    const user = await this.usersRepository.findOne(
      {
        relations: [
          'following',
          'profile',
          'mixes',
          'mixes.musics',
          'mixes.musics.musicAlbum',
          'mixes.musics.musicArtist',
          'mixes.musics.liker'], where: { id: userId }
      });

    const filteredFollower = me.following.find((u) => { return u.id === user.id });

    const retUser = new RetUserDetail();
    retUser.name = user.name;
    retUser.avatarUrl = this.helperService.getAvatarAddress(user.profile.avatar);
    retUser.collections = user.mixes.map((c) => {
      return this.converterService.getReturnMusicCollection(c, meId, meId === userId);
    })
    retUser.isFollowed = (filteredFollower != null);

    return retUser;
  }

  async followUser(userId: number, followerId: number): Promise<RetMsgObj> {
    const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId } });
    const follower = await this.usersRepository.findOneBy({ id: followerId });

    user.following.push(follower);
    await this.usersRepository.save(user);

    await this.mailService.sendMail(userId, followerId, "I followed you!");

    return new RetMsgObj();
  }

  async unfollowUser(userId: number, followerId: number): Promise<RetMsgObj> {
    const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId } });
    user.following = user.following.filter((u) => { return u.id != followerId });

    await this.mailService.sendMail(userId, followerId, "I unfollowed you!");

    return new RetMsgObj();
  }

  async getAllUsers(): Promise<RetSimpleUser[]> {
    const users = await this.usersRepository.find({ relations: ['profile'] });

    const retUsers = users.map((u) => {
      const r = new RetSimpleUser();

      r.id = u.id;
      r.name = u.name;
      r.avatarUrl = this.helperService.getAvatarAddress(u.profile.avatar);

      return r;
    })

    return retUsers;
  }


  async getUserFollowers(meId: number, userId: number): Promise<RetFollower[]> {
    const me = await this.usersRepository.findOne({ relations: ['following'], where: { id: meId } });
    // const user = await this.usersRepository.findOne({ relations: ['following'], where: { id: userId}});

    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'following')
      .leftJoinAndSelect('following.profile', 'following_profile')
      .where('user.id = :id', { id: userId })
      .getOne();

    const ret = user.following.map((f) => {
      const r = new RetFollower();
      r.id = f.id;
      r.avatarUrl = this.helperService.getAvatarAddress(f.profile.avatar);
      r.name = f.name;
      r.isFollowed = false;

      me.following.forEach((mf) => {
        if (mf.id === f.id) {
          r.isFollowed = true;
        }
      });

      return r;
    })

    return ret;
  }
} 