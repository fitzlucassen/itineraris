import { User } from './user';

export class Itinerary {
    id: number;
    userId: number;
    name: string;
    country: string;
    description: string;
    user: User;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
