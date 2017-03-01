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

	isLoading: boolean = false;
	serviceUrl: string;
	images: Array<Picture> = [];

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

			result.forEach(function (element) {
				that.images.push(new Picture({
					stepId: that.stepId,
					url: 'http://' + that.serviceUrl + '/' + element.filename,
				}))
			});
		}, (error) => {
			alert(error);
		});
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

	private assignStepPictures(pictures: Array<Picture>) {
		var that = this;
		pictures.forEach(function (element) {
			that.images.push(new Picture({
				stepId: that.stepId,
				url: 'http://' + that.serviceUrl + '/' + element.url,
				caption: element.caption,
				date: element.date.split('T')[0]
			}));
		});
	}
}
