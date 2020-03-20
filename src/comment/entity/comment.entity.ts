import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Music } from '../../music/entity/music.entity';
import { User } from '../../users/entity/user.entity';


@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(type => Music, music=>music.comments)
  music: Music;

  @ManyToOne(type => User, user=>user.comments)
  user: User;
}

export class RetComment {
    id: number;

    content: string;

    userName: string;
}