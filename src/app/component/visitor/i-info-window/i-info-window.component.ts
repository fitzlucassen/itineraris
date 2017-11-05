import { Component, OnInit, ElementRef, ViewChild, Injectable } from '@angular/core';

import { Picture } from '../../../model/picture';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
	selector: 'app-i-info-window',
	templateUrl: './i-info-window.component.html',
	styleUrls: ['./i-info-window.component.scss']
})
export class IInfoWindowComponent implements OnInit {
	title: string = '';
	date: string = '';
	description: string = '';
	mainPictureUrl: string = '';
	mainPictureCaption: string = '';
	pictures: Array<Picture>;
	astuces: Array<any>;

	isTherePictures: boolean = false;
	serviceUrl: string;
	isSumUp: boolean = true;

	mainContainer: ElementRef;

	lat: number;
	lng: number;
	infoWindow: any;

	constructor(currentElement: ElementRef) {
		this.mainContainer = currentElement;
	}

	create(lat: number, lng: number, title: string, date: string, description: string, pictures: Array<Picture>) {
		this.title = title;
		this.date = date.split('T')[0];
		this.description = description;
		this.pictures = pictures;
		this.lat = lat;
		this.lng = lng;

		this.isTherePictures = pictures != null && pictures.length > 0;

		if (this.isTherePictures) {
			this.mainPictureUrl = this.serviceUrl + '/' + pictures[0].url;
			this.mainPictureCaption = pictures[0].caption;
		} else {
			this.mainPictureUrl = '/assets/images/default.png';
		}

		this.infoWindow = new google.maps.InfoWindow({
			content: this.mainContainer.nativeElement,
			position: { lat: this.lat, lng: this.lng }
		});
	}

	ngOnInit(): void {
		this.serviceUrl = environment.apiUrl;
	}

	toggleIsSumUp() {
		this.isSumUp = !this.isSumUp;
	}

	open(map: any, marker: any) {
		this.infoWindow.open(map, marker);
	}

	close() {
		this.infoWindow.close();
	}

	getHtmlContent(): string {
		return this.mainContainer.nativeElement;
	}
}
