import { Component, OnInit, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { ItineraryStep } from '../../../model/itinerary-step';
import { Picture } from '../../../model/picture';
import { Stop } from '../../../model/stop';
import { ItineraryService } from '../../../service/itinerary.service';
import { environment } from '../../../../environments/environment';

declare var google: any;

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
	map: any = null;
	infoWindows: Array<any> = [];
	markers: Array<any> = [];

	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle">Le DATE</i><br/><br/>DESCRIPTION<br/><br/>PICTURES</div><div class="iw-bottom-gradient"></div></div>'
	infoWindowImgTemplate: string = '<li style="list-style:none;display: inline-block;margin-right: 5px;"><a href="http://URL1" data-lightbox="image" data-title="CAPTION1"><img class="ui bordered small image" src="http://URL2" alt="CAPTION2" title="CAPTION3" width="95px" height="95px"/></a></li>';

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
				}

				// If too much steps, batch by group of ten
				var batches = this.getBatches(this.waypoints);
				// to hold the counter and the results themselves as they come back, to later sort
				var unsortedResults = [{}];
				var directionsResultsReturned = { number: 0 };

				// Trace route for each batch of steps
				for (var k = 0; k < batches.length; k++) {
					var mode = batches[k][0].mode;

					var lastIndex = batches[k].length - 1;
					var start = batches[k][0].location;
					var end = batches[k][lastIndex].location;

					// trim first and last entry from array
					var waypts = [];
					waypts = batches[k];
					waypts.splice(0, 1);
					waypts.splice(waypts.length - 1, 1);

					// create the request in google maps format
					var request = {
						origin: start,
						destination: end,
						waypoints: waypts,
						travelMode: end.type
					};

					// Execute the calculation with a counter to sort later
					(function (kk, mode) {
						that.calculateAndDisplayRoute(directionsService, directionsDisplay, request, mode, batches.length, kk, unsortedResults, directionsResultsReturned);
					})(k, mode);
				}
			});
		}
	}

	createInfoWindowForStop(pictures: Array<Picture>, origin: Stop) {
		this.mapsAPILoader.load().then(() => {
			var content = this.infoWindowTemplate
				.replace('TITLE', origin.city)
				.replace('DESCRIPTION', origin.description)
				.replace('DATE', origin.date.split('T')[0]);

			var that = this;
			var picturesHtml = '<ul style="padding: 0;">';
			pictures.forEach(function (element) {
				picturesHtml += that.infoWindowImgTemplate
					.replace('URL1', that.serviceUrl + '/' + element.url)
					.replace('URL2', that.serviceUrl + '/' + element.url)
					.replace('CAPTION1', element.caption)
					.replace('CAPTION3', element.caption)
					.replace('CAPTION2', element.caption);
			});
			picturesHtml += '</ul>';
			content = content.replace('PICTURES', picturesHtml);

			var marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city, true);

			this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
		});
	}

	private getBatches(stops: Array<ItineraryStep>): Array<any> {
		var batches = [];
		var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
		var itemsCounter = 0;
		var wayptsExist = stops.length > 0;

		while (wayptsExist) {
			var subBatch = [];
			var flightBatch = [];
			var subitemsCounter = 0;

			for (var j = itemsCounter; j < stops.length; j++) {
				if (stops[j].type == 'FLIGHT') {
					flightBatch.push({
						location: stops[j - 1],
						stopover: true,
						mode: "flight"
					});
					flightBatch.push({
						location: stops[j],
						stopover: true,
						mode: "flight"
					});
				}

				subitemsCounter++;

				if (stops[j].type != 'FLIGHT') {
					if (j > 0 && stops[j - 1].type == 'FLIGHT') {
						subBatch.push({
							location: stops[j - 1],
							stopover: true,
							mode: "normal"
						});
					}
					subBatch.push({
						location: stops[j],
						stopover: true,
						mode: "normal"
					});
				}
				if (subitemsCounter == itemsPerBatch || flightBatch.length > 0)
					break;
			}

			itemsCounter += subitemsCounter;

			if (subBatch.length > 0)
				batches.push(subBatch);

			wayptsExist = itemsCounter < stops.length;
			if (flightBatch.length > 0) {
				batches.push(flightBatch);
			}
			else {
				// If it runs again there are still points. Minus 1 before continuing to
				// start up with end of previous tour leg
				itemsCounter--;
			}
		}

		return batches;
	}

	private calculateAndDisplayRoute(directionsService, directionsDisplay, request, mode, batchesLength, counter, unsortedResults, directionsResultsReturned) {
		var that = this;
		var waypts = request.waypoints;

		if (mode == 'flight') {
			var line = new google.maps.Polyline({
				strokeColor: '#3f51b5',
				strokeOpacity: 1.0,
				strokeWeight: 3,
				geodesic: true,
				map: that.map
			});

			var path = [request.origin, request.destination];
			line.setPath(path);

			that.itineraryService.getStepPictures(request.origin.id).subscribe(
				result => that.createInfoWindowForStep(result, request.origin),
				error => alert(error)
			);
			that.itineraryService.getStepPictures(request.destination.id).subscribe(
				result => that.createInfoWindowForStep(result, request.destination),
				error => alert(error)
			);
			directionsResultsReturned.number++;
		}
		else {
			request.waypoints.forEach(function (element) {
				delete element.mode;
			});

			directionsService.route(request, function (response, status) {
				if (status === 'OK') {
					// Push the result with the order number
					unsortedResults.push({ order: counter, result: response });
					directionsResultsReturned.number++;

					// If it's the last result, trace routes
					if (directionsResultsReturned.number == batchesLength) {
						// sort the array
						unsortedResults.sort(function (a, b) { return parseFloat(a.order) - parseFloat(b.order); });

						// browse it to trace routes
						var count = 0;
						var combinedResult;

						for (var key in unsortedResults) {
							if (unsortedResults[key].result !== null) {
								if (unsortedResults.hasOwnProperty(key)) {
									combinedResult = that.getGoogleMapsRoute(combinedResult, key, unsortedResults, count);
									count++;
								}
							}
						}

						directionsDisplay.setDirections(combinedResult);
						var legs = combinedResult.routes[0].legs;

						var tmpWaypoints = that.waypoints.filter(w => w.type != 'FLIGHT');

						legs.forEach(function (element, index) {
							if (tmpWaypoints[index] != null) {
								that.itineraryService.getStepPictures(tmpWaypoints[index].id).subscribe(
									result => that.createInfoWindowForStep(result, tmpWaypoints[index]),
									error => alert(error)
								);
							}
						});
					}
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		}
	}

	private getGoogleMapsRoute(combinedResults, key, unsortedResults, count) {
		if (count === 0) {// first results. new up the combinedResults object
			if (unsortedResults[key].result)
				combinedResults = unsortedResults[key].result;
			else
				combinedResults = unsortedResults[1 + (key * 1)].result;
		}
		else {
			// only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
			// directionResults object, but enough to draw a path on the map, which is all I need
			combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
			combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

			combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
			combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
		}
		return combinedResults;
	}

	private createInfoWindowForStep(pictures: Array<Picture>, origin: ItineraryStep) {
		var content = this.infoWindowTemplate
			.replace('TITLE', origin.city)
			.replace('DESCRIPTION', origin.description)
			.replace('DATE', origin.date.split('T')[0]);

		var that = this;
		var picturesHtml = '<ul style="padding: 0;">';
		pictures.forEach(function (element) {
			picturesHtml += that.infoWindowImgTemplate
				.replace('URL1', that.serviceUrl + '/' + element.url)
				.replace('URL2', that.serviceUrl + '/' + element.url)
				.replace('CAPTION1', element.caption)
				.replace('CAPTION3', element.caption)
				.replace('CAPTION2', element.caption);
		});
		picturesHtml += '</ul>';
		content = content.replace('PICTURES', picturesHtml);

		var marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city);

		this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
	}

	private createMarker(location: any, map: any, title: string, isStop: boolean = false) {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: isStop ? '/assets/icon-stop.png' : '/assets/icon.png',
			clickable: true,
			title: title,
		});
		this.markers.push(marker);

		return marker;
	}
	private attachClickEvent(marker: any, location: any, content: string) {
		var that = this;

		google.maps.event.addListener(marker, 'click', function (e) {
			var infoWindow = new google.maps.InfoWindow({
				content: content,
				position: location
			});
			that.infoWindows.push(infoWindow);

			that.infoWindows.forEach(function (element) { element.close(); });

			infoWindow.open(that.map, marker);

			var preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
			var nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;

			preElement.children[1].style.display = 'none';
			preElement.children[3].style.display = 'none';
			nextElement.className = 'iw-close';
		});
	}
}
