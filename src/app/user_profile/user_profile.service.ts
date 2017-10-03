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
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")});
    options = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http: Http) { };
    /**
     * Requests all the user details of seleted user.
     * 
     * @param {any} id 
     * @returns 
     * @memberof UserProfileService
     */
    getUserDetails(id) {
        this.requestBody = { "id": id };
        return this._http.post( environment.apiEndpoint+"getUserPublicData", this.requestBody, this.options)
            .map((response: Response) => response.json());
    }
    /**
     * Requests all the user paintings of seleted user.
     * 
     * @param {any} id 
     * @param {any} status 
     * @returns 
     * @memberof UserProfileService
     */
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


    /**
     * Uploads the seleted profile image.
     * 
     * @param {string} userID 
     * @param {FileList} files 
     * @returns 
     * @memberof UserProfileService
     */
    uploadProfilePicture(userID: string, files: FileList) {

        let fileList: FileList = files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('userID', userID);
            let headers = new Headers({"Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")});
            
            let options = new RequestOptions({ headers: headers });
            return this._http.post(environment.apiEndpoint+`addUserProfileImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
            
        }
    }

    /**
     * Uploads the selected painting.
     * 
     * @param {string} userID 
     * @param {FileList} files 
     * @returns 
     * @memberof UserProfileService
     */
    uploadPainting(userID: string, files: FileList) {

        let fileList: FileList = files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('userID', userID);
            let headers = new Headers({"Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")});
            let options = new RequestOptions({ headers: headers });
            return this._http.post(environment.apiEndpoint+`addUserPaintingImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
           
        }
    }

    /**
     * This sends request to change the status of user painting.
     * 
     * @param {any} userImage 
     * @returns 
     * @memberof UserProfileService
     */
    changeImagePublicStatus(userImage) {
        return this._http.post(environment.apiEndpoint+"changeImagePublicStatus", userImage, this.options)
            .map((response: Response) => response.json());
    }
}