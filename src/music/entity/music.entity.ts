import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Music {
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