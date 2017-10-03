import { Injectable } from "@angular/core";
import { Http,Response,Headers,RequestOptions,ResponseContentType } from '@angular/http';

import {User} from '../login/user';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Injectable()
export class LoginService{

    
    
    headers      = new Headers({ 'Content-Type': 'application/json' ,
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")}); // ... Set content type to JSON
    options       = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http:Http){};
    getAllUsers(){
        return this._http.get(environment.apiEndpoint+"all",this.options)
            .map((response:Response) => response.json());
    }



    /**
     * 
     * 
     * @param {string} url 
     * @returns {Observable<any>} 
     * @memberof LoginService
     */
    get(url: string): Observable<any>{
        return new Observable((observer: Subscriber<any> ) => {
            let objectUrl: string = null;

            let headers      = new Headers({ 'Content-Type': 'application/json' ,
            "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")}); // ... Set content type to JSON
            let options       = new RequestOptions({ headers: this.headers,
                responseType: ResponseContentType.Blob }); // Create a request option

            this._http
                .get(url, options/*  {
                    responseType: ResponseContentType.Blob
                } */)
                .subscribe(m => {
                    objectUrl = URL.createObjectURL(m.blob());
                    observer.next(objectUrl);
                });

            return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
        });
    }
}