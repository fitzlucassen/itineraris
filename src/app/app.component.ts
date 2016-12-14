import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Itineraris';
  
  lat: number = 18.5284128;
	lng: number = 13.9502671;
	zoom: number = 3;
}
