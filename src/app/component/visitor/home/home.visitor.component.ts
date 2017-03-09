import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { Itinerary } from '../../../model/itinerary';
import { SearchItineraryPipe } from '../../../pipe/search-itinerary.pipe';
import { Router } from '@angular/router';

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

	itineraries: Array<Itinerary> = [];

	constructor(private fb: FormBuilder, private itineraryService: ItineraryService, private router: Router) {
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

	replaceAll(str:string, replace:string, value:string):string{
		return str.replace(new RegExp(replace, 'g'), value);
	}

	ngOnInit() {
	}

	private assignItineraries(result){
		this.itineraries = result;
	}
}
