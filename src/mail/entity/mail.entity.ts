import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/user.entity';


@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, user => user.sendMails)
  from: User;

  @ManyToOne(() => User, user => user.receiveMails)
  to: User;

  @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
  date: Date;
}

export class RetMail {
  id: number;
  content: string;
  fromId: number;
  fromName: string;
  fromAvatar: string;
  toName: string;
  read: boolean;
  date: Date;
}