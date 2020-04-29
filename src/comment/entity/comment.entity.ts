import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { RawMusic } from '../../music/entity/music.entity';
import { User } from '../../users/entity/user.entity';


@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(type => RawMusic, music=>music.comments)
  music: RawMusic;

  @ManyToOne(type => User, user=>user.comments)
  user: User;

  @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
  date: Date;
}

export class RetComment {
    id: number;

    content: string;

    username: string;

    avatar: string;

    userId: number;

    date: Date;
}