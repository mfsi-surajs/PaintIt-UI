import { Injectable } from "@angular/core";
import { Http,Response,Headers,RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';

import {User} from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


/**
 * 
 * 
 * @export
 * @class LoginService
 */
@Injectable()
export class LoginService{
    
    headers      = new Headers({ 'Content-Type': 'application/json',
    "Authorization": environment.UserAuthorization });
    options       = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http:Http){};
    
    /**
     * For Login authentication.
     * 
     * @param {any} username 
     * @param {any} password 
     * @returns 
     * @memberof LoginService
     */
    userLogin(username,password){
        let bodyString = JSON.stringify({name:username,password:password}); // Stringify payload
        console.log("name: "+username+" password: "+password);
        return this._http.post(environment.apiEndpoint+"login",bodyString,this.options)
            .map((response:Response) => response.json());
    }

    /**
     * For Adding new user.
     * 
     * @param {any} user 
     * @returns 
     * @memberof LoginService
     */
    userSignUp(user){
        let userString = JSON.stringify(user); // Stringify payload
        console.log("userString: "+userString);
        return this._http.post(environment.apiEndpoint+"addUser",userString,this.options)
            .map((response:Response) => response.json());
    }

    /**
     * To get all the countries from server.
     * 
     * @returns 
     * @memberof LoginService
     */
    getCountries(){
        return this._http.get(environment.apiEndpoint+"getCountries",this.options)
        .map((response:Response) => response.json());
    }

    /**
     * Real time search to check Availability of username.
     * 
     * @param {Observable<string>} username 
     * @returns 
     * @memberof LoginService
     */
    searchUsername(username: Observable<string>) {
        
        return username.debounceTime(400)
          .distinctUntilChanged()
          .switchMap(user => this.usernameStatus({"username":user}));
    }

    /**
     * Sends username to over API.
     * 
     * @param {any} user 
     * @returns 
     * @memberof LoginService
     */
    usernameStatus(user){
        let userString = JSON.stringify(user); // Stringify payload
        console.log("userString: "+userString);
        return this._http.post(environment.apiEndpoint+"getUsernameStatus",userString,this.options)
            .map((response:Response) => response.json());
    }


    /**
     * Sends username to over API.
     * 
     * @param {any} user 
     * @returns 
     * @memberof LoginService
     */
    googleSignIn(id_token){
        //let userString = JSON.stringify(user); // Stringify payload
        console.log("id_token: "+id_token);
        return this._http.post(environment.apiEndpoint+"googleSignIn",id_token,this.options)
            .map((response:Response) => response.json());
    }


}