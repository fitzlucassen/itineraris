import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
	selector: 'app-membership-home',
	templateUrl: './home.membership.component.html',
	styleUrls: ['./home.membership.component.css'],
	providers: [UserService]
})
export class HomeMembershipComponent implements OnChanges {
	newUser: User = new User();

	pseudo: FormControl;
	password: FormControl;
	form: FormGroup;

	@Input() toRedirect: boolean;

	constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
		this.pseudo = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			pseudo: this.pseudo,
			password: this.password,
		});
	}

	ngOnChanges(changes) {
		this.router.navigate(['compte/tableau-de-bord.html'])
	}

	signin() {
		if (this.form.dirty && this.form.valid) {
			this.userService
				.signin(this.newUser.email, this.newUser.password)
				.subscribe(
				result => result.length > 0
					? (this.toRedirect = true)
					: alert('Désolé mais aucun compte n\'existe avec les identifiants suivants')
				);
		}
	}

	goToSignup() {
		this.router.navigate(['compte/inscription.html']);
		return false;
	}
}
