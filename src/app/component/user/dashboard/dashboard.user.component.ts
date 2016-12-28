import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryDialogComponent } from '../itinerary-dialog/itinerary-dialog.component'
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './dashboard.user.component.html',
	styleUrls: ['./dashboard.user.component.css'],
	providers: [UserService, ItineraryService, MdDialog]
})
export class DashboardUserComponent implements OnInit {
	currentUser: User;
	itineraries: Array<Itinerary>;
	dialogRef: MdDialogRef<ItineraryDialogComponent>;
	showSearch:boolean;

	constructor(public itineraryDialog: MdDialog, private userService: UserService, private itineraryService:ItineraryService) {
		this.currentUser = userService.getCurrentUser();
		this.itineraries = itineraryService.getUserItineraries(this.currentUser);
		this.showSearch = false;

		console.log(this.itineraries);
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(ItineraryDialogComponent, { 
			disableClose: false,
		});
		this.dialogRef.componentInstance.newItinerary.userId = this.currentUser.id;

		return this.dialogRef.afterClosed();
	}

	toggleSearch(){
		this.showSearch = !this.showSearch;
	}

	ngOnInit() {
	}
}
