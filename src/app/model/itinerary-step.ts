export class ItineraryStep {
    id:number;
    city:string;
    date:string;
    description:string;
    itineraryId:number;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
