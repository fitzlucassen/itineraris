import { Component, OnInit, ElementRef } from '@angular/core';

import { Picture } from '../../../model/picture';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-i-info-window',
	templateUrl: './i-info-window.component.html',
	styleUrls: ['./i-info-window.component.scss']
})
export class IInfoWindowComponent implements OnInit {
	serviceUrl: string;

	elRef: ElementRef

	constructor(elRef: ElementRef) {
		this.elRef = elRef;
	}

	ngOnInit(): void {
		this.serviceUrl = environment.apiUrl;
	}

	getHtmlContent() {
		return this.elRef.nativeElement.innerHTML;
	}
}
