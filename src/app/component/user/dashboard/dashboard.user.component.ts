import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Guid } from '../../../model/guid';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryDialogComponent } from '../itinerary-dialog/itinerary-dialog.component'
import { MdDialog, MdDialogRef } from '@angular/material';
import { SearchPipe } from '../../../pipe/search.pipe'
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
	showSearch:boolean;
	search:string;

	constructor(public itineraryDialog: MdDialog, private userService: UserService, private itineraryService:ItineraryService, private router: Router) {
		this.currentUser = userService.getCurrentUser();
		this.itineraries = itineraryService.getUserItineraries(this.currentUser);
		this.showSearch = false;
	}

	openDialog() {
		this.dialogRef = this.itineraryDialog.open(ItineraryDialogComponent, { 
			disableClose: false,
		});
		this.dialogRef.componentInstance.newItinerary.userId = this.currentUser.id;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function(){
			that.itineraries = that.itineraryService.getUserItineraries(that.currentUser);
		});
	}

	editItinerary(id:Guid){
		this.dialogRef = this.itineraryDialog.open(ItineraryDialogComponent, {
			disableClose: false,
		});
		this.dialogRef.componentInstance.newItinerary = this.itineraryService.getItineraryById(this.currentUser, id.str);
		this.dialogRef.componentInstance.isUpdate = true;

		var that = this;
		return this.dialogRef.afterClosed().subscribe(function () {
			that.itineraries = that.itineraryService.getUserItineraries(that.currentUser);
		});
	}

	removeItinerary(id:Guid){
		if(confirm('Êtes-vous sur de vouloir supprimer cet itinéraire ?')){
			this.itineraryService.delete(id);
			this.itineraries = this.itineraryService.getUserItineraries(this.currentUser);
		}
	}

	toggleSearch(){
		this.showSearch = !this.showSearch;
	}

	goToItinerary(name:string, id:Guid){
		this.router.navigate(['compte/itinéraire/', id.str, encodeURI(name.toLocaleLowerCase().replace(' ', '-'))])
	}

	ngOnInit() {
	}
}
