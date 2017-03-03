import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { DirectionsMapDirectiveDirective } from '../../../directive/directions-map-directive.directive';

@Component({
	selector: 'app-user-map',
	templateUrl: './user-map.component.html',
	styleUrls: ['./user-map.component.css'],
	providers: [ItineraryService, UserService, DirectionsMapDirectiveDirective],
})
export class UserMapComponent implements OnInit {
	itinerary: Itinerary;
	steps: Array<ItineraryStep>;

	lat: number = 18.5284128;
	lng: number = 13.9502671;
	zoom: number = 3;

	@ViewChild(DirectionsMapDirectiveDirective) vc: DirectionsMapDirectiveDirective;

	origin = {
		longitude: 0,
		latitude: 0
	};
	destination = {
		longitude: 0,
		latitude: 0
	};

	constructor(
		public route: ActivatedRoute,
		private userService: UserService,
		private itineraryService: ItineraryService,
		private ngZone: NgZone,
		private _elementRef: ElementRef) { }

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
			this.vc.origin = {
				longitude: this.steps[0].lng,
				latitude: this.steps[0].lat,
			};
			this.vc.destination = {
				longitude: this.steps[this.steps.length - 1].lng,
				latitude: this.steps[this.steps.length - 1].lat,
			};
			var s = this.steps[this.steps.length - 1];
			this.lat = s.lat;
			this.lng = s.lng;
			this.zoom = 8;

			this.ngZone.run(() => {
				this.vc.updateDirections();
			});
		}
	}
}
