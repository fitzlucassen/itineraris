import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UserService } from "app/service/user.service";
import { User } from "app/model/user";
import { Itinerary } from "app/model/itinerary";

@Component({
	selector: 'app-itinerary-user-dialog',
	templateUrl: './itinerary-user-dialog.component.html',
	styleUrls: ['./itinerary-user-dialog.component.css']
})
export class ItineraryUserDialogComponent implements OnInit {
	usedUsers: Array<User>;
	currentItinerary: Itinerary;

	users: Array<User> = new Array<User>();
	searchText: string = '';
	form: FormGroup;
	search: FormControl;
	screenHeight: number;
	
	constructor(private fb: FormBuilder, private userService: UserService) {
		this.form = this.fb.group({
			search: this.search,
		});

		this.userService.getAll("").subscribe(
			result => {
				this.users = result;
			},
			error => alert(error)
		);

		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
	}

	ngOnInit() {
	}

	anonymizeStart(email: string): string {
		return email[0] + email[1];
	}

	anonymizeMiddle(email: string): string {
		var str = '';

		for (var index = 0; index < email.length; index++) {
			if (index <= 1)
				str += '';
			else if (index >= email.length - 8) {
				str += '';
			}
			else {
				str += "x";
			}
		}

		return str;
	}

	anonymizeEnd(email: string): string {
		var str = '';

		for (var index = 0; index < email.length; index++) {
			if (index <= 1)
				str += '';
			else if (index >= email.length - 8) {
				str += email[index];
			}
			else {
				str += '';
			}
		}

		return str;
	}

	userAlreadyExists(userId: number): boolean {
		return this.usedUsers.find(u => u.id == userId) == null;
	}

	addUserInItinerary(userId: number) {
		this.userService.addInItinerary(userId, this.currentItinerary.id).subscribe(
			result => {
				this.usedUsers.push(new User({
					id: userId
				}));
			},
			error => alert(error)
		);
	}
}
