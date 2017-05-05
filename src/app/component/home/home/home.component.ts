import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(private router: Router, private metaService: Meta) { 
		this.metaService.updateTag({content: "Vos itinéraires voyages - Itineraris"}, "name='title'");
		this.metaService.updateTag({content: "Vos itinéraires voyages - Itineraris"}, "name='og:title'");
		this.metaService.updateTag({content: "Créez vos itinéraires de voyages et tenez informé vos proches"}, "name='description'");
		this.metaService.updateTag({content: "Créez vos itinéraires de voyages et tenez informé vos proches"}, "name='og:description'");
	}

	ngOnInit() {
	}
}
