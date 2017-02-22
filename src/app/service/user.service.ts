import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do'; 
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
	serviceUrl: string;

	constructor(private http: Http) {
		this.serviceUrl = environment.apiUrl;
	}

	isSignedin(): boolean {
		let c = JSON.parse(localStorage.getItem('current_user'));
		return c != "" && c != null;
	}

	getCurrentUser(): User {
		let c = localStorage.getItem('current_user');
		return JSON.parse(c);
	}

	setCurrentUser(user:User){
		localStorage.setItem('current_user', JSON.stringify(user));
	}

	signup(user: User): Observable<number> {
		return this.http
			.post('http://' + this.serviceUrl + '/users', {
				name: user.name,
				email: user.email,
				password: user.password
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	signin(emailOrPseudo: string, password: string): Observable<User> {
		return this.http
			.get('http://' + this.serviceUrl + '/users/' + emailOrPseudo + '/' + password)
			.map(this.extractData);
	}

	signout(user:User):UserService{
		localStorage.setItem('current_user', null);
		return this;
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.result;
	}
	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.message || JSON.stringify(body);
			errMsg = `${error.status} - ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}

		return Observable.throw(errMsg);
	}
}
