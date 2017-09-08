import { Injectable } from "@angular/core";
import { Http,Response,Headers,RequestOptions } from '@angular/http';

import {User} from './login/user';
import 'rxjs/add/operator/map';
@Injectable()
export class LoginService{
    
    headers      = new Headers({ 'Content-Type': 'application/json',
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123") }); // ... Set content type to JSON
    options       = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http:Http){};
    getAllUsers(){
        return this._http.get("http://localhost:8080/paintingApis/all",this.options)
            .map((response:Response) => response.json());
    }
}