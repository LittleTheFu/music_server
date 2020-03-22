import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
// import { Music, MusicCollection } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
import { Profile } from './entity/profile.entity';
// import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

// MulterModule.register({
//     dest: __dirname + '../../public/album',
//   }),

@Module({
    imports: [MulterModule.register({
        dest: './public/avatar',
    }), TypeOrmModule.forFeature([Profile, User])],
    controllers: [ProfileController],
    providers: [ProfileService],
    //   exports: [MusicService]
})
export class ProfileModule { }
