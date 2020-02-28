import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'a',
        password: 'a',
      },
      {
        userId: 2,
        username: 'b',
        password: 'b',
      },
      {
        userId: 3,
        username: 'c',
        password: 'c',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    console.log(username + ' searching...');
    return this.users.find(user => user.username === username);
  }
}