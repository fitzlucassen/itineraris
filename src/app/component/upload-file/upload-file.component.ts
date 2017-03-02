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
	@Input() images: Array<Picture> = [];

	isLoading: boolean = false;
	serviceUrl: string;

	constructor(private itineraryService: ItineraryService) {
		this.serviceUrl = environment.apiUrl;

		if (this.stepId != null && this.stepId > 0) {
			var that = this;
			this.itineraryService.getStepPictures(this.stepId).subscribe(
				result => that.assignStepPictures(result),
				error => alert(error)
			);
		}
	}

	triggerUpload($event) {
		this.fileInput.nativeElement.click()
	}

	uploadChange($event) {
		var files = $event.target.files;

		this.isLoading = true;
		var that = this;
		this.itineraryService.uploadImages(this.stepId, files).then((result) => {
			that.isLoading = false;

			result.result.forEach(function (element) {
				that.images.push(new Picture({
					stepId: that.stepId,
					url: 'http://' + that.serviceUrl + '/' + element.url,
					id: element.id,
					date: element.date
				}))
			});
		}, (error) => {
			alert(error);
		});
	}

	removePicture(imageId:number){
		var that = this;
		this.itineraryService.deletePicture(imageId).subscribe(
			result => that.successfullyRemoved(imageId),
			error => alert(error)
		);
	}

	ngOnInit() {
	}

	ngOnChanges(e) {
		if (this.stepId != null && this.stepId > 0) {
			var that = this;
			this.itineraryService.getStepPictures(this.stepId).subscribe(
				result => that.assignStepPictures(result),
				error => alert(error)
			);
		}
	}

	private successfullyRemoved(id){
		this.images = this.images.filter(i => i.id != id);
	}
	private assignStepPictures(pictures: Array<Picture>) {
		var that = this;
		pictures.forEach(function (element) {
			that.images.push(new Picture({
				id: element.id,
				stepId: that.stepId,
				url: 'http://' + that.serviceUrl + '/' + element.url,
				caption: element.caption,
				date: element.date.split('T')[0]
			}));
		});
	}
}
