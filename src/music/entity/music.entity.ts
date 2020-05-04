import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class MusicAlbum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RawMusic, music => music.musicAlbum)
  musics: RawMusic[];
}



@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MusicAlbum, { cascade: true })
  @JoinTable()
  musicAlbums: MusicAlbum[];
}

@Entity()
export class RawMusic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => MusicAlbum)
  musicAlbum: MusicAlbum;

  @ManyToOne(() => Artist)
  musicArtist: Artist;

  @Column({default: 0})
  like: number;

  @OneToMany(() => Comment, comment => comment.music)
  comments: Comment[];

  @ManyToMany(() => User, user => user.likes)
  liker: User[];
}

export class Music {
  id: number;
  address: string;
  cover: string;
  name: string;
  artist: string;
  artistId: number;
  album: string;
  albumId: number;
  like: number;
  likedByCurrentUser: boolean;
  comments: Comment[];
  musicAlbum: MusicAlbum;
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

  @ManyToMany(() => RawMusic)
  @JoinTable()
  musics: RawMusic[];

  @ManyToOne(() => User, user => user.mixes, { onDelete: "CASCADE" })
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
  albums: RetAlbumDetail[];
}