import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '1.jpeg'})
    avatar: string;
}