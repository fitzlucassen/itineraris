import { Guid } from './Guid';

export class ItineraryStep {
    id:Guid;
    city:string;
    date:Date;
    description:string;
    itineraryId:number;

    constructor(values: Object = {}) {
        this.id = new Guid();
        (<any>Object).assign(this, values);
    }
}
