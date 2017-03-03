import { Component, OnInit, Input } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	@Input() origin = {
		latitude: 0,
		longitude: 0
	};
	@Input() destination = {
		latitude: 0,
		longitude: 0
	};
	waypoints: Array<any> = [];
	map: any = null;

	constructor(private mapsAPILoader: MapsAPILoader) { }

	ngOnInit() {
		var that = this;

		this.mapsAPILoader.load().then(() => {
			var directionsService = new google.maps.DirectionsService;
			var directionsDisplay = new google.maps.DirectionsRenderer;

			that.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 7,
				center: { lat: that.destination.latitude, lng: that.destination.longitude }
			});
			directionsDisplay.setMap(that.map);
			that.calculateAndDisplayRoute(directionsService, directionsDisplay);
		});
	}

	updateDirections() {
		var that = this;

		this.mapsAPILoader.load().then(() => {
			var directionsService = new google.maps.DirectionsService;
			var directionsDisplay = new google.maps.DirectionsRenderer;

			that.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 7,
				center: { lat: that.destination.latitude, lng: that.destination.longitude }
			});
			directionsDisplay.setMap(that.map);
			directionsDisplay.setOptions({
				suppressMarkers: true,
			});
			that.calculateAndDisplayRoute(directionsService, directionsDisplay);
		});
	}

	private calculateAndDisplayRoute(directionsService, directionsDisplay) {
		var waypts = [];
		var checkboxArray: any[] = this.waypoints;

		for (var i = 0; i < checkboxArray.length; i++) {
			waypts.push({
				location: checkboxArray[i],
				stopover: true
			});
		}

		var that = this;

		directionsService.route({
			origin: { lat: this.origin.latitude, lng: this.origin.longitude },
			destination: { lat: this.destination.latitude, lng: this.destination.longitude },
			waypoints: waypts,
			travelMode: 'DRIVING',
			// icon: '/assets/icon.png'
		}, function (response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
				var _route = response.routes[0];

				_route.legs.forEach(function (element) {
					var pinA = new google.maps.Marker({
						position: element.start_location,
						map: that.map,
						icon: 'http://localhost:4200/assets/icon.png'
					});
					var pinB = new google.maps.Marker({
						position: element.end_location,
						map: that.map,
						icon: 'http://localhost:4200/assets/icon.png'
					});
				});
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
}
