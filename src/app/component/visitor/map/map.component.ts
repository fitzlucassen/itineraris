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
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
	multiple: boolean = false;
	serviceUrl: string;
	map: any = null;
	infoWindows: Array<any> = [];
	markers: Array<any> = [];

	flightLineColor: '#8C3432';
	roadLineColor: '#FF5E5B';
	waterColor: '#1F5180';
	landColor: '#D8D8D8';
	parkColor: '#A4B494';

	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle">Le DATE</i><br/><br/>DESCRIPTION<br/><br/>PICTURES</div><div class="iw-bottom-gradient"></div></div>'
	infoWindowImgTemplate: string = '<li style="list-style:none;display: inline-block;margin-right: 5px;"><a href="URL1" data-lightbox="image" data-title="CAPTION1"><img class="ui bordered small image" src="URL2" alt="CAPTION2" title="CAPTION3" width="95px" height="95px"/></a></li>';

	constructor(private mapsAPILoader: MapsAPILoader, private itineraryService: ItineraryService) { }

	ngOnInit() {
		this.serviceUrl = environment.apiUrl;
	}

	updateDirections(origin, destination, waypoints, markerIndex = 0) {
		let that = this;

		if (origin.object.id != null && origin.object.id > 0) {
			this.mapsAPILoader.load().then(() => {
				// Init GMaps direction services
				let directionsService = new google.maps.DirectionsService;
				let directionsDisplay = new google.maps.DirectionsRenderer({
					polylineOptions: {
						strokeColor: this.roadLineColor
					}
				});

				// If no maps yet, we create it
				if (!that.map || that.map == null || that.map == {}) {
					that.map = new google.maps.Map(document.getElementById('map'), {
						zoom: 3,
						center: { lat: origin.latitude, lng: origin.longitude },
						styles: [
							{ 'featureType': 'road', 								'stylers': [{ 'visibility': 'off' }] },
							{ 'featureType': 'water', 								'stylers': [{ 'color': this.waterColor }] },
							{ 'featureType': 'transit', 							'stylers': [{ 'visibility': 'off' }] },
							{ 'featureType': 'landscape.natural', 					'stylers': [{ 'visibility': 'on' }, { 'color': this.landColor }]},
							{ 'featureType': 'administrative.province', 			'stylers': [{ 'visibility': 'off' }] },
							{ 'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{ 'color': this.parkColor }] },
							{ 'featureType': 'administrative.country', 'elementType': 'geometry.stroke', 'stylers': [{ 'visibility': 'on' }, { 'color': '#7f7d7a' }, { 'lightness': 10 }, { 'weight': 1 }] }
						]
					});
				}

				// Assign direction service to the created map
				directionsDisplay.setMap(that.map);
				directionsDisplay.setOptions({
					suppressMarkers: true,
				});

				// Create a marker at the first step of the itinerary
				let photos = this.itineraryService.getStepPictures(origin.object.id).subscribe(
					result => that.createInfoWindowForStep(result, origin.object, markerIndex),
					error => alert(error)
				);
				// Create a marker at the last step of the itinerary if exists
				if (destination.object.id != null && destination.object.id > 0) {
					this.itineraryService.getStepPictures(destination.object.id).subscribe(
						result => that.createInfoWindowForStep(result, destination.object, markerIndex),
						error => alert(error)
					);
				}

				// If too much steps, batch by group of ten
				let batches = this.getBatches(waypoints);
				// to hold the counter and the results themselves as they come back, to, later, sort them
				let unsortedResults = [{}];
				let directionsResultsReturned = { number: 0 };

				// Trace route for each batch of steps
				for (let k = 0; k < batches.length; k++) {
					let mode = batches[k][0].mode;

					let lastIndex = batches[k].length - 1;
					let start = batches[k][0].location;
					let end = batches[k][lastIndex].location;

					// trim first and last entry from array
					let waypts = [];
					waypts = batches[k];
					waypts.splice(0, 1);
					waypts.splice(waypts.length - 1, 1);

					// create the request in google maps format
					let request = {
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
		let that = this;
		this.multiple = true;

		steps.forEach(function (element: Array<ItineraryStep>) {
			if (element.length > 0) {
				let origin = {};
				let destination = {};

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
				let waypoints = element;

				setTimeout(function () {
					let iconMarkerIndex = Math.floor(Math.random() * 5);
					that.updateDirections(origin, destination, waypoints, iconMarkerIndex);
				}, 500);
			}
		});
	}

	createInfoWindowForStop(pictures: Array<Picture>, origin: Stop) {
		this.mapsAPILoader.load().then(() => {
			let content = this.infoWindowTemplate
				.replace('TITLE', origin.city)
				.replace('DESCRIPTION', origin.description)
				.replace('DATE', origin.date.split('T')[0]);

			let that = this;
			let picturesHtml = '<ul style="padding: 0;">';
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

			let marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city, true, null);

			this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
		});
	}

	private getBatches(stops: Array<ItineraryStep>): Array<any> {
		let batches = [];
		let itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
		let itemsCounter = 0;
		let wayptsExist = stops.length > 0;

		while (wayptsExist) {
			let subBatch = [];
			let flightBatch = [];
			let subitemsCounter = 0;

			for (let j = itemsCounter; j < stops.length; j++) {
				if (stops[j].type === 'FLIGHT') {
					flightBatch.push({
						location: stops[j - 1],
						stopover: true,
						mode: 'flight'
					});
					flightBatch.push({
						location: stops[j],
						stopover: true,
						mode: 'flight'
					});
				}

				subitemsCounter++;

				if (stops[j].type !== 'FLIGHT') {
					if (j > 0 && stops[j - 1].type === 'FLIGHT') {
						subBatch.push({
							location: stops[j - 1],
							stopover: true,
							mode: 'normal'
						});
					}
					subBatch.push({
						location: stops[j],
						stopover: true,
						mode: 'normal'
					});
				}
				if (subitemsCounter === itemsPerBatch || flightBatch.length > 0) {
					break;
				}
			}

			itemsCounter += subitemsCounter;

			if (subBatch.length > 0) {
				batches.push(subBatch);
			}

			wayptsExist = itemsCounter < stops.length;
			if (flightBatch.length > 0) {
				batches.push(flightBatch);
			} else {
				// If it runs again there are still points. Minus 1 before continuing to
				// start up with end of previous tour leg
				itemsCounter--;
			}
		}

		return batches;
	}

	private calculateAndDisplayRoute(directionsService, directionsDisplay, request, allWaypoints, mode, batchesLength, counter, unsortedResults, directionsResultsReturned, markerIndex) {
		let that = this;
		let waypts = request.waypoints;

		if (mode === 'flight') {
			let line = new google.maps.Polyline({
				strokeColor: this.flightLineColor,
				strokeOpacity: 0,
				icons: [{
					icon: {
						path: 'M 0,-1 0,1',
						strokeOpacity: 1,
						scale: 4
					},
					offset: '0',
					repeat: '20px'
				}],
				strokeWeight: 3,
				geodesic: true,
				map: that.map
			});

			let path = [request.origin, request.destination];
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
		} else {
			request.waypoints.forEach(function (element) {
				delete element.mode;
			});

			that.traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, 0);
		}
	}

	private traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, retryNumber) {
		directionsService.route(request, function (response, status) {
			if (status === 'OK') {
				retryNumber = 0;
				that.manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex);
			} else {
				if (retryNumber < 4) {
					setTimeout(function () {
						retryNumber++;
						console.log('retry: ' + retryNumber + ' ' + new Date().getTime());
						that.traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, retryNumber);
					}, 2001);
				} else {
					console.log(status);
					console.log(request);
					window.alert('Aucune route n\'a été trouvé pour rejoindre certains points de l\'itinéraire. Il faut surement changer le moyen de transport de certaines étapes :)');
				}
			}
		});
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
			let count = 0;
			let combinedResult;

			for (let key in unsortedResults) {
				if (unsortedResults[key].result !== null) {
					if (unsortedResults.hasOwnProperty(key)) {
						combinedResult = that.getGoogleMapsRoute(combinedResult, key, unsortedResults, count);
						count++;
					}
				}
			}

			directionsDisplay.setDirections(combinedResult);
			let legs = combinedResult.routes[0].legs;

			let tmpWaypoints = allWaypoints.filter(w => w.type !== 'FLIGHT');

			legs.forEach(function (element, index) {
				if (tmpWaypoints[index] != null) {
					that.itineraryService.getStepPictures(tmpWaypoints[index].id).subscribe(
						result => that.createInfoWindowForStep(result, tmpWaypoints[index], markerIndex),
						error => alert(error)
					);
				}
			});

			if (that.multiple) {
				setTimeout(function () {
					that.map.setZoom(3);
					that.map.setCenter({ lat: 22.6102934, lng: 7.5675984 });
				}, 500);
			}
		}
	}

	private getGoogleMapsRoute(combinedResults, key, unsortedResults, count) {
		if (count === 0) {// first results. new up the combinedResults object
			if (unsortedResults[key].result) {
				combinedResults = unsortedResults[key].result;
			} else {
				combinedResults = unsortedResults[1 + (key * 1)].result;
			}
		} else {
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
		let content = this.infoWindowTemplate
			.replace('TITLE', origin.city)
			.replace('DESCRIPTION', origin.description)
			.replace('DATE', origin.date.split('T')[0]);

		let that = this;
		let picturesHtml = '<ul style="padding: 0;">';

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

		let marker = this.createMarker({ lat: origin.lat, lng: origin.lng }, this.map, origin.city, false, markerIndex);

		this.attachClickEvent(marker, { lat: origin.lat, lng: origin.lng }, content);
	}

	private createMarker(location: any, map: any, title: string, isStop: boolean = false, markerIndex) {
		let marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: isStop ? '/assets/images/icon-stop.svg' : '/assets/images/icon' + markerIndex + '.svg',
			clickable: true,
			title: title,
		});
		this.markers.push(marker);

		return marker;
	}
	private attachClickEvent(marker: any, location: any, content: string) {
		let that = this;

		google.maps.event.addListener(marker, 'click', function (e) {
			let infoWindow = new google.maps.InfoWindow({
				content: content,
				position: location
			});
			that.infoWindows.push(infoWindow);

			that.infoWindows.forEach(function (element) { element.close(); });

			infoWindow.open(that.map, marker);

			let preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
			let nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;

			preElement.children[1].style.display = 'none';
			preElement.children[3].style.display = 'none';
			nextElement.className = 'iw-close';
		});
	}
}
