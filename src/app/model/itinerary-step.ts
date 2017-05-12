export class ItineraryStep {
    id:number;
    city:string;
    date:string;
    description:string;
    itineraryId:number;
    lat:number;
    lng: number;
    type:string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
