export class Picture {
    id: number;
    url: string;
    stepId: number;
    date: string;
    caption: string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
