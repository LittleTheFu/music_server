import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, Unique, OneToOne, JoinColumn } from 'typeorm';
import { Music, MusicCollection } from '../../music/entity/music.entity';

@Entity()
@Unique(['name'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @ManyToMany(type => Music)
    @JoinTable()
    likes: Music[]; 

    @OneToOne(type => MusicCollection)
    @JoinColumn()
    playlist: MusicCollection;
  }