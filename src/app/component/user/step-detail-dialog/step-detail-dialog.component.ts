import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ItineraryService } from '../../../service/itinerary.service';
import { ItineraryStep } from '../../../model/itinerary-step';

@Component({
	selector: 'app-step-detail-dialog',
	templateUrl: './step-detail-dialog.component.html',
	styleUrls: ['./step-detail-dialog.component.scss']
})
export class StepDetailDialogComponent implements OnInit {
	screenHeight: number;
	itineraryId: number;
	steps: Array<ItineraryStep>;

	stepId: number;
	stepSleepDescription: string;
	stepFoodDescription: string;
	stepTransportDescription: string;

	form: FormGroup;
	step: FormControl;
	sleepDescription: FormControl
	foodDescription: FormControl
	transportDescription: FormControl

	constructor(private ngZone: NgZone, private itineraryService: ItineraryService, private fb: FormBuilder) {
		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

		window.onresize = (e) => {
			// ngZone.run will help to run change detection
			this.ngZone.run(() => {
				this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
			});
		};

		this.step = new FormControl('', [Validators.required]);
		this.sleepDescription = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.foodDescription = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.transportDescription = new FormControl('', [Validators.required, Validators.minLength(3)]);

		this.form = this.fb.group({
			step: this.step,
			sleepDescription: this.sleepDescription,
			foodDescription: this.foodDescription,
			transportDescription: this.transportDescription
		});
	}

	ngOnInit() {
		this.itineraryService.getItinerarySteps(this.itineraryId).subscribe(
			data => {
				this.steps = data;
				console.log(this.steps);
			},
			error => { alert(error); }
		);
	}
}
