import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable()
export class UserService {
	constructor() { }

	isSignedin(): boolean{
		let c = localStorage.getItem('current_user');
		console.log(c);
		return c != "" && c != null; 
	}

	signup(user: User): UserService {
		var items = JSON.parse(localStorage.getItem('users'));
		
		if(items != null && items.length > 0){
			items.push(user);
			localStorage.setItem('users', JSON.stringify(items));
		}
		else {
			localStorage.setItem('users', JSON.stringify([user]));
		}
		return this;
	}

	signin(emailOrPseudo: string, password: string): boolean {
		var items = JSON.parse(localStorage.getItem('users'));

		if (items != null && items.filter(u => u.password == password && (u.email == emailOrPseudo || u.pseudo == emailOrPseudo)).length > 0) {
			var user:User = items.filter(u => u.password == password && (u.email == emailOrPseudo || u.pseudo == emailOrPseudo))[0];

			localStorage.setItem('current_user', JSON.stringify(user)); 
			return true;
		}
		return false;
	}
}
