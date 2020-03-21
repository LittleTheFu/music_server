import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
// import { Music, MusicCollection } from './entity/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
import { Profile } from './entity/profile.entity';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Profile, User]) ],
  controllers: [ProfileController],
  providers: [ProfileService],
//   exports: [MusicService]
})
export class ProfileModule {}
