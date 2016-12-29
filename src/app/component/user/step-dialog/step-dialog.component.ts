import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { ItineraryStep } from '../../../model/itinerary-step';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { MdSnackBar } from '@angular/material';

@Component({
	selector: 'step-dialog',
	templateUrl: './step-dialog.component.html',
	styleUrls: ['./step-dialog.component.css']
})
export class StepDialogComponent implements OnInit {
	newStep: ItineraryStep = new ItineraryStep();

	city: FormControl;
	date: FormControl;
	description: FormControl;
	form: FormGroup;

	constructor(public snackBar: MdSnackBar, private fb: FormBuilder, public dialogRef: MdDialogRef<StepDialogComponent>, private itineraryService: ItineraryService) {
		this.city = new FormControl('', [Validators.required, Validators.minLength(2)]);
		this.date = new FormControl('', [Validators.required]);
		this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			city: this.city,
			date: this.date,
			description: this.description,
		});
	}

	ngOnInit() {
	}

	successfullyCreated() {
		this.snackBar.open('Félicitation votre étape a bien été créée', 'Ok');
	}

	registerStep() {
		if (this.form.dirty && this.form.valid) {
			this.itineraryService.createStep(this.newStep);

			this.successfullyCreated();

			var that = this;
			setTimeout(function(){
				that.newStep = new ItineraryStep();
				that.dialogRef.close();
			}, 500);
		}
		return false;
	}
}
