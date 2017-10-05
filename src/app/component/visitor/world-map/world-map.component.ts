import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { ItineraryStep } from '../../../model/itinerary-step';
import { Stop } from '../../../model/stop';
import { MapComponent } from '../map/map.component';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';

import { ShareButtonsModule } from 'ng2-sharebuttons';

@Component({
	selector: 'app-world-map',
	templateUrl: './world-map.component.html',
	styleUrls: ['./world-map.component.css'],
	providers: [ItineraryService]
})
export class WorldMapComponent implements OnInit {
	steps: Array<Array<ItineraryStep>>;
	stops: Array<Stop>;

	title: string;
	screenHeight: number;
	totalShare: number = 0;

	currentUrl: string;
	currentTitle: string = 'Les voyages';
	currentDescription: string = 'Visualisation des itinéraires de voyage';

	@ViewChild(MapComponent) public map: MapComponent;
	@ViewChild('toAppend') public sidenav: ElementRef;

	constructor(
		public route: ActivatedRoute,
		private userService: UserService,
		private itineraryService: ItineraryService,
		private router: Router,
		private renderer: Renderer, private metaService: Meta, private titleService: Title) {

		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
		this.currentUrl = window.location.href;
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let userId = params['iduser'];
			let userName = params['nameuser'];

			this.title = userName;

			this.currentTitle += ' de ' + userName;
			this.currentDescription += ' de ' + userName;

			this.titleService.setTitle(this.currentTitle);
			this.metaService.updateTag({ content: this.currentTitle }, "name='og:title'");
			this.metaService.updateTag({ content: this.currentDescription }, "name='description'");
			this.metaService.updateTag({ content: this.currentDescription }, "name='og:description'");

			var that = this;

			this.itineraryService.getItinerariesSteps(userId).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);
			this.itineraryService.getItinerariesStops(userId).subscribe(
				result => that.assignItineraryStops(result),
				error => alert(error)
			);

			this.renderer.setElementProperty(this.sidenav.nativeElement, 'innerHTML', '<div id="fb-root"></div><div class="fb-comments" data-href="' + this.currentUrl + '" data-numposts="10"></div>');

			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id) && window['FB']) {
					window['FB'].XFBML.parse(); //Instead of returning, lets call parse()
				}
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.8&appId=265963237186602";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		});
	}

	ngOnDestroy() {
		delete window['FB'];
	}

	sumCounts(count) {
		this.totalShare += count;
	}

	private assignItinerarySteps(result: Array<Array<ItineraryStep>>) {
		this.steps = result;

		this.map.steps = this.steps;

		this.map.updateDirections(null, null, null);
	}
	private assignItineraryStops(result: Array<Stop>) {
		this.stops = result;

		var that = this;

		this.stops.forEach(function (element: Stop) {
			that.itineraryService.getStopPictures(element.id).subscribe(
				data => { that.map.createInfoWindowForStop(data, element); },
				error => { alert(error); }
			);
		});
	}
}
