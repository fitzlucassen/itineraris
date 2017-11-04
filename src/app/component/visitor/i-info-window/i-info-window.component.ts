import { Component, OnInit, ElementRef } from '@angular/core';

import { Picture } from '../../../model/picture';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-i-info-window',
	templateUrl: './i-info-window.component.html',
	styleUrls: ['./i-info-window.component.scss']
})
export class IInfoWindowComponent implements OnInit {
	title: string = '';
	description: string = '';
	mainPicture: string = '';
	date: string = '';
	firstPictureUrl: string = '';
	firstPictureCaption: string = '';
	pictures: string = '';

	isTherePictures: boolean = false;
	serviceUrl: string;
	infoWindowImgTemplate: string = '';

	elRef: ElementRef

	constructor(elRef: ElementRef) {
		this.elRef = elRef;

		this.infoWindowImgTemplate += '<li>';
		this.infoWindowImgTemplate += '<a href="URL1" data-lightbox="image" data-title="CAPTION1">';
		this.infoWindowImgTemplate += '<img class="ui bordered small image" src="URL2" alt="CAPTION2" title="CAPTION3"/>';
		this.infoWindowImgTemplate += '</a>';
		this.infoWindowImgTemplate += '</li>';
	}

	ngOnInit(): void {
		this.serviceUrl = environment.apiUrl;
	}

	getHtmlContent(title: string, description: string, date: string, mainPicture: string, firstPictureUrl: string, firstPictureCaption: string, pictures: Array<Picture>) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.mainPicture = mainPicture;
		this.firstPictureCaption = firstPictureCaption;
		this.firstPictureUrl = firstPictureUrl;
		this.isTherePictures = pictures != null && pictures.length > 0;

		let that = this;

		if (this.isTherePictures) {
			let picturesHtml = '';
			picturesHtml += '<ul style="padding: 0;">';

			pictures.forEach(element => {
				if (element.url !== pictures[0].url) {
					picturesHtml += that.infoWindowImgTemplate
						.replace('URL1', that.serviceUrl + '/' + element.url)
						.replace('URL2', that.serviceUrl + '/' + element.url)
						.replace('CAPTION1', element.caption)
						.replace('CAPTION3', element.caption)
						.replace('CAPTION2', element.caption);
				}
			});
			picturesHtml += '</ul>';

			this.pictures = picturesHtml;
		}

		return this.elRef.nativeElement.innerHTML;
	}
}
