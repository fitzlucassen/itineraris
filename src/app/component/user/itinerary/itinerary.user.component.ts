import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Meta } from '@angular/platform-browser';

import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { User } from '../../../model/user';
import { ItineraryService } from '../../../service/itinerary.service';
import { UserService } from '../../../service/user.service';
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
	mapUrl: string;

	constructor(public itineraryDialog: MdDialog, public route: ActivatedRoute, private itineraryService: ItineraryService, private userService: UserService, private router: Router, private metaService: Meta) { 
		this.metaService.updateTag({content: "Itineraris - Gérer l\'itinéraire"}, "name='title'");
		this.metaService.updateTag({content: "Itineraris - Gérer l\'itinéraire"}, "name='og:title'");
		this.metaService.updateTag({content: "Gérer votre itinéraire en ajoutant une ou plusieurs étapes"}, "name='description'");
		this.metaService.updateTag({content: "Gérer votre itinéraire en ajoutant une ou plusieurs étapes"}, "name='og:description'");

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
			that.itineraryService.getItinerarySteps(that.currentItinerary.id).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);
		});
	}

	editStep(id: string) {
		this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
			disableClose: false,
		});
		this.itineraryService.getStepById(id).subscribe(
			result => result != null ? this.assignItineraryStep(result) : function(){},
			error => alert(error)
		);
		this.dialogRef.componentInstance.isUpdate = true;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itineraryService.getItinerarySteps(that.currentItinerary.id).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);
		});
	}

	removeStep(id: number) {
		if (confirm('Êtes-vous sur de vouloir supprimer cette étape ?')) {
			this.itineraryService.deleteStep(id).subscribe(
				id => id != null ? this.successfullyRemoved() : function () { }
			);
		}
	}

	replaceAll(str:string, replace:string, value:string):string{
		return str.replace(new RegExp(replace, 'g'), value);
	}

	signout(){
		this.userService.signout(this.currentUser, function(){window.location.href = '/';});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let id = params['id'];
			let name = params['name'];

			this.currentItinerary = new Itinerary();

			var that = this;
			this.itineraryService.getItinerarySteps(id).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);

			this.itineraryService.getItineraryById(id).subscribe(
				result => that.assignItinerary(result),
				error => alert(error)
			);
		});
	}

	private successfullyRemoved(){
		var that = this;
		this.itineraryService.getItinerarySteps(this.currentItinerary.id).subscribe(
			result => that.assignItinerarySteps(result),
			error => alert(error)
		);
	}
	private assignItinerary(result:Itinerary){
		this.currentItinerary = result;

		this.mapUrl = 
			encodeURI(this.replaceAll(this.currentUser.name.toLocaleLowerCase(), ' ', '-')) + '/' + 
			this.currentItinerary.id + '/' + 
			encodeURI(this.replaceAll(this.currentItinerary.name.toLocaleLowerCase(), ' ', '-'));
	}
	private assignItinerarySteps(result:Array<ItineraryStep>){
		this.itinerarySteps = result;
	}
	private assignItineraryStep(step:ItineraryStep){
		var d = step.date.split('T')[0].split('-');

		step.date = d[0] + '-' + d[1] + '-' + d[2];

		this.dialogRef.componentInstance.newStep = step;
	}
}
