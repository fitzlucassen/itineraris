import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { ItineraryStep } from '../../../model/itinerary-step';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItineraryService } from '../../../service/itinerary.service';
import { MdSnackBar } from '@angular/material';
import { MapsAPILoader } from '@agm/core';
import { UploadFileComponent } from '../../upload-file/upload-file.component';
import { Picture } from '../../../model/picture';

declare var google: any;

@Component({
	selector: 'step-dialog',
	templateUrl: './step-dialog.component.html',
	styleUrls: ['./step-dialog.component.css'],
	providers: [UploadFileComponent]
})
export class StepDialogComponent implements OnInit, OnChanges {
	newStep: ItineraryStep = new ItineraryStep();
	isUpdate: boolean = false;
	isLoading: boolean = false;
	images: Array<Picture> = [];

	screenHeight: number;

	@ViewChild("search")
	public searchElementRef: ElementRef;

	city: FormControl;
	date: FormControl;
	description: FormControl;
	type: FormControl;
	form: FormGroup;

	constructor(
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		public snackBar: MdSnackBar,
		private fb: FormBuilder,
		public dialogRef: MdDialogRef<StepDialogComponent>,
		private itineraryService: ItineraryService) {
		this.city = new FormControl('', [Validators.required, Validators.minLength(2)]);
		this.date = new FormControl('', [Validators.required]);
		this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);
		this.type = new FormControl('', [Validators.required]);

		this.form = this.fb.group({
			city: this.city,
			date: this.date,
			description: this.description,
			type: this.type
		});

		this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
	}

	ngOnInit() {
		var that = this;

		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["geocode"]
			});
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: any = autocomplete.getPlace();

					that.city.setValue(place.name);

					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					that.newStep.lat = place.geometry.location.lat();
					that.newStep.lng = place.geometry.location.lng();
				});
			});
		});
	}

	ngOnChanges(e) {
		console.log(e);
	}

	registerStep() {
		if ((this.form.dirty || this.images.length > 0) && this.form.valid) {
			this.isLoading = true;

			if (this.isUpdate) {
				this.itineraryService.updateStep(this.newStep).subscribe(
					id => id != null ? this.updateImages(true, -1) : function () { },
					error => alert(error)
				);
			}
			else {
				this.itineraryService.createStep(this.newStep).subscribe(
					id => id != null ? this.updateImages(false, id.id) : function () { },
					error => alert(error)
				);
			}
		}
		return false;
	}

	private updateImages(updated: boolean, stepId: number) {
		var that = this;

		if (this.images.length > 0) {
			if (stepId != -1)
				this.images.map(i => i.stepId = stepId);

			this.images.map(i => (i.caption = (i.caption == null ? '' : i.caption)));

			this.itineraryService.updateImages(this.images).subscribe(
				id => updated ? that.successfullyUpdated() : that.successfullyCreated(),
				error => alert(error)
			);
		}
		else {
			if (updated)
				this.successfullyUpdated();
			else
				this.successfullyCreated();
		}
	}
	private successfullyCreated() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre étape a bien été créée', 'Ok', {
			duration: 3000
		});

		var that = this;
		setTimeout(function () {
			that.newStep = new ItineraryStep();
			that.dialogRef.close();
		}, 500);
	}
	private successfullyUpdated() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre étape a bien été modifiée', 'Ok', {
			duration: 3000
		});

		var that = this;
		setTimeout(function () {
			that.newStep = new ItineraryStep();
			that.dialogRef.close();
		}, 500);
	}
}
