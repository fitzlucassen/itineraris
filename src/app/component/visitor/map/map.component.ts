import { Component, OnInit, Input } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { ItineraryStep } from '../../../model/itinerary-step';
import { Picture } from '../../../model/picture';
import { ItineraryService } from '../../../service/itinerary.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	@Input() origin = {
		latitude: 0,
		longitude: 0,
		object: new ItineraryStep()
	};
	@Input() destination = {
		latitude: 0,
		longitude: 0,
		object: new ItineraryStep()
	};
	@Input() waypoints: Array<ItineraryStep> = [];

	serviceUrl: string;
	map: google.maps.Map = null;
	infoWindows: Array<google.maps.InfoWindow> = [];
	markers: Array<google.maps.Marker> = [];

	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle">Le DATE</i><br/><br/>DESCRIPTION<br/><br/>PICTURES</div><div class="iw-bottom-gradient"></div></div>'

	constructor(private mapsAPILoader: MapsAPILoader, private itineraryService: ItineraryService) { }

	ngOnInit() {
		this.serviceUrl = environment.apiUrl;

		// Load the map at the last step of the itinerary
		this.updateDirections();
	}

	updateDirections() {
		var that = this;

		if (this.origin.object.id != null && this.origin.object.id > 0) {
			this.mapsAPILoader.load().then(() => {
				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;

				that.map = new google.maps.Map(document.getElementById('map'), {
					zoom: 7,
					center: { lat: that.origin.latitude, lng: that.origin.longitude }
				});
				directionsDisplay.setMap(that.map);
				directionsDisplay.setOptions({
					suppressMarkers: true,
				});
				that.calculateAndDisplayRoute(directionsService, directionsDisplay);
			});
		}
	}

	private calculateAndDisplayRoute(directionsService, directionsDisplay) {
		var waypts = [];
		var that = this;

		for (var i = 0; i < this.waypoints.length; i++) {
			waypts.push({
				location: that.waypoints[i],
				stopover: true
			});
		}

		var that = this;

		// Create a marker at the first step of the itinerary
		var photos = this.itineraryService.getStepPictures(this.origin.object.id).subscribe(
			result => that.createInfoWindowForStep(result, this.origin.object),
			error => alert(error)
		);
		// Create a marker at the last step of the itinerary if exists
		if (this.destination.object.id != null && this.destination.object.id > 0) {
			var photos = this.itineraryService.getStepPictures(this.destination.object.id).subscribe(
				result => that.createInfoWindowForStep(result, this.destination.object),
				error => alert(error)
			);

			// So if there are at least two steps we can trace a route
			directionsService.route({
				origin: { lat: this.origin.latitude, lng: this.origin.longitude },
				destination: { lat: this.destination.latitude, lng: this.destination.longitude },
				waypoints: waypts,
				travelMode: 'DRIVING',
			}, function (response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					var _route = response.routes[0];

					_route.legs.forEach(function (element, index) {
						if (waypts[index] != null) {
							that.itineraryService.getStepPictures(waypts[index].location.id).subscribe(
								result => that.createInfoWindowForStep(result, waypts[index].location),
								error => alert(error)
							);
						}
					});
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		}
	}

	private createInfoWindowForStep(pictures: Array<Picture>, origin: ItineraryStep) {
		var content = this.infoWindowTemplate
			.replace('TITLE', origin.city)
			.replace('DESCRIPTION', origin.description)
			.replace('DATE', origin.date.split('T')[0])
			.replace('PICTURES', '<ul>');

		var that = this;
		pictures.forEach(function (element) {
			content += '<li style="list-style:none;"><img src="http://' + that.serviceUrl + '/' + element.url + '" alt="' + element.caption + '" title="' + element.caption + '" width="150px"/></li>'
		});
		content += '</ul>';

		var marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city);

		this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
	}

	private createMarker(location: any, map: google.maps.Map, title: string) {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: '/assets/icon.png',
			clickable: true,
			title: title,
		});
		this.markers.push(marker);

		return marker;
	}
	private attachClickEvent(marker: google.maps.Marker, location: any, content: string) {
		var that = this;

		google.maps.event.addListener(marker, 'click', function (e) {
			var infoWindow = new google.maps.InfoWindow({
				content: content,
				position: location
			});
			that.infoWindows.push(infoWindow);

			that.infoWindows.forEach(function (element) { element.close(); });

			infoWindow.open(that.map, marker);
		});
	}
}
