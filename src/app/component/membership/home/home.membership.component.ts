import { Component, OnInit, Input, OnChanges, NgZone } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
    selector: 'app-membership-home',
    templateUrl: './home.membership.component.html',
    styleUrls: ['./home.membership.component.scss'],
    providers: [UserService]
})
export class HomeMembershipComponent implements OnInit {
    newUser: User = new User();

    pseudo: FormControl;
    password: FormControl;
    form: FormGroup;

    screenHeight: number;

    constructor(private ngZone: NgZone, private fb: FormBuilder, private userService: UserService, private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Itineraris - Connexion');
        this.metaService.updateTag({ content: 'Itineraris - Connexion' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Connectez-vous à votre compte et créez vos itinéraires de voyages' }, 'name="description"');
        this.metaService.updateTag({ content: 'Connectez-vous à votre compte et créez vos itinéraires de voyages' }, 'property="og:description"');

        this.pseudo = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

        this.form = this.fb.group({
            pseudo: this.pseudo,
            password: this.password,
        });

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
        window.onresize = (e) => {
            // ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
            });
        };
    }

    ngOnInit() {
    }

    signin() {
        if (this.form.dirty && this.form.valid) {
            this.userService
                .signin(this.newUser.email, this.newUser.password)
                .subscribe(
                    result => result != null
                        ? this.successfullySignedIn(result)
                        : alert('Désolé mais aucun compte n\'existe avec les identifiants suivants'),
                    error => alert(error)
                );
        }
    }

    successfullySignedIn(user: User) {
        this.userService.setCurrentUser(user);
        this.router.navigate(['compte/tableau-de-bord.html']);
        return false;
    }

    goToSignup() {
        this.router.navigate(['compte/inscription.html']);
        return false;
    }
}
