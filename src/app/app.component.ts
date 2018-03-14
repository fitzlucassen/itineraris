import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Itineraris';

    // lat: number = 18.5284128;
    // lng: number = 13.9502671;
    // zoom: number = 3;

    constructor() {

    }

    ngOnInit() {
        // set current position
        // this.setCurrentPosition();
    }

    // private setCurrentPosition() {
    // 	if ("geolocation" in navigator) {
    // 		navigator.geolocation.getCurrentPosition((position) => {
    // 			this.lat = position.coords.latitude;
    // 			this.lng = position.coords.longitude;
    // 		});
    // 	}
    // }
}
