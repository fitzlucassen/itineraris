import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryDialogComponent } from '../itinerary-dialog/itinerary-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SearchPipe } from '../../../pipe/search.pipe';
import { Router, CanActivate } from '@angular/router';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './dashboard.user.component.html',
	styleUrls: ['./dashboard.user.component.css'],
	providers: [UserService, ItineraryService, MdDialog],
})
export class DashboardUserComponent implements OnInit {
	currentUser: User;
	itineraries: Array<Itinerary>;
	dialogRef: MdDialogRef<ItineraryDialogComponent>;
	showSearch: boolean;
	search: string;
	screenHeight: number;
	isLoading: boolean = false;

	constructor(public itineraryDialog: MdDialog, private userService: UserService, private itineraryService: ItineraryService, private router: Router) {
		this.currentUser = userService.getCurrentUser();
		this.showSearch = false;
		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

		itineraryService.getUserItineraries(this.currentUser).subscribe(
			result => this.assignItineraries(result),
			error => alert(error)
		);
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(ItineraryDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newItinerary.userId = this.currentUser.id;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itineraryService.getUserItineraries(that.currentUser).subscribe(
				result => that.assignItineraries(result),
				error => alert(error)
			);
		});
	}

	editItinerary(id: string) {
		this.dialogRef = this.itineraryDialog.open(ItineraryDialogComponent, {
			disableClose: false,
		});
		this.itineraryService.getItineraryById(id).subscribe(
			result => this.assignItinerary(result),
			error => alert(error)
		);

		this.dialogRef.componentInstance.isUpdate = true;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itineraryService.getUserItineraries(that.currentUser).subscribe(
				result => that.assignItineraries(result),
				error => alert(error)
			);
		});
	}

	removeItinerary(id: number) {
		if (confirm('Êtes-vous sur de vouloir supprimer cet itinéraire ?')) {
			this.isLoading = true;
			this.itineraryService.delete(id).subscribe(
				id => id != null ? this.successfullyRemoved() : function () { }
			);
		}
	}

	toggleSearch() {
		this.showSearch = !this.showSearch;
	}

	goToItinerary(name: string, id: number) {
		this.router.navigate(['compte/itinéraire/', id, encodeURI(name.toLocaleLowerCase().replace(' ', '-'))])
	}

	signout() {
		this.userService.signout(this.currentUser, function () { window.location.href = '/'; });
	}

	ngOnInit() {
	}
	
	private successfullyRemoved() {
		this.itineraryService.getUserItineraries(this.currentUser).subscribe(
			result => this.assignItineraries(result),
			error => alert(error)
		);
	}
	private assignItinerary(result:Itinerary){
		this.dialogRef.componentInstance.newItinerary = result;
	}
	private assignItineraries(result:Array<Itinerary>) {
		this.itineraries = result;
		this.isLoading = false;
	}
}
