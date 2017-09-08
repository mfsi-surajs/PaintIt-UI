import { Injectable } from "@angular/core";
import { Http,Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class EditService{
    
    headers      = new Headers({ 'Content-Type': 'application/json',
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123") }); // ... Set content type to JSON
    options       = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http:Http){}

    userEdit(user){
        
        let userString = JSON.stringify(user); // Stringify payload
        console.log("userString: "+userString);
        return this._http.post("http://localhost:8080/paintingApis/editUser",userString,this.options)
            .map((response:Response) => response.json());
    }

    getCountries(){
        return this._http.get("http://localhost:8080/paintingApis/getCountries",this.options)
        .map((response:Response) => response.json());
    }
}