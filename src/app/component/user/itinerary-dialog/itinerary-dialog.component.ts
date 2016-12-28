import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { Itinerary } from '../../../model/itinerary';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { MdSnackBar } from '@angular/material';

@Component({
	selector: 'itinerary-dialog',
	templateUrl: './itinerary-dialog.component.html',
	styleUrls: ['./itinerary-dialog.component.css'],
	providers: [MdDialog, ItineraryService]
})
export class ItineraryDialogComponent implements OnInit {
	newItinerary: Itinerary = new Itinerary();

	name: FormControl;
	country: FormControl;
	description: FormControl;
	form: FormGroup;

	constructor(public snackBar: MdSnackBar, private fb: FormBuilder, public dialogRef: MdDialogRef<ItineraryDialogComponent>, private itineraryService:ItineraryService) {
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
	}

	successfullyCreated() {
		this.snackBar.open('Félicitation votre itinéraire a bien été créé', 'Ok');
	}

	registerItinerary() {
		if (this.form.dirty && this.form.valid) {
			this.itineraryService.create(this.newItinerary);

			this.successfullyCreated();

			var that = this;
			setTimeout(function(){
				that.newItinerary = new Itinerary();
				that.dialogRef.close();
			}, 500);
		}
		return false;
	}
}
