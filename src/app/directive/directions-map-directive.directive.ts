import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { Directive, Input, SimpleChanges } from '@angular/core';
declare var google: any;

@Directive({
	selector: 'sebm-google-map-directions',
	providers: [GoogleMapsAPIWrapper]
})
export class DirectionsMapDirectiveDirective {
	@Input() origin;
	@Input() destination;
	@Input() originPlaceId: any;
	@Input() destinationPlaceId: any;
	@Input() waypoints;
	@Input() directionsDisplay: any;

	constructor(private gmapsApi: GoogleMapsAPIWrapper) { }

	updateDirections() {
		var that = this;

		this.gmapsApi.getNativeMap().then(map => {
			var directionsService = new google.maps.DirectionsService;
			var me = this;

			var latLngA = new google.maps.LatLng({ lat: this.origin.latitude, lng: this.origin.longitude });
			var latLngB = new google.maps.LatLng({ lat: this.destination.latitude, lng: this.destination.longitude });

			this.directionsDisplay.setMap(map);
			this.directionsDisplay.setOptions({
				polylineOptions: {
					strokeWeight: 8,
					strokeOpacity: 0.7,
					strokeColor: '#00468c'
				}
			});
			this.directionsDisplay.setDirections({ routes: [] });
			directionsService.route({
				origin: { placeId: this.originPlaceId },
				destination: { placeId: this.destinationPlaceId },
				avoidHighways: true,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
				//travelMode: 'DRIVING'
			}, function (response: any, status: any) {
				if (status === 'OK') {
					me.directionsDisplay.setDirections(response);
					map.setZoom(30);
					//console.log(me.getcomputeDistance (latLngA, latLngB));
					var point = response.routes[0].legs[0];
					console.log('Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')');

				} else {
					console.log('Directions request failed due to ' + status);
				}
			});
		});
	}
}