import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MdInputDirective } from '@angular/material';
import { Router, CanActivate } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryDialogComponent } from '../itinerary-dialog/itinerary-dialog.component';
import { SearchPipe } from '../../../pipe/search.pipe';

import { environment } from '../../../../environments/environment';

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
	mapUrl: string;

	@ViewChild(MdInputDirective) input: any;

	constructor(public itineraryDialog: MdDialog, private userService: UserService, private itineraryService: ItineraryService, private router: Router, private metaService: Meta, private titleService: Title) {
		this.titleService.setTitle('Itineraris - Dashboard');
		this.metaService.updateTag({ content: "Itineraris - Dashboard" }, "name='og:title'");
		this.metaService.updateTag({ content: "Votre tableau de bord, gérez vos itinéraires de voyages" }, "name='description'");
		this.metaService.updateTag({ content: "Votre tableau de bord, gérez vos itinéraires de voyages" }, "name='og:description'");

		this.currentUser = userService.getCurrentUser();
		this.mapUrl = 'world/' + this.currentUser.id + '/' + this.sanitize(this.currentUser.name);
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
		this.dialogRef.componentInstance.newItinerary.users.push(new User({ id: this.currentUser.id }));
		this.dialogRef.componentInstance.newItinerary.online = true;

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

		setTimeout(() => {
			this.input.focus();
		});
	}

	replaceAll(str: string, replace: string, value: string): string {
		return str.replace(new RegExp(replace, 'g'), value);
	}

	sanitize(str: string): string {
		if (!str || str.length == 0)
			return str;

		var tmp = this.replaceAll(str.toLocaleLowerCase(), ' ', '-');
		tmp = this.replaceAll(tmp, "/\?/", "-");
		tmp = this.replaceAll(tmp, "/\!/", "-");
		tmp = this.replaceAll(tmp, "/\:/", "-");
		tmp = this.replaceAll(tmp, "/\//", "-");
		tmp = this.replaceAll(tmp, "/\&/", "-");
		tmp = this.replaceAll(tmp, "/\%/", "-");
		tmp = this.replaceAll(tmp, "/\*/", "x");
		tmp = this.replaceAll(tmp, "/\@/", "-");
		tmp = this.replaceAll(tmp, "/\;/", "-");
		tmp = this.replaceAll(tmp, "/\,/", "-");
		tmp = this.replaceAll(tmp, "/\./", "-");
		tmp = this.replaceAll(tmp, "/\^/", "-");
		tmp = this.replaceAll(tmp, "/\$/", "-");
		tmp = this.replaceAll(tmp, "/\€/", "-");
		tmp = this.replaceAll(tmp, "/\#/", "-");
		tmp = this.replaceAll(tmp, "/\'/", "-");

		return encodeURIComponent(tmp);
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
	private assignItinerary(result: Itinerary) {
		this.dialogRef.componentInstance.newItinerary = result;
	}
	private assignItineraries(result: Array<Itinerary>) {
		this.itineraries = result;
		this.isLoading = false;
	}
}
