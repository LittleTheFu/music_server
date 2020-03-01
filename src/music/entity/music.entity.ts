import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, AfterLoad } from 'typeorm';

@Entity()
export class Music {
  // constructor() {
  //   this.pad = 9;
  // }

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

  pad: number;

  @AfterLoad()
  updateCounters() {
    this.pad = 100;
  }
}

@Entity()
export class MusicCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => Music)
  @JoinTable()
  musics: Music[];
}