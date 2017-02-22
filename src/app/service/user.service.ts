import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
	serviceUrl: string;

	constructor(private http: Http) {
		this.serviceUrl = environment.apiUrl;
	}

	isSignedin(): boolean {
		let c = localStorage.getItem('current_user');
		return c != "" && c != null;
	}

	getCurrentUser(): User {
		let c = localStorage.getItem('current_user');
		return JSON.parse(c);
	}

	signup(user: User): UserService {
		var items = JSON.parse(localStorage.getItem('users'));

		if (items != null && items.length > 0) {
			items.push(user);
			localStorage.setItem('users', JSON.stringify(items));
		}
		else {
			localStorage.setItem('users', JSON.stringify([user]));
		}
		return this;
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.result || {};
	}

	signin(emailOrPseudo: string, password: string): Observable<any> {
		return this.http
			.get('http://' + this.serviceUrl + '/users/' + emailOrPseudo + '/' + password)
			.map(this.extractData);
	}
}
