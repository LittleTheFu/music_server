import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, Unique, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { MusicCollection, RawMusic } from '../../music/entity/music.entity';
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

    @ManyToMany(type => RawMusic)
    @JoinTable()
    likes: RawMusic[]; 

    @OneToMany(type => MusicCollection, collection => collection.user, { onDelete: "CASCADE" })
    playlist: MusicCollection[];

    @OneToOne(type => Profile, { onDelete: "CASCADE" })
    @JoinColumn()
    profile: Profile;

    @OneToMany(type => Comment, comment => comment.user, { onDelete: "CASCADE" })
    comments: Comment[];

    @OneToMany(type => Mail, mail => mail.from)
    sendMails: Mail[];

    @OneToMany(type => Mail, mail => mail.to)
    receiveMails: Comment[];

    @ManyToMany(type => User, { onDelete: "CASCADE" })
    @JoinTable()
    following: User[];
  }

  export class RetUserDetail {
    name: string;
    avatarUrl: string;
    isFollowed: boolean;
    collections: MusicCollection[];
  }

  export class RetFollower {
    id: number;
    name: string;
    avatarUrl: string;
    isFollowed: boolean;
  }

  export class RetMe {
    id: number;
    name: string;
    avatarUrl: string;
  }
