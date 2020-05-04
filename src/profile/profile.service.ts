import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entity/profile.entity';
import { User } from '../users/entity/user.entity';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class ProfileService {
    host: string;

    constructor(
        private helperService: HelperService,

        @InjectRepository(Profile)
        private readonly ProfileRepository: Repository<Profile>,
        
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>) {
            this.host = this.helperService.getHost();
    }

    async getProfileByName(username: string): Promise<Profile> {
        const result = await this.UserRepository
            .createQueryBuilder('user')
            .innerJoinAndSelect('user.profile', 'profile')
            .where('user.name = :name', { name: username })
            .getOne();

            return result.profile;
    }

    async setProfileAvatar(username: string, fileName: string): Promise<string> {
        const result = await this.UserRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.profile', 'profile')
        .where('user.name = :name', { name: username })
        .getOne();

        console.log(result);

        result.profile.avatar = fileName;
        this.ProfileRepository.save(result.profile);

        return this.helperService.getAvatarAddress(fileName);
    }
}
