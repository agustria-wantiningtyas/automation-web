
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Config } from '../components/api-config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeneralService {
    apiUrl: any;

    private static handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status === 404) {
                errMsg = `Resource ${error.url} was not found`;
            } else {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }
    constructor(
        // private http: Http
        public http: HttpClient
    ) {
        this.apiUrl = Config.apiUrl;
    }

    getData(content) {
        return this.http.post(this.apiUrl + content.urlName, content.body)
            .map(response => response)
            .catch(GeneralService.handleError);
    }

    postFile(fileToUpload: File): Observable<boolean> {
        const endpoint = this.apiUrl + 'uploadFile';
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        return this.http
            .post(endpoint, formData)
            .map(() => { return true; })
            .catch(GeneralService.handleError);
    }

    postFileGeneral(fileToUpload: File, content): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        formData.append('token', content.token);
        formData.append('cus_id', content.cus_id);
        return this.http.post(this.apiUrl + content.urlName, formData)
            .map(response => response)
            .catch(GeneralService.handleError);
    }
}
