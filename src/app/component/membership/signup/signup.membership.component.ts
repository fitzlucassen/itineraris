import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

@Component({
	selector: 'app-membership-signup',
	templateUrl: './signup.membership.component.html',
	styleUrls: ['./signup.membership.component.css'],
	providers: [UserService, MdSnackBar]
})
export class SignupMembershipComponent implements OnInit {
	newUser: User = new User();

	pseudo: FormControl;
	email: FormControl;
	password: FormControl;
	form: FormGroup;

	constructor(public snackBar: MdSnackBar, private fb: FormBuilder, private userService: UserService, private router: Router) {
		this.pseudo = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.email = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}')]);
		this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			pseudo: this.pseudo,
			email: this.email,
			password: this.password,
		});
	}

	ngOnInit() {
	}

	successfullySignedup() {
		this.snackBar.open('Félicitation votre compte a bien été créé', 'Ok');
	}

	signup($event) {
		if (this.form.dirty && this.form.valid) {
			this.userService.signup(this.newUser);

			this.successfullySignedup();

			var that = this;
			setTimeout(function(){
				that.newUser = new User();
				that.router.navigate(['compte/connexion.html']);
			}, 500);
		}
		return false;
	}
}
