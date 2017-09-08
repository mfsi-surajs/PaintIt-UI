import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { User } from '../login/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()
export class UserProfileService {
    requestBody;
    headers = new Headers({ 'Content-Type': 'application/json' ,
    "Authorization": "Basic " + btoa("mindfire" + ":" + "mindfire123")}); // ... Set content type to JSON
    options = new RequestOptions({ headers: this.headers }); // Create a request option
    constructor(private _http: Http) { };
    getUserDetails(id) {
        this.requestBody = { "id": id };
        return this._http.post("http://localhost:8080/paintingApis/getUserPublicData", this.requestBody, this.options)
            .map((response: Response) => response.json());
    }
    getUserImages(id,status) {
        let url;
        if(status){
            url = "http://localhost:8080/paintingApis/getUserAllImages";
        }else{
            url = "http://localhost:8080/paintingApis/getUserPublicImages";
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
            /** No need to include Content-Type in Angular 4 */
            //headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            return this._http.post(`http://localhost:8080/paintingApis/addUserProfileImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
            /* .subscribe(
                data => console.log('success'),
                error => console.log(error)
            ) */
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
            /** No need to include Content-Type in Angular 4 */
            //headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            return this._http.post(`http://localhost:8080/paintingApis/addUserPaintingImage`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
            /* .subscribe(
                data => console.log('success'),
                error => console.log(error)
            ) */
        }
    }

    changeImagePublicStatus(userImage) {
        //this.requestBody = { "id": id };
        return this._http.post("http://localhost:8080/paintingApis/changeImagePublicStatus", userImage, this.options)
            .map((response: Response) => response.json());
    }
}