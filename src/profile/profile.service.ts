import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entity/profile.entity';
import { User } from '../users/entity/user.entity';

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(Profile)
        private readonly ProfileRepository: Repository<Profile>,
        
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>) {
    }

    async getProfileByName(username: string): Promise<Profile> {
        const result = await this.UserRepository
            .createQueryBuilder('user')
            .innerJoinAndSelect('user.profile', 'profile')
            .where('user.name = :name', { name: username })
            .getOne();

            return result.profile;
    }

    async setProfileAvatar(username: string, avatarUrl: string): Promise<string> {
        // const user = await this.UserRepository.findOne({ relations: ['profile'], where: { id: userId } });
        // console.log('AFTER');
        // console.log(user);
        // user.profile.avatarUrl = avatarUrl;
        // await this.UserRepository.save(user);
        // const profile = await this.UserRepository.findOne

        const result = await this.UserRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.profile', 'profile')
        .where('user.name = :name', { name: username })
        .getOne();

        console.log(result);

        result.profile.avatarUrl = 'http://localhost:9999/avatar/' + avatarUrl;
        this.ProfileRepository.save(result.profile);

        return result.profile.avatarUrl;
    }
}
