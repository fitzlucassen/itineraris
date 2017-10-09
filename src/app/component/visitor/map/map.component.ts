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
	multiple: boolean = false;
	serviceUrl: string;
	map: any = null;
	infoWindows: Array<any> = [];
	markers: Array<any> = [];

	markersPng: Array<any> = [
		'/assets/icon.png',
		'/assets/icon1.png',
		'/assets/icon2.png',
		'/assets/icon3.png',
		'/assets/icon4.png'
	];

	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle">Le DATE</i><br/><br/>DESCRIPTION<br/><br/>PICTURES</div><div class="iw-bottom-gradient"></div></div>'
	infoWindowImgTemplate: string = '<li style="list-style:none;display: inline-block;margin-right: 5px;"><a href="URL1" data-lightbox="image" data-title="CAPTION1"><img class="ui bordered small image" src="URL2" alt="CAPTION2" title="CAPTION3" width="95px" height="95px"/></a></li>';

	constructor(private mapsAPILoader: MapsAPILoader, private itineraryService: ItineraryService) { }

	ngOnInit() {
		this.serviceUrl = environment.apiUrl;
	}

	updateDirections(origin, destination, waypoints, markerIndex = 0) {
		var that = this;

		if (origin.object.id != null && origin.object.id > 0) {
			this.mapsAPILoader.load().then(() => {
				// Init GMaps direction services
				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;

				// If no maps yet, we create it
				if (!that.map || that.map == null || that.map == {}) {
					that.map = new google.maps.Map(document.getElementById('map'), {
						zoom: 3,
						center: { lat: origin.latitude, lng: origin.longitude }
					});
				}

				// Assign direction service to the created map
				directionsDisplay.setMap(that.map);
				directionsDisplay.setOptions({
					suppressMarkers: true,
				});

				// Create a marker at the first step of the itinerary
				var photos = this.itineraryService.getStepPictures(origin.object.id).subscribe(
					result => that.createInfoWindowForStep(result, origin.object, markerIndex),
					error => alert(error)
				);
				// Create a marker at the last step of the itinerary if exists
				if (destination.object.id != null && destination.object.id > 0) {
					var photos = this.itineraryService.getStepPictures(destination.object.id).subscribe(
						result => that.createInfoWindowForStep(result, destination.object, markerIndex),
						error => alert(error)
					);
				}

				// If too much steps, batch by group of ten
				var batches = this.getBatches(waypoints);
				// to hold the counter and the results themselves as they come back, to, later, sort them
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
						that.calculateAndDisplayRoute(directionsService, directionsDisplay, request, waypoints, mode, batches.length, kk, unsortedResults, directionsResultsReturned, markerIndex);
					})(k, mode);
				}
			});
		}
	}

	drawItineraries(steps: Array<Array<ItineraryStep>>) {
		var that = this;

		steps.forEach(function (element: Array<ItineraryStep>) {
			if (element.length > 0) {
				var origin = {};
				var destination = {};

				origin = {
					latitude: element[0].lat,
					longitude: element[0].lng,
					object: element[0]
				};

				if (element.length > 1) {
					destination = {
						latitude: element[element.length - 1].lat,
						longitude: element[element.length - 1].lng,
						object: element[element.length - 1]
					};
				}
				var waypoints = element;

				setTimeout(function () {
					var iconMarkerIndex = Math.floor(Math.random() * 5);
					that.updateDirections(origin, destination, waypoints, iconMarkerIndex);
				}, 500);
			}
		});
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

			var marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city, true, null);

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

	private calculateAndDisplayRoute(directionsService, directionsDisplay, request, allWaypoints, mode, batchesLength, counter, unsortedResults, directionsResultsReturned, markerIndex) {
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
				result => that.createInfoWindowForStep(result, request.origin, markerIndex),
				error => alert(error)
			);
			that.itineraryService.getStepPictures(request.destination.id).subscribe(
				result => that.createInfoWindowForStep(result, request.destination, markerIndex),
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
					that.manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex);
				} else {
					if (status.indexOf('OVER_QUERY_LIMIT') >= 0) {
						setTimeout(function () {
							directionsService.route(request, function (response, status) {
								if (status === 'OK') {
									that.manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex);
								} else {
									console.log(status);
									window.alert('Aucune route n\'a été trouvé pour rejoindre certains points de l\'itinéraire. Il faut surement changer le moyen de transport de certaines étapes :)');
								}
							});
						}, 2001);
					}
					else {
						console.log(status);
						window.alert('Aucune route n\'a été trouvé pour rejoindre certains points de l\'itinéraire. Il faut surement changer le moyen de transport de certaines étapes :)');
					}
				}
			});
		}
	}

	private manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex) {
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

			var tmpWaypoints = allWaypoints.filter(w => w.type != 'FLIGHT');

			legs.forEach(function (element, index) {
				if (tmpWaypoints[index] != null) {
					that.itineraryService.getStepPictures(tmpWaypoints[index].id).subscribe(
						result => that.createInfoWindowForStep(result, tmpWaypoints[index], markerIndex),
						error => alert(error)
					);
				}
			});

			setTimeout(function(){
				that.map.setZoom(3);
				that.map.setCenter({lat: 22.6102934, lng: 7.5675984});
			}, 500);
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

	private createInfoWindowForStep(pictures: Array<Picture>, origin: ItineraryStep, markerIndex) {
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

		var marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city, false, markerIndex);

		this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
	}

	private createMarker(location: any, map: any, title: string, isStop: boolean = false, markerIndex) {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: isStop ? '/assets/icon-stop.png' : '/assets/icon' + markerIndex + '.png',
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
