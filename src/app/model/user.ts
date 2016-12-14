import { Guid } from './Guid';

export class User {
    id: Guid;
    pseudo: string;
    email: string;
    password: string;

    constructor(values: Object = {}) {
        this.id = new Guid();
        (<any>Object).assign(this, values);
    }
}
