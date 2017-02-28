import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { ItineraryStep } from '../../../model/itinerary-step';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { MdSnackBar } from '@angular/material';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { UploadFileComponent } from '../../upload-file/upload-file.component';

@Component({
	selector: 'step-dialog',
	templateUrl: './step-dialog.component.html',
	styleUrls: ['./step-dialog.component.css'],
	providers: [UploadFileComponent]
})
export class StepDialogComponent implements OnInit {
	newStep: ItineraryStep = new ItineraryStep();
	isUpdate: boolean = false;
	isLoading: boolean = false;

	@ViewChild("search")
  	public searchElementRef: ElementRef;

	city: FormControl;
	date: FormControl;
	description: FormControl;
	images: FormControl;
	form: FormGroup;

	constructor(
		private mapsAPILoader: MapsAPILoader, 
		private ngZone: NgZone,
		public snackBar: MdSnackBar, 
		private fb: FormBuilder, 
		public dialogRef: MdDialogRef<StepDialogComponent>, 
		private itineraryService: ItineraryService) 
	{
		this.city = new FormControl('', [Validators.required, Validators.minLength(2)]);
		this.date = new FormControl('', [Validators.required]);
		this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.images = new FormControl('', []);

		this.form = this.fb.group({
			city: this.city,
			date: this.date,
			description: this.description,
			images: this.images
		});
	}

	ngOnInit() {
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["address"]
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

	registerStep() {
		if (this.form.dirty && this.form.valid) {
			this.isLoading = true;

			if (this.isUpdate) {
				this.itineraryService.updateStep(this.newStep).subscribe(
					id => id != null ? this.successfullyUpdated() : function(){},
					error => alert(error)	
				);
			}
			else {
				this.itineraryService.createStep(this.newStep).subscribe(
					id => id != null ? this.successfullyCreated() : function(){},
					error => alert(error)	
				);
			}
		}
		return false;
	}

	private successfullyCreated() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre étape a bien été créée', 'Ok');

		var that = this;
		setTimeout(function () {
			that.newStep = new ItineraryStep();
			that.dialogRef.close();
		}, 500);
	}

	private successfullyUpdated() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre étape a bien été modifiée', 'Ok');

		var that = this;
		setTimeout(function () {
			that.newStep = new ItineraryStep();
			that.dialogRef.close();
		}, 500);
	}
}
