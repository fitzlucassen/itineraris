import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrencyService {
    apiUrl = 'http://data.fixer.io/api/';
    accessToken = '625715ed082dd31d25a0f45ad4237cfa';

    constructor(private http: Http) { }

    convert(value: number, currency: string) {
        const endpoint = 'convert';

        return this.http
            .get(this.apiUrl + endpoint + `?access_key=${this.accessToken}&from=${currency}&to=EUR&amount=${value}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAll() {
        const endpoint = 'symbols';

        return this.http
            .get(this.apiUrl + endpoint + `?access_key=${this.accessToken}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response, index: number) {
        const body = res.json();
        return body;
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
