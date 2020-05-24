import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, RetUserDetail, RetFollower, RetSimpleUser } from './entity/user.entity';
import { MusicCollection } from '../music/entity/music.entity';
import { Profile } from '../profile/entity/profile.entity';
import { Md5 } from 'ts-md5/dist/md5';
import { HelperService } from '../helper/helper.service';
import { ConverterService } from '../converter/converter.service';
import { RetMsgObj } from '../helper/entity/helper.entity.dto';
import { EventsGateway } from '../events/events.gateway';
// import { Mail } from '../mail/entity/mail.entity';
import { Mail } from '../mail/entity/mail.entity';
import { MailService } from '../mail/mail.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {

  constructor(    
    private readonly emailService: EmailService,
    private readonly mailService: MailService,
    private readonly eventsGateway: EventsGateway,
    private readonly converterService: ConverterService,
    private readonly helperService: HelperService,

    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,

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

    // const cnt = await this.mailRepository
    //   .createQueryBuilder('mail')
    //   .leftJoinAndSelect('mail.to', 'user')
    //   .where('user.id = :id', { id: userId })
    //   .andWhere('read = false')
    //   .getCount();
    const cnt = await this.mailService.getUnreadMailNum(userId);

    const ret = new RetSimpleUser();
    ret.id = result.id;
    ret.name = result.name;
    ret.avatarUrl = this.helperService.getAvatarAddress(result.profile.avatar);
    ret.unreadMailNum = cnt;

    return ret;
  }

  async changePassword(userId: number, password: string): Promise<RetMsgObj> {
    const u = await this.usersRepository.findOne(userId);
    if(u) {
      u.password = Md5.hashStr(password) as string;
    }

    await this.usersRepository.save(u);

    return new RetMsgObj();
  }


  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
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
    user.password = Md5.hashStr(password) as string;
    user.email = email;

    const profile = new Profile();
    user.profile = profile;
    await this.profileRepository.save(profile);

    const retUser = await this.usersRepository.save(user);

    console.log('before email');
    this.emailService.sendEmail(retUser.email);
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
    const follower = await this.usersRepository.findOne({ id: followerId });

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