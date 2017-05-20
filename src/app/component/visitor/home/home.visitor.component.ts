import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { ItineraryService } from '../../../service/itinerary.service';
import { Itinerary } from '../../../model/itinerary';
import { SearchItineraryPipe } from '../../../pipe/search-itinerary.pipe';

@Component({
	selector: 'app-home',
	templateUrl: './home.visitor.component.html',
	styleUrls: ['./home.visitor.component.css'],
	providers: [ItineraryService]
})
export class HomeVisitorComponent implements OnInit {
	searchText: string;
	search: FormControl;
	form: FormGroup;
	screenHeight: number;

	itineraries: Array<Itinerary> = [];

	constructor(private fb: FormBuilder, private itineraryService: ItineraryService, private router: Router, private metaService: Meta, private titleService: Title) {
		this.titleService.setTitle('Trouvez un itinéraire de voyage');
		this.metaService.updateTag({ content: "Trouvez un itinéraire de voyage" }, "name='og:title'");
		this.metaService.updateTag({ content: "Recherchez un itinéraire de voyage" }, "name='description'");
		this.metaService.updateTag({ content: "Recherchez un itinéraire de voyage" }, "name='og:description'");

		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

		this.search = new FormControl('', [Validators.required]);
		this.form = this.fb.group({
			search: this.search,
		});

		var that = this;
		this.itineraryService.getItineraries().subscribe(
			result => that.assignItineraries(result),
			error => alert(error)
		);
	}

	replaceAll(str: string, replace: string, value: string): string {
		return str.replace(new RegExp(replace, 'g'), value);
	}

	ngOnInit() {
	}

	private assignItineraries(result: Array<Itinerary>) {
		this.itineraries = result.sort(this.sorter);
	}

	private sorter(a: Itinerary, b: Itinerary) {
		if (a.nbStep < b.nbStep) {
			return 1;
		} else if (a.nbStep > b.nbStep) {
			return -1;
		} else {
			return 0;
		}
	}
}
