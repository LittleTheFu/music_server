import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    
  }