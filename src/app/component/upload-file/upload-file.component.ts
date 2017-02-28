import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
	@ViewChild('fileInput') fileInput:ElementRef;

	constructor() {
	}

	triggerUpload($event){
		this.fileInput.nativeElement.click()
	}

	uploadChange($event){
		var files = $event.target.files;
		if (files[0]) {
			$event.fileName = files[0].name;
		} else {
			$event.fileName = null;
		}
		$event.$apply();
	}

	ngOnInit() {
	}
}
