import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/user.entity';


@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(type => User, user=>user.sendMails)
  from: User;

  @ManyToOne(type => User, user=>user.receiveMails)
  to: User;
}
 
export class RetMail {
    id: number;

    content: string;

    fromName: string;

    toName: string;

    fromId: number;
}