import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
	title: string = 'My first angular2-google-maps project';
	lat: number = 18.5284128;
	lng: number = 13.9502671;
	zoom: number = 3;

	constructor() { }

	ngOnInit() {
	}

}
