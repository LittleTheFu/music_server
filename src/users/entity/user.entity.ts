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

    @ManyToMany(() => RawMusic)
    @JoinTable()
    likes: RawMusic[]; 

    @OneToMany(() => MusicCollection, collection => collection.user, { onDelete: "CASCADE" })
    mixes: MusicCollection[];

    @OneToOne(() => Profile, { onDelete: "CASCADE" })
    @JoinColumn()
    profile: Profile;

    @OneToMany(() => Comment, comment => comment.user, { onDelete: "CASCADE" })
    comments: Comment[];

    @OneToMany(() => Mail, mail => mail.from)
    sendMails: Mail[];

    @OneToMany(() => Mail, mail => mail.to)
    receiveMails: Comment[];

    @ManyToMany(() => User, { onDelete: "CASCADE" })
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

  export class RetSimpleUser {
    id: number;
    name: string;
    avatarUrl: string;
  }
