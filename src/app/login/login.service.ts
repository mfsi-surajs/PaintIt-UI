import { Injectable } from "@angular/core";
import { Http,Response,Headers,RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';


import {User} from './user';
import 'rxjs/add/operator/map';
@Injectable()
export class LoginService{
    
    headers      = new Headers({ 'Content-Type': 'application/json',
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123") }); // ... Set content type to JSON
    options       = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http:Http){};
    
    userLogin(username,password){
        let bodyString = JSON.stringify({name:username,password:password}); // Stringify payload
        console.log("name: "+username+" password: "+password);
        return this._http.post(environment.apiEndpoint+"login",bodyString,this.options)
            .map((response:Response) => response.json());
    }

    userSignUp(user){
        let userString = JSON.stringify(user); // Stringify payload
        console.log("userString: "+userString);
        return this._http.post(environment.apiEndpoint+"addUser",userString,this.options)
            .map((response:Response) => response.json());
    }

    getCountries(){
        return this._http.get(environment.apiEndpoint+"getCountries",this.options)
        .map((response:Response) => response.json());
    }
}