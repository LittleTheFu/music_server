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
  fromName: string;
  toName: string;
  fromId: number;
  read: boolean;
  date: Date;
}