import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable()
export class UserService {
  users: User[] = [];

  constructor() { }

  signup(user:User):UserService{
    this.users.push(user);

    return this;
  }

  signin(emailOrPseudo:string, password:string): boolean{
    return this.users.filter(u => u.password == password && (u.email == emailOrPseudo || u.pseudo == emailOrPseudo)).length > 0;
  }
}
