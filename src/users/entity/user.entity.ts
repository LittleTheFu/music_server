import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, Unique, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Music, MusicCollection } from '../../music/entity/music.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Profile } from '../../profile/entity/profile.entity';
import { Mail } from '../../mail/entity/mail.entity';

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

    @OneToOne(type => Profile)
    @JoinColumn()
    profile: Profile;

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(type => Mail, mail => mail.from)
    sendMails: Mail[];

    @OneToMany(type => Mail, mail => mail.to)
    receiveMails: Comment[];
  }

  export class RetUserDetail {
    name: string;
    avatarUrl: string;
  }