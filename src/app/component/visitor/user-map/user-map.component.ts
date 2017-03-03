import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { MapComponent } from '../map/map.component';

@Component({
	selector: 'app-user-map',
	templateUrl: './user-map.component.html',
	styleUrls: ['./user-map.component.css'],
	providers: [ItineraryService, UserService, MapComponent],
})
export class UserMapComponent implements OnInit {
	itinerary: Itinerary;
	steps: Array<ItineraryStep>;

	lat: number = 18.5284128;
	lng: number = 13.9502671;
	zoom: number = 3;

	@ViewChild(MapComponent)
	public map: MapComponent;

	constructor(
		public route: ActivatedRoute,
		private userService: UserService,
		private itineraryService: ItineraryService) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let itineraryId = params['id'];
			let itineraryName = params['name'];
			let userName = params['username'];

			var that = this;
			this.itineraryService.getItinerarySteps(itineraryId).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);

			this.itineraryService.getItineraryById(itineraryId).subscribe(
				result => that.assignItinerary(result),
				error => alert(error)
			);
		});
	}

	private assignItinerary(result: Itinerary) {
		this.itinerary = result;
	}
	private assignItinerarySteps(result: Array<ItineraryStep>) {
		this.steps = result;

		if (this.steps.length > 0) {
			this.map.origin = {
				latitude: this.steps[0].lat,
				longitude: this.steps[0].lng,
				object: this.steps[0]
			};
		}
		if (this.steps.length > 1) {
			this.map.destination = {
				latitude: this.steps[this.steps.length - 1].lat,
				longitude: this.steps[this.steps.length - 1].lng,
				object: this.steps[this.steps.length - 1]
			};
		}
		if (this.steps.length > 2) {
			var waypoints = this.steps;
			waypoints = waypoints.slice(1, waypoints.length - 1);
			this.map.waypoints = waypoints;
		}
		this.map.updateDirections();
	}
}
