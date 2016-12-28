import { Guid } from './Guid';

export class Itinerary {
    id: Guid;
    userId: Guid;
    name: string;
    country: string;
    description: string;

    constructor(values: Object = {}) {
        this.id = new Guid();
        (<any>Object).assign(this, values);
    }
}
