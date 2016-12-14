import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
	selector: 'app-membership-home',
	templateUrl: './home.membership.component.html',
	styleUrls: ['./home.membership.component.css'],
	providers: [UserService]
})
export class HomeMembershipComponent implements OnInit {
	newUser: User = new User();

	constructor(private userService: UserService, private router: Router) { }

	ngOnInit() {
	}

	signIn() {
		var ok = this.userService.signin(this.newUser.email, this.newUser.password);
		if (ok)
			alert('Ok');
		else
			alert('Ko');
	}

	goToSignup(){
		this.router.navigate(['signup']);
		return false;
	}
}
