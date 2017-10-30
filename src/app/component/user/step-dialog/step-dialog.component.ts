import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MdSnackBar, MdDialog, MdDialogRef, MaterialModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';

import { ItineraryStep } from '../../../model/itinerary-step';
import { ItineraryService } from '../../../service/itinerary.service';
import { MapsService } from '../../../service/maps.service';
import { UploadFileComponent } from '../../upload-file/upload-file.component';
import { Picture } from '../../../model/picture';

declare var google: any;

@Component({
	selector: 'step-dialog',
	templateUrl: './step-dialog.component.html',
	styleUrls: ['./step-dialog.component.scss'],
	providers: [UploadFileComponent, MapsService]
})
export class StepDialogComponent implements OnInit, OnChanges {
	newStep: ItineraryStep = new ItineraryStep();
	isUpdate: boolean = false;
	isLoading: boolean = false;
	images: Array<Picture> = [];

	screenHeight: number;
	popinHeight: number;

	@ViewChild('search')
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
		private itineraryService: ItineraryService,
		private mapsService: MapsService) {
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

		window.onresize = (e) => {
			// ngZone.run will help to run change detection
			this.ngZone.run(() => {
				this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
			});
		};
	}

	ngOnInit() {
		let that = this;

		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
			});
			autocomplete.addListener('place_changed', () => {
				this.ngZone.run(() => {
					// get the place result
					let place: any = autocomplete.getPlace();

					that.city.setValue(place.name);

					// verify result
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
			} else {
				this.itineraryService.createStep(this.newStep).subscribe(
					id => id != null ? this.updateImages(false, id.id) : function () { },
					error => alert(error)
				);
			}
		}
		return false;
	}
	getCurrentPosition() {
		let that = this;

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				that.fillFormWithGeolocalisation(position.coords.latitude, position.coords.longitude)
			}, function () {
				that.mapsService.getCurrentPosition().subscribe(
					data => {
						that.fillFormWithGeolocalisation(data.location.lat, data.location.lng);
					}
				);
			});
		}
	}

	private fillFormWithGeolocalisation(latitude: number, longitude: number) {
		let d = new Date();

		this.newStep.date = d.getFullYear() + '-' + this.completeNumberWithZero(d.getMonth() + 1) + '-' + this.completeNumberWithZero(d.getDate());
		this.newStep.lat = latitude;
		this.newStep.lng = longitude;

		let geocoder = new google.maps.Geocoder();

		let that = this;

		geocoder.geocode({
			'latLng': { lat: latitude, lng: longitude }
		}, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					that.city.setValue(results[1].formatted_address);
					that.newStep.city = results[1].formatted_address;
					that.searchElementRef.nativeElement.focus();
				} else {
					alert('Aucun résultat trouvé :(');
				}
			} else {
				alert('Aucun résultat trouvé :(');
			}
		});
	}
	private updateImages(updated: boolean, stepId: number) {
		let that = this;

		if (this.images.length > 0) {
			if (stepId != -1) {
				this.images.map(i => i.stepId = stepId);
			}

			this.images.map(i => (i.caption = (i.caption == null ? '' : i.caption)));

			this.itineraryService.updateImages(this.images).subscribe(
				id => updated ? that.successfullyUpdated() : that.successfullyCreated(),
				error => alert(error)
			);
		} else {
			if (updated) {
				this.successfullyUpdated();
			} else {
				this.successfullyCreated();
			}
		}
	}
	private successfullyCreated() {
		this.isLoading = false;
		this.snackBar.open('Félicitation votre étape a bien été créée', 'Ok', {
			duration: 3000
		});

		let that = this;
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

		let that = this;
		setTimeout(function () {
			that.newStep = new ItineraryStep();
			that.dialogRef.close();
		}, 500);
	}
	private completeNumberWithZero(number: number): string {
		if ((number + '').length === 1) {
			return '0' + number + '';
		} else {
			return '' + number;
		}
	}
}
