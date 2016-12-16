import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
	selector: 'app-membership-signup',
	templateUrl: './signup.membership.component.html',
	styleUrls: ['./signup.membership.component.css'],
	providers: [UserService]
})
export class SignupMembershipComponent implements OnInit {
	newUser: User = new User();
	pseudoError: string = null;
	emailError: string = null;
	passwordError: string = null;

	constructor(private userService: UserService, private router: Router) { }

	ngOnInit() {
	}

	signup() {
		if (!this.checkSignup())
			return false;
		else {
			this.userService.signup(this.newUser);
			this.newUser = new User();
			this.router.navigate(['/']);
			return false;
		}
	}

	private checkSignup():boolean {
		if (this.newUser.pseudo == null || this.newUser.pseudo.length == 0)
			this.pseudoError = "Champs recquis";
		else
			this.pseudoError = null;
		if (this.newUser.email == null || this.newUser.email.length == 0)
			this.emailError = "Champs recquis";
		else
			this.emailError = null;
		if (this.newUser.password == null || this.newUser.password.length == 0)
			this.passwordError = "Champs recquis";
		else
			this.passwordError = null;

		if (this.pseudoError != null || this.emailError != null || this.passwordError != null)
			return false;
		else
			return true;
	}
}
