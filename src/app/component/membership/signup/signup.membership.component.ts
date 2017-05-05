import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
	selector: 'app-membership-signup',
	templateUrl: './signup.membership.component.html',
	styleUrls: ['./signup.membership.component.css'],
	providers: [UserService, MdSnackBar]
})
export class SignupMembershipComponent implements OnInit {
	newUser: User = new User();
	isLoading: boolean = false;

	name: FormControl;
	email: FormControl;
	password: FormControl;
	form: FormGroup;

	constructor(public snackBar: MdSnackBar, private fb: FormBuilder, private userService: UserService, private router: Router, private metaService: Meta) { 
		this.metaService.updateTag({content: "Itineraris - Inscription"}, "name='title'");
		this.metaService.updateTag({content: "Itineraris - Inscription"}, "name='og:title'");
		this.metaService.updateTag({content: "Inscrivez-vous afin de créer vos itinéraires de voyages"}, "name='description'");
		this.metaService.updateTag({content: "Inscrivez-vous afin de créer vos itinéraires de voyages"}, "name='og:description'");

		this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.email = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}')]);
		this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			name: this.name,
			email: this.email,
			password: this.password,
		});
	}

	ngOnInit() {
	}

	signup($event) {
		if (this.form.dirty && this.form.valid) {
			this.isLoading = true;
			this.userService
				.signup(this.newUser)
				.subscribe(
					id => id != null ? this.successfullySignedup() : function(){},
					error => alert(error)	
				);
		}
		return false;
	}

	private successfullySignedup() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre compte a bien été créé', 'Ok', {
			duration: 3000
		});
		this.router.navigate(['compte/connexion.html']);
	}
}
