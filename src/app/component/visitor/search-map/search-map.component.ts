import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { ItineraryService } from '../../../service/itinerary.service';
import { Itinerary } from '../../../model/itinerary';

import 'js-marker-clusterer/src/markerclusterer.js';

declare var google: any;
declare var MarkerClusterer;

@Component({
	selector: 'search-map',
	templateUrl: './search-map.component.html',
	styleUrls: ['./search-map.component.css']
})
export class SearchMapComponent implements OnInit {
	@Input() itineraries: Array<Itinerary> = [];

	map: any = null;
	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle"><a target="_blank" href="/#/visiteur/USER/ID/ITINERARYNAME">Voir l\'itinéraire de USERNAME</a></i><br/><br/>DESCRIPTION<br/></div><div class="iw-bottom-gradient"></div></div>'
	infoWindows: Array<any> = [];

	@ViewChild('container') container: ElementRef;

	constructor(private mapsAPILoader: MapsAPILoader, private itineraryService: ItineraryService) {
	}

	ngOnInit() {
	}

	replaceAll(str: string, replace: string, value: string): string {
		return str.replace(new RegExp(replace, 'g'), value);
	}

	loadMap() {
		var that = this;

		this.mapsAPILoader.load().then(() => {
			var element = document.getElementById('searchmap');
			this.container.nativeElement.style.height = '500px';
			element.style.height = '100%';

			that.map = new google.maps.Map(element, {
				zoom: 2,
				center: { lat: 18.5284128, lng: 13.9502671 }
			});

			var locations = [];

			that.itineraries.forEach(function (element) {
				var l = { lat: element.stepLat, lng: element.stepLng };
				var m = new google.maps.Marker({
					position: l,
					icon: '/assets/icon.png'
				});
				locations.push(m);

				that.createInfoWindowForStep(element, m, l);
			});

			setTimeout(function () {
				var markerCluster = new MarkerClusterer(that.map, locations, { imagePath: '/assets/markers/m' });
			}, 500);
		});
	}

	unloadMap() {
		var element = document.getElementById('searchmap');
		this.container.nativeElement.style.height = '0';

		element.innerHTML = '';
		element.style.height = '0';
	}

	private createInfoWindowForStep(itinerary: Itinerary, marker: any, location: any) {
		var content = this.infoWindowTemplate
			.replace('TITLE', itinerary.name + ' - <i>' + itinerary.country + '</i>')
			.replace('USER', this.replaceAll(itinerary.user.name.toLowerCase(), ' ', '-'))
			.replace('USERNAME', itinerary.user.name)
			.replace('ID', itinerary.id + '')
			.replace('ITINERARYNAME', this.replaceAll(itinerary.name.toLowerCase(), ' ', '-'))
			.replace('DESCRIPTION', itinerary.description)

		var that = this;

		this.attachClickEvent(marker, location, content);
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

			var element = document.getElementsByClassName('gm-style-iw');

			setTimeout(function () {
				var preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
				var nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;

				preElement.children[1].style.display = 'none';
				preElement.children[3].style.display = 'none';
				nextElement.className = 'iw-close';
			}, 200);
		});
	}
}
