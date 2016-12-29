import { Component, OnInit } from '@angular/core';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { User } from '../../../model/user';
import { Guid } from '../../../model/guid';
import { Router, ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../service/itinerary.service';
import { UserService } from '../../../service/user.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { StepDialogComponent } from '../step-dialog/step-dialog.component'

@Component({
	selector: 'app-user-itinerary',
	templateUrl: './itinerary.user.component.html',
	styleUrls: ['./itinerary.user.component.css'],
	providers: [ItineraryService, UserService, MdDialog]
})
export class ItineraryUserComponent implements OnInit {
	currentItinerary: Itinerary;
	currentUser: User;
	dialogRef: MdDialogRef<StepDialogComponent>;
	itinerarySteps: Array<ItineraryStep>;
	showSearch:boolean;
	search:string;

	constructor(public itineraryDialog: MdDialog, public route: ActivatedRoute, private itineraryService: ItineraryService, private userService: UserService) {
		this.currentUser = userService.getCurrentUser();
		this.showSearch = false;
	}

	toggleSearch(){
		this.showSearch = !this.showSearch;
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newStep.itineraryId = this.currentItinerary.id;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itinerarySteps = that.itineraryService.getItinerarySteps(that.currentItinerary);
		});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let id = params['id'];
			let name = params['name'];
			this.currentItinerary = this.itineraryService.getItineraryById(this.currentUser, id);
			this.itinerarySteps = this.itineraryService.getItinerarySteps(this.currentItinerary);
		});
	}
}
