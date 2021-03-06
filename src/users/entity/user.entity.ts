import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, Unique, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { MusicCollection, RawMusic, RetCollectionDetail } from '../../music/entity/music.entity';
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
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => RawMusic, music => music.liker)
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
    receiveMails: Mail[];

    @ManyToMany(() => User, { onDelete: "CASCADE" })
    @JoinTable()
    following: User[];
  }

  @Entity()
  export class ResetInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    key: string;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date;
  }

  export class RetUserDetail {
    name: string;
    avatarUrl: string;
    isFollowed: boolean;
    collections: RetCollectionDetail[];
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
    unreadMailNum: number;
  }
