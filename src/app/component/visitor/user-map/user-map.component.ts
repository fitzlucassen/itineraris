import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { MapComponent } from '../map/map.component';
import { MetaService } from 'ng2-meta';
import { ShareButtonsModule } from 'ng2-sharebuttons';

@Component({
	selector: 'app-user-map',
	templateUrl: './user-map.component.html',
	styleUrls: ['./user-map.component.css'],
	providers: [ItineraryService, UserService, MapComponent],
})
export class UserMapComponent implements OnInit, OnDestroy {
	itinerary: Itinerary;
	steps: Array<ItineraryStep>;

	title: string;
	screenHeight: number;
	currentUrl: string;
	totalShare: number = 0;

	@ViewChild(MapComponent)
	public map: MapComponent;
	@ViewChild('toAppend')
	public sidenav: ElementRef;

	constructor(
		private metaService: MetaService,
		public route: ActivatedRoute,
		private userService: UserService,
		private itineraryService: ItineraryService,
		private router: Router,
		private renderer: Renderer) {
		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
		this.currentUrl = window.location.href;
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			// Récupération des valeurs de l'URL
			let itineraryId = params['id'];
			let itineraryName = params['name'];
			let userName = params['nameuser'];

			this.title = userName;

			setTimeout(() => {
				this.metaService.setTitle('Itinéraire de voyage de ' + userName);
			});

			var that = this;
			this.itineraryService.getItinerarySteps(itineraryId).subscribe(
				result => that.assignItinerarySteps(result),
				error => alert(error)
			);

			this.itineraryService.getItineraryById(itineraryId).subscribe(
				result => that.assignItinerary(result),
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

	private assignItinerary(result: Itinerary) {
		this.itinerary = result;
	}
	private assignItinerarySteps(result: Array<ItineraryStep>) {
		this.steps = result;

		if (this.steps.length > 0) {
			this.map.origin = {
				latitude: this.steps[0].lat,
				longitude: this.steps[0].lng,
				object: this.steps[0]
			};
		}
		if (this.steps.length > 1) {
			this.map.destination = {
				latitude: this.steps[this.steps.length - 1].lat,
				longitude: this.steps[this.steps.length - 1].lng,
				object: this.steps[this.steps.length - 1]
			};

			this.map.waypoints = this.steps;
		}
		this.map.updateDirections();
	}
}
