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
}
