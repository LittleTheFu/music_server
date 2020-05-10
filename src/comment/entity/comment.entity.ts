import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RawMusic } from '../../music/entity/music.entity';
import { User } from '../../users/entity/user.entity';


@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => RawMusic, music=>music.comments)
  music: RawMusic;

  @ManyToOne(() => User, user=>user.comments)
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

export class RetComments {
  comments: RetComment[];
  pageNum: number;
}