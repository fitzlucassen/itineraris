import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Itinerary } from '../model/Itinerary';
import { ItineraryStep } from '../model/itinerary-step';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Picture } from '../model/picture';

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

	getItineraries(): Observable<Array<Itinerary>> {
		return this.http
			.get('http://' + this.serviceUrl + '/itineraries')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getItineraryById(id: string): Observable<Itinerary> {
		return this.http
			.get('http://' + this.serviceUrl + '/itineraries/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	createStep(step: ItineraryStep): Observable<any> {
		return this.http
			.post('http://' + this.serviceUrl + '/steps', {
				city: step.city,
				date: step.date,
				description: step.description,
				itineraryId: step.itineraryId,
				lat: step.lat,
				lng: step.lng,
				type: step.type != null ? step.type : 'DRIVING'
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateSteps(steps: Array<ItineraryStep>): Observable<any> {
		return this.http
			.put('http://' + this.serviceUrl + '/steps/', {steps: steps})
			.map(this.extractData)
			.catch(this.handleError);
	}

	updateStep(step: ItineraryStep): Observable<any> {
		return this.http
			.put('http://' + this.serviceUrl + '/steps/' + step.id, {
				city: step.city,
				date: step.date.split('T')[0],
				description: step.description,
				lat: step.lat,
				lng: step.lng,
				type: step.type,
				position: step.position
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	deleteStep(id: number): Observable<any> {
		return this.http
			.delete('http://' + this.serviceUrl + '/steps/' + id, {
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	getItinerarySteps(itineraryId: number): Observable<Array<ItineraryStep>> {
		return this.http
			.get('http://' + this.serviceUrl + '/steps/itinerary/' + itineraryId)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getStepById(id: string): Observable<ItineraryStep> {
		return this.http
			.get('http://' + this.serviceUrl + '/steps/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	uploadImages(stepId:number, files: any):Promise<any> {
		if(stepId != null)
			return this.makeFileRequest('http://' + this.serviceUrl + '/steps/' + stepId + '/images', [], files);
		else
			return this.makeFileRequest('http://' + this.serviceUrl + '/steps/images', [], files);
	}

	updateImages(images: Array<Picture>): Observable<Array<Picture>>{
		return this.http
			.put('http://' + this.serviceUrl + '/steps/images', {pictures: images})
			.map(this.extractData)
			.catch(this.handleError);
	}	

	getStepPictures(stepId:number): Observable<Array<Picture>>{
		return this.http
			.get('http://' + this.serviceUrl + '/steps/' + stepId + '/images')
			.map(this.extractData)
			.catch(this.handleError);
	}

	deletePicture(id: number): Observable<any> {
		return this.http
			.delete('http://' + this.serviceUrl + '/steps/images/' + id, {
			})
			.map(this.extractData)
			.catch(this.handleError);
	}

	private makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
		return new Promise((resolve, reject) => {
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for (var i = 0; i < files.length; i++) {
				formData.append("uploads[]", files[i], files[i].name + '.jpg');
			}
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open("POST", url, true);
			xhr.send(formData);
		});
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
