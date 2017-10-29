import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { ItineraryService } from '../../service/itinerary.service';
import { environment } from '../../../environments/environment';
import { Picture } from '../../model/picture';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.css'],
	providers: [ItineraryService]
})
export class UploadFileComponent implements OnInit, OnChanges {
	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() stepId: number;
	@Input() stopId: number;
	@Input() images: Array<Picture> = [];

	isLoading: boolean = false;
	serviceUrl: string;

	constructor(private itineraryService: ItineraryService) {
		this.serviceUrl = environment.apiUrl;

		if (this.stepId != null && this.stepId > 0) {
			let that = this;
			this.itineraryService.getStepPictures(this.stepId).subscribe(
				result => that.assignStepPictures(result),
				error => alert(error)
			);
		} else if (this.stopId != null && this.stopId > 0) {
			let that = this;
			this.itineraryService.getStopPictures(this.stopId).subscribe(
				result => that.assignStopPictures(result),
				error => alert(error)
			);
		}
	}

	triggerUpload($event) {
		this.fileInput.nativeElement.click()
	}

	uploadChange($event) {
		let files = $event.target.files;

		this.isLoading = true;
		let that = this;

		
		if (this.stepId) {
			this.itineraryService.uploadImages(this.stepId, files).then((result) => {
				that.isLoading = false;
				console.log(result);
				
				result.result.forEach(function (element) {
					let img = new Picture({
						stepId: that.stepId,
						url: that.serviceUrl + '/' + element.url,
						id: element.id,
						date: element.date
					});

					that.images.push(img);
				});
			}, (error) => {
				alert(error);
			});
		} else {
			this.itineraryService.uploadStopImages(this.stopId, files).then((result) => {
				that.isLoading = false;

				result.result.forEach(function (element) {
					let img = new Picture({
						stopId: that.stopId,
						url: that.serviceUrl + '/' + element.url,
						id: element.id,
						date: element.date
					});

					that.images.push(img);
				});
			}, (error) => {
				alert(error);
			});
		}
	}

	removePicture(imageId: number) {
		let that = this;
		this.itineraryService.deletePicture(imageId).subscribe(
			result => that.successfullyRemoved(imageId),
			error => alert(error)
		);
	}

	ngOnInit() {
	}

	ngOnChanges(e) {
		if (this.stepId != null && this.stepId > 0) {
			let that = this;
			this.itineraryService.getStepPictures(this.stepId).subscribe(
				result => that.assignStepPictures(result),
				error => alert(error)
			);
		} else if (this.stopId != null && this.stopId > 0) {
			let that = this;
			this.itineraryService.getStopPictures(this.stopId).subscribe(
				result => that.assignStopPictures(result),
				error => alert(error)
			);
		}
	}

	private successfullyRemoved(id) {
		this.images = this.images.filter(i => i.id != id);
	}
	private assignStepPictures(pictures: Array<Picture>) {
		let that = this;
		pictures.forEach(function (element) {
			that.images.push(new Picture({
				id: element.id,
				stepId: that.stepId,
				url: that.serviceUrl + '/' + element.url,
				caption: element.caption,
				date: element.date.split('T')[0]
			}));
		});
	}
	private assignStopPictures(pictures: Array<Picture>) {
		let that = this;
		pictures.forEach(function (element) {
			let img = new Picture({
				id: element.id,
				url: that.serviceUrl + '/' + element.url,
				caption: element.caption,
				date: element.date.split('T')[0]
			});
			if (that.stepId) {
				img.stepId = that.stepId;
			} else {
				img.stopId = that.stopId;
			}
			that.images.push(img);
		});
	}
}
