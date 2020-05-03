import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'http://localhost:9999/avatar/1.jpeg'})
    avatarUrl: string;
}