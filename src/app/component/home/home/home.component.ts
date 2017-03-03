import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	navigateToMembership() {
		this.router.navigate(['compte/connexion.html']);
		return false;
	}

	navigateToVisitor(){
		this.router.navigate(['titou/1/voyage-au-perou']);
		return false;
	}
}
