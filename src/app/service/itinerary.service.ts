import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Itinerary } from '../model/Itinerary';
import { Guid } from '../model/Guid';
import { ItineraryStep } from '../model/itinerary-step';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ItineraryService {
	serviceUrl: string;

	constructor(private http: Http) {
		this.serviceUrl = environment.apiUrl;
	}

	create(itinerary: Itinerary): Observable<number> {
		return this.http
			.post('http://' + this.serviceUrl + '/itineraries', {
				name: itinerary.name,
				country: itinerary.country,
				description: itinerary.description,
				userId: itinerary.userId
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	update(itinerary: Itinerary): Observable<any> {
		return this.http
			.put('http://' + this.serviceUrl + '/itineraries/' + itinerary.id, {
				name: itinerary.name,
				country: itinerary.country,
				description: itinerary.description,
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	delete(id: number): Observable<any> {
		return this.http
			.delete('http://' + this.serviceUrl + '/itineraries/' + id, {
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	getUserItineraries(user: User): Observable<Array<Itinerary>> {
		return this.http
			.get('http://' + this.serviceUrl + '/itineraries/user/' + user.id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getItineraryById(id: string): Observable<Itinerary> {
		return this.http
			.get('http://' + this.serviceUrl + '/itineraries/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	createStep(step: ItineraryStep): ItineraryService {
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

	updateStep(step: ItineraryStep): ItineraryService {
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

	deleteStep(id: Guid): ItineraryService {
		var items = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			var index = items.findIndex(s => s.id.str == id.str);
			items.splice(index, 1);
			localStorage.setItem('itineraries_steps', JSON.stringify(items));
		}
		return this;
	}

	getItinerarySteps(id: number): Array<ItineraryStep> {
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.itineraryId == id);
		}

		return null;
	}

	getStepById(id: Guid): ItineraryStep {
		var items: Array<ItineraryStep> = JSON.parse(localStorage.getItem('itineraries_steps'));

		if (items != null && items.length > 0) {
			return items.filter(i => i.id.str == id.str)[0];
		}

		return null;
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.result;
	}
	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.message || JSON.stringify(body);
			errMsg = `${error.status} - ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}

		return Observable.throw(errMsg);
	}
}
