import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core'
import { UserProfileService } from './user_profile.service'
import { LoginService } from '../home/home.service';



@Component({
    selector: 'user-profile',
    templateUrl: './user_profile.component.html',
    styleUrls: ['./user_profile.component.css'],
    providers: [UserProfileService,LoginService]
})

export class UserProfileComponent implements OnInit {

    profileImageUrl = "getProfileImage?path=";
    
    paintingImageUrl = "getPaintings?path=";

    /* @userId
    *  Holds user id of selected user.
    */
    userId: any;

    /* @loggedInUserId
    *  Holds user id of logged in user.
    */
    loggedInUserId: any;

    /* @userImages
    *  Holds List of paintings of selected user.
    */
    userImages: any;

    /* @userData
    *  Holds User data to be diplayed on profile page.
    */
    userData;


    /*  @isMyProfile
    *   True -> " User selected and user logged in are same. 
    *                Makes all the admin controls visible. "
    *   False -> " User selected and user logged in are diffrent. 
    *                Makes all the admin controls Hidden. "
    */
    isMyProfile = false;

    /*  @loginBtnVisibility 
    *   Value based on login status to set login/sign in button visibility.
    */
    loginBtnVisibility = true;

    /*  @loginStatus
    *   Holds login status (0 -> "Logged Out",1-> "Logged In" ) 
    */
    loginStatus;

    constructor(private userProfileService: UserProfileService, private cookieService: CookieService) { }

    ngOnInit() {

        this.loginStatus = this.cookieService.get("login");

        console.log("loginStatus: " + this.loginStatus);

        if (this.loginStatus == "1")
            this.loginBtnVisibility = false;

        else
            this.loginBtnVisibility = true;

        this.userId = this.cookieService.get("selected_uid");

        this.loggedInUserId = this.cookieService.get("uid");

        console.log("selected user ID: " + this.userId + " loggedInUserId: " + this.loggedInUserId);

        if (this.userId == this.loggedInUserId && !this.loginBtnVisibility) {
            this.isMyProfile = true;
            console.log("true my profile");
        } else {
            this.isMyProfile = false;
            console.log("false my profile");
        }

        /* Request all user details from API to populate user details on profile page. */
        this.userProfileService.getUserDetails(this.userId).subscribe(userData => {
            this.userData = userData;
            console.log("user Data: " + JSON.stringify(this.userData));
        });

        /* Request all the user paintings to be displayed under user details */
        this.userProfileService.getUserImages(this.userId, this.isMyProfile).subscribe(userData => {
            this.userImages = userData.userImages;
            console.log("user Data: " + JSON.stringify(this.userImages));
        });
    }

    /* Function called on change of file selected to upload profile image. */
    onSelectProfImage(event) {
        let fileList: FileList = event.target.files;
        console.log("fileList: " + fileList);
        this.userId = this.cookieService.get("selected_uid");
        this.userProfileService.uploadProfilePicture(this.userId, fileList).subscribe(userData => {
            //this.userImages = userData.userImages;
            console.log("user Data: " + JSON.stringify(userData));
            window.location.reload();
        },
            error => console.log(error)
        );


    }

    /* Function called on change of file selected to upload user painting. */
    onSelectPaintingImage(event) {
        let fileList: FileList = event.target.files;
        console.log("fileList: " + fileList);
        this.userId = this.cookieService.get("username");
        this.userProfileService.uploadPainting(this.userId, fileList).subscribe(userData => {
            //this.userImages = userData.userImages;
            console.log("user Data: " + JSON.stringify(userData));
            window.location.reload();
        },
            error => console.log(error)
        );


    }

    /* Function called on change of checkbox to make Image status public or private. */
    onPublicStatusChange(event, userImage) {
        console.log("checkbox change event userImage: " + JSON.stringify(userImage));

        /* updates the object based on checkes status.
        *  Checked -> publicStatus = 1
        *  Checked -> publicStatus = 0
        */
        if (event.target.checked) {
            userImage.publicStatus = "1";
        } else {
            userImage.publicStatus = "0";
        }

        console.log("checkbox change event userImage: " + JSON.stringify(userImage));

        /* Request to change image status */
        this.userProfileService.changeImagePublicStatus(userImage).subscribe(sucess => {
            console.log("user Data: " + JSON.stringify(sucess));
        },
            error => console.log("error: " + error)

        );

    }

    /* Logout on click of logout button. 
    *  It clears the cookie data and changes the login status to "0" 
    */
    onClickLogOut() {
        this.cookieService.put("login", "0");
        this.cookieService.put("username", "");
        this.cookieService.put("uid", "");
        window.location.reload();
    }

}