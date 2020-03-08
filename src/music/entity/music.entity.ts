import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, AfterLoad } from 'typeorm';

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
}