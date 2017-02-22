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
	showSearch: boolean;
	search: string;
	screenHeight: number;

	constructor(public itineraryDialog: MdDialog, public route: ActivatedRoute, private itineraryService: ItineraryService, private userService: UserService, private router: Router) {
		this.currentUser = userService.getCurrentUser();
		this.showSearch = false;
		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
	}

	toggleSearch() {
		this.showSearch = !this.showSearch;
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newStep.itineraryId = this.currentItinerary.id;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itinerarySteps = that.itineraryService.getItinerarySteps(that.currentItinerary.id);
		});
	}

	editStep(id: Guid) {
		this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newStep = this.itineraryService.getStepById(id);
		this.dialogRef.componentInstance.isUpdate = true;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itinerarySteps = that.itineraryService.getItinerarySteps(that.currentItinerary.id);
		});
	}

	removeStep(id: Guid) {
		if (confirm('Êtes-vous sur de vouloir supprimer cette étape ?')) {
			this.itineraryService.deleteStep(id);
			this.itinerarySteps = this.itineraryService.getItinerarySteps(this.currentItinerary.id);
		}
	}

	goToDashboard() {
		this.router.navigate(['compte/tableau-de-bord.html']);
	}

	signout(){
		this.userService.signout(this.currentUser, function(){window.location.href = '/';});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let id = params['id'];
			let name = params['name'];
			this.currentItinerary = this.itineraryService.getItineraryById(this.currentUser, id);
			this.itinerarySteps = this.itineraryService.getItinerarySteps(this.currentItinerary.id);
		});
	}
}
