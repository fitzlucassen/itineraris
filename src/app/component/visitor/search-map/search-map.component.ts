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
	styleUrls: ['./search-map.component.scss']
})
export class SearchMapComponent implements OnInit {
	@Input() itineraries: Array<Itinerary> = [];

	map: any = null;
	infoWindowTemplate: string = '<div id="iw-container"><b class="iw-title">TITLE</b><div class="iw-content"><i class="iw-subTitle"><a target="_blank" rel="noopener" href="/visiteur/USER/ID/ITINERARYNAME">Voir l\'itinéraire de USERNAME</a></i><br/><br/>DESCRIPTION<br/></div><div class="iw-bottom-gradient"></div></div>'
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
		let that = this;

		this.mapsAPILoader.load().then(() => {
			let element = document.getElementById('searchmap');
			this.container.nativeElement.style.height = '500px';
			element.style.height = '100%';

			that.map = new google.maps.Map(element, {
				zoom: 2,
				center: { lat: 18.5284128, lng: 13.9502671 }
			});

			let locations = [];

			that.itineraries.forEach(function (element) {
				let l = { lat: element.stepLat, lng: element.stepLng };
				let m = new google.maps.Marker({
					position: l,
					icon: '/assets/images/icon0.svg'
				});
				locations.push(m);

				that.createInfoWindowForStep(element, m, l);
			});

			setTimeout(function () {
				let markerCluster = new MarkerClusterer(that.map, locations, { imagePath: '/assets/images/markers/m' });
			}, 500);
		});
	}

	unloadMap() {
		let element = document.getElementById('searchmap');
		this.container.nativeElement.style.height = '0';

		element.innerHTML = '';
		element.style.height = '0';
	}

	private createInfoWindowForStep(itinerary: Itinerary, marker: any, location: any) {
		let content = this.infoWindowTemplate
			.replace('TITLE', itinerary.name + ' - <i>' + itinerary.country + '</i>')
			.replace('USER', this.replaceAll(itinerary.users[0].name.toLowerCase(), ' ', '-'))
			.replace('USERNAME', itinerary.users[0].name)
			.replace('ID', itinerary.id + '')
			.replace('ITINERARYNAME', this.replaceAll(itinerary.name.toLowerCase(), ' ', '-'))
			.replace('DESCRIPTION', itinerary.description)

		let that = this;

		this.attachClickEvent(marker, location, content);
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

			let element = document.getElementsByClassName('gm-style-iw');

			setTimeout(function () {
				let preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
				let nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;

				preElement.children[1].style.display = 'none';
				preElement.children[3].style.display = 'none';
				nextElement.className = 'iw-close';
			}, 200);
		});
	}
}
