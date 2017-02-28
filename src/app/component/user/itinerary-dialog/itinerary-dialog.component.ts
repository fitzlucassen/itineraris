import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { Itinerary } from '../../../model/itinerary';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { MdSnackBar } from '@angular/material';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
	selector: 'itinerary-dialog',
	templateUrl: './itinerary-dialog.component.html',
	styleUrls: ['./itinerary-dialog.component.css'],
	providers: [MdDialog, ItineraryService]
})
export class ItineraryDialogComponent implements OnInit {
	newItinerary: Itinerary = new Itinerary();
	isUpdate: boolean = false;
	isLoading: boolean = false;

	@ViewChild("search")
  	public searchElementRef: ElementRef;

	name: FormControl;
	country: FormControl;
	description: FormControl;
	form: FormGroup;

	constructor(		
		private mapsAPILoader: MapsAPILoader, 
		private ngZone: NgZone,
		public snackBar: MdSnackBar, 
		private fb: FormBuilder, 
		public dialogRef: MdDialogRef<ItineraryDialogComponent>, 
		private itineraryService: ItineraryService) 
	{
		this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.country = new FormControl('', [Validators.required]);
		this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			name: this.name,
			country: this.country,
			description: this.description,
		});
	}

	ngOnInit() {
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["geocode"]
			});
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
				});
			});
		});
	}

	registerItinerary() {
		if (this.form.dirty && this.form.valid) {
			this.isLoading = true;

			if (this.isUpdate) {
				this.itineraryService.update(this.newItinerary).subscribe(
					id => id != null ? this.successfullyUpdated() : function(){},
					error => alert(error)	
				);
			}
			else {
				this.itineraryService.create(this.newItinerary).subscribe(
					id => id != null ? this.successfullyCreated() : function(){},
					error => alert(error)	
				);
			}
		}
		return false;
	}

	private successfullyCreated() {
		this.snackBar.open('Félicitation votre itinéraire a bien été créé', 'Ok');
		this.isLoading = false;

		var that = this;
		setTimeout(function () {
			that.newItinerary = new Itinerary();
			that.dialogRef.close();
		}, 500);
	}

	private successfullyUpdated() {
		this.snackBar.open('Félicitation votre itinéraire a bien été modifié', 'Ok');
		this.isLoading = false;

		var that = this;
		setTimeout(function () {
			that.newItinerary = new Itinerary();
			that.dialogRef.close();
		}, 500);
	}
}
