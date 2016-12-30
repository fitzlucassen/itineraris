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

	update(itinerary: Itinerary): ItineraryService {
		var items = JSON.parse(localStorage.getItem('itineraries'));

		if (items != null && items.length > 0) {
			var index = items.findIndex(s => s.id.str == itinerary.id.str);
			items[index] = itinerary;
			localStorage.setItem('itineraries', JSON.stringify(items));
		}
		else {
			localStorage.setItem('itineraries', JSON.stringify([itinerary]));
		}
		return this;
	}

	delete(id:Guid): ItineraryService{
		var items = JSON.parse(localStorage.getItem('itineraries'));

		if (items != null && items.length > 0) {
			var index = items.findIndex(s => s.id.str == id.str);
			items.splice(index, 1);
			localStorage.setItem('itineraries', JSON.stringify(items));

			this.deleteStepByItineraryId(id);
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

	updateStep(step:ItineraryStep):ItineraryService{
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			var index = items.findIndex(s => s.id.str == step.id.str);
			items[index] = step;
			localStorage.setItem('itineraries_steps', JSON.stringify(items));
		}
		else {
			localStorage.setItem('itineraries_steps', JSON.stringify([step]));
		}
		return this;
	}

	deleteStep(id:Guid): ItineraryService{
		var items = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			var index = items.findIndex(s => s.id.str == id.str);
			items.splice(index, 1);
			localStorage.setItem('itineraries_steps', JSON.stringify(items));
		}
		return this;
	}

	deleteStepByItineraryId(id:Guid): ItineraryService{
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			let indexes: Array<Guid> = new Array<Guid>();

			items.forEach(function(element, index){
				if(element.itineraryId.str == id.str){
					indexes.push(element.id);
				}
			});

			indexes.forEach(function(element){
				items.splice(items.findIndex(i => i.id.str == element.str), 1);
			});
			
			localStorage.setItem('itineraries_steps', JSON.stringify(items));
		}
		return this;
	}

	getItinerarySteps(id:Guid): Array<ItineraryStep>{
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.itineraryId.str == id.str);
		}

		return null;
	}

	getStepById(id:Guid):ItineraryStep{
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.id.str == id.str)[0];
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
