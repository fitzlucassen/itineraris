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

	constructor(private userService: UserService, private router: Router) { }

	ngOnInit() {
	}

	signup() {
		this.userService.signup(this.newUser);
    	this.newUser = new User();
		this.router.navigate(['/']);
		return false;
	}
}
