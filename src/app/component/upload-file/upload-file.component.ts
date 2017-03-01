import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ItineraryService } from '../../service/itinerary.service';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.css'],
	providers: [ItineraryService]

})
export class UploadFileComponent implements OnInit {
	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() stepId: number;

	isLoading:boolean = false;

	constructor(private itineraryService: ItineraryService) {
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

			console.log(result);
        }, (error) => {
            alert(error);
		});
	}

	ngOnInit() {
	}
}
