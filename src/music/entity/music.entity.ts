import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class MusicAlbum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => RawMusic, music => music.musicAlbum)
  musics: RawMusic[];
}



@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => MusicAlbum, { cascade: true })
  @JoinTable()
  musicAlbums: MusicAlbum[];
}

@Entity()
export class RawMusic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => MusicAlbum)
  musicAlbum: MusicAlbum;

  @ManyToOne(type => Artist)
  musicArtist: Artist;

  @Column({default: 0})
  like: number;

  @OneToMany(type => Comment, comment => comment.music)
  comments: Comment[];
}

export class Music {
  constructor() {
    this.likedByCurrentUser = false;
  }

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
  artistId: number;

  @Column()
  album: string;

  @Column()
  like: number;

  likedByCurrentUser: boolean;

  @OneToMany(type => Comment, comment => comment.music)
  comments: Comment[];

  @ManyToOne(type => MusicAlbum)
  musicAlbum: MusicAlbum;

  @ManyToOne(type => Artist)
  musicArtist: Artist;
}

@Entity()
export class MusicCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cover: string;

  @ManyToMany(type => RawMusic)
  @JoinTable()
  musics: RawMusic[];

  @ManyToOne(type => User, user => user.playlist, { onDelete: "CASCADE" })
  user: User;
}



export class RetCollectionDetail {
  cover: string;
  name: string;
  canBeDeleted: boolean;
  musics: Music[];
}

export class RetAlbum {
  id: number;
  cover: string;
  name: string;
  musics: Music[];
}

export class RetAlbumDetail {
  id: number;
  cover: string;
  name: string;
  musics: Music[];
}

export class RetArtist {
  id: number;
  name: string;
  avatar: string;
  musicAlbums: MusicAlbum[];
}