export class Itinerary {
    id: number;
    userId: number;
    name: string;
    country: string;
    description: string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
