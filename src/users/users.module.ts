import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { MusicModule } from '../music/music.module';
import { MusicCollection } from '../music/entity/music.entity';

@Module({
  imports: [forwardRef(()=>MusicModule), TypeOrmModule.forFeature([User, MusicCollection])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}