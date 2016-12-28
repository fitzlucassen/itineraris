import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Itinerary } from '../model/Itinerary';

@Injectable()
export class ItineraryService {

	constructor() { }

	create(itinerary: Itinerary): ItineraryService {
		var items = JSON.parse(localStorage.getItem('itineraries'));

		if (items != null && items.length > 0) {
			items.push(itinerary);
			localStorage.setItem('itineraries', JSON.stringify(items));
		}
		else {
			localStorage.setItem('itineraries', JSON.stringify([itinerary]));
		}
		return this;
	}

	getUserItineraries(user: User): Array<Itinerary> {
		var items: Array<Itinerary> = JSON.parse(localStorage.getItem('itineraries'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.userId.toString() == user.id.toString());
		}

		return null;
	}
}
