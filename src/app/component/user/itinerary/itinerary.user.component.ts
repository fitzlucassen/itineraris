import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdInputDirective } from '@angular/material';
import { Meta, Title } from '@angular/platform-browser';

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

	source: any;

	@ViewChild(MdInputDirective) input:any;

	constructor(public itineraryDialog: MdDialog, public route: ActivatedRoute, private itineraryService: ItineraryService, private userService: UserService, private router: Router, private metaService: Meta, private titleService: Title) {
		this.titleService.setTitle('Itineraris -  Gérer l\'itinéraire');
		this.metaService.updateTag({ content: "Itineraris - Gérer l\'itinéraire" }, "name='og:title'");
		this.metaService.updateTag({ content: "Gérer votre itinéraire en ajoutant une ou plusieurs étapes" }, "name='description'");
		this.metaService.updateTag({ content: "Gérer votre itinéraire en ajoutant une ou plusieurs étapes" }, "name='og:description'");

		this.currentUser = userService.getCurrentUser();
		this.showSearch = false;
		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
	}

	toggleSearch() {
		this.showSearch = !this.showSearch;

		setTimeout(() => {
			this.input.focus();
		});
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newStep.itineraryId = this.currentItinerary.id;

		if (this.itinerarySteps.length == 0)
			this.dialogRef.componentInstance.type.disable();

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
			result => result != null ? this.assignItineraryStep(result) : function () { },
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

	replaceAll(str: string, replace: string, value: string): string {
		return str.replace(new RegExp(replace, 'g'), value);
	}

	signout() {
		this.userService.signout(this.currentUser, function () { window.location.href = '/'; });
	}

	/* Drag n drop */
	isbefore(a, b) {
		if (a.parentNode == b.parentNode) {
			for (var cur = a; cur; cur = cur.previousSibling) {
				if (cur === b) {
					return true;
				}
			}
		}
		return false;
	}
    /**
     * LIST ITEM DRAP ENTERED
     */
	dragenter($event) {
		let target = $event.currentTarget;
		if (this.isbefore(this.source, target)) {
			target.parentNode.insertBefore(this.source, target); // insert before

		}
		else {
			target.parentNode.insertBefore(this.source, target.nextSibling); //insert after
		}
	}


    /**
     * LIST ITEM DRAG STARTED
     */
	dragstart($event) {
		this.source = $event.currentTarget;
		$event.dataTransfer.effectAllowed = 'move';
	}

	drop($event: any, step: ItineraryStep) {
		$event.preventDefault();

		var list = $event.path[1].children;
		var that = this;

		var cpt = 0;
		for (var i in list) {
			if (list.hasOwnProperty(i)) {
				var id = list[i].id;
				var stepId = id.split('-')[1];
				that.itinerarySteps.find(s => s.id == stepId).position = cpt++;
				that.itinerarySteps.find(s => s.id == stepId).date = that.itinerarySteps.find(s => s.id == stepId).date.split('T')[0];
			}
		}

		that.itineraryService.updateSteps(that.itinerarySteps).subscribe(
			data => { },
			error => { alert(error); }
		);
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

	private successfullyRemoved() {
		var that = this;
		this.itineraryService.getItinerarySteps(this.currentItinerary.id).subscribe(
			result => that.assignItinerarySteps(result),
			error => alert(error)
		);
	}
	private assignItinerary(result: Itinerary) {
		this.currentItinerary = result;

		this.mapUrl =
			encodeURI(this.replaceAll(this.currentUser.name.toLocaleLowerCase(), ' ', '-')) + '/' +
			this.currentItinerary.id + '/' +
			encodeURI(this.replaceAll(this.currentItinerary.name.toLocaleLowerCase(), ' ', '-'));
	}
	private assignItinerarySteps(result: Array<ItineraryStep>) {
		this.itinerarySteps = result;
	}
	private assignItineraryStep(step: ItineraryStep) {
		var d = step.date.split('T')[0].split('-');

		step.date = d[0] + '-' + d[1] + '-' + d[2];

		this.dialogRef.componentInstance.newStep = step;
	}
}
