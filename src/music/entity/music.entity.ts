import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable,  OneToMany, ManyToOne } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Music {
  constructor() {
    this.likedByCurrentUser = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;
  @Column()
  cover: string;

  @Column()
  name: string; 

  @Column()
  artist: string;

  @Column()
  album: string;

  @Column()
  like: number;

  likedByCurrentUser: boolean;

  @OneToMany(type => Comment, comment => comment.music)
  comments: Comment[];
  // @AfterLoad()
  // updateCounters() {
  //   if( this.id === 1) {
  //     this.likedByCurrentUser = true;
  //   } else {
  //     this.likedByCurrentUser = false;
  //   }
  // }
}

@Entity()
export class MusicCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cover: string;

  @ManyToMany(type => Music)
  @JoinTable()
  musics: Music[];

  @ManyToOne(type => User, user => user.playlist, { onDelete: "CASCADE" })
  user: User;
}

export class RetCollectionDetail {
  cover: string;
  name: string;
  canBeDeleted: boolean;
  musics: Music[];
}