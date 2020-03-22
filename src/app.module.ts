import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import * as ormconfig from './ormconfig';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.
  console.log('DYNAMIC ORM CONFIG');
  return TypeOrmModule.forRoot(ormconfig);
}

// MulterModule.register({
//   dest: '/upload',
// });
 
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    MusicModule,
    CommentModule,
    ProfileModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
