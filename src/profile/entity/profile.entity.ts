import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'http://localhost:9999/avatar/1.jpeg'})
    avatarUrl: string;
}