import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { User } from '../login/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';


@Injectable()
export class UserProfileService {
    requestBody;
    headers = new Headers({ 'Content-Type': 'application/json' ,
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")}); // ... Set content type to JSON
    options = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http: Http) { };
    getUserDetails(id) {
        this.requestBody = { "id": id };
        return this._http.post( environment.apiEndpoint+"getUserPublicData", this.requestBody, this.options)
            .map((response: Response) => response.json());
    }
    getUserImages(id,status) {
        let url;
        if(status){
            url = environment.apiEndpoint+"getUserAllImages";
        }else{
            url = environment.apiEndpoint+"getUserPublicImages";
        }
        this.requestBody = { "id": id };
        return this._http.post(url, this.requestBody, this.options)
            .map((response: Response) => response.json());
    }


    uploadProfilePicture(username: string, files: FileList) {

        let fileList: FileList = files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('username', username);
            let headers = new Headers({"Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")});
            
            let options = new RequestOptions({ headers: headers });
            return this._http.post(environment.apiEndpoint+`addUserProfileImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
            
        }
    }

    uploadPainting(username: string, files: FileList) {

        let fileList: FileList = files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('username', username);
            let headers = new Headers({"Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")});
            let options = new RequestOptions({ headers: headers });
            return this._http.post(environment.apiEndpoint+`addUserPaintingImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
           
        }
    }

    changeImagePublicStatus(userImage) {
        return this._http.post(environment.apiEndpoint+"changeImagePublicStatus", userImage, this.options)
            .map((response: Response) => response.json());
    }
}