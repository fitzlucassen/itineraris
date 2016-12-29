import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Itinerary } from '../model/Itinerary';
import { Guid } from '../model/Guid';
import { ItineraryStep } from '../model/itinerary-step';

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

	createStep(step:ItineraryStep):ItineraryService{
		var items = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			items.push(step);
			localStorage.setItem('itineraries_steps', JSON.stringify(items));
		}
		else {
			localStorage.setItem('itineraries_steps', JSON.stringify([step]));
		}

		return this;
	}

	getItinerarySteps(itinerary:Itinerary): Array<ItineraryStep>{
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.itineraryId.str == itinerary.id.str);
		}

		return null;
	}

	getUserItineraries(user: User): Array<Itinerary> {
		var items: Array<Itinerary> = JSON.parse(localStorage.getItem('itineraries'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.userId.str == user.id.str);
		}

		return null;
	}

	getItineraryById(user: User, id:string): Itinerary {
		var items: Array<Itinerary> = this.getUserItineraries(user);

		if (items != null && items.length > 0) {
			return items.filter(i => i.id.str == id)[0];
		}

		return null;
	}
}
