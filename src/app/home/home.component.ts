import { Component, OnInit } from '@angular/core';

import { CookieService } from 'angular2-cookie/core';
import { LoginService } from './home.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LoginService]
})
export class HomeComponent implements OnInit {

  /* Holds url for profile image. */
  profileImageUrl = "getProfileImage?path=";

  /* Title of the application. */
  title = 'PaintIt';

  /* Visibility of sign in / logout buttons. */
  loginBtnVisibility = true;

  /* Holds current login status of application.
  *  '0' => guest user
  *  '1' => logged in user
  */
  loginStatus = '0';

  constructor(private loginService: LoginService, private _cookieService: CookieService) { }

  /* Holds list of users present for this application. */
  users;

  ngOnInit() {
    //console.log("In onInit");
    /* Initialize home page with all the users. */
    this.loginService.getAllUsers()
      .subscribe(users => {
        this.users = users;
        console.log("Users: " + JSON.stringify(this.users))
      }
      );

    /* Initialize cookie with login status. */
    this.loginStatus = this._cookieService.get("login");

    //console.log("loginStatus: " + this.loginStatus);

    /* Set "sign in"/"logout" button visibility.*/
    if (this.loginStatus == "1")
      this.loginBtnVisibility = false;

    else
      this.loginBtnVisibility = true;

  }

  /* Fuction to be called on logout button click. */
  onClickLogOut() {
    /* Clear all the cookie then reloads the page. */
    this._cookieService.put("login", "0");
    this._cookieService.put("username", "");
    this._cookieService.put("uid", "");
    window.location.reload();
  }

  /* Funtion to be called on click of user image. */
  onClickUserImage(userId) {
    //console.log("userId: " + userId);
    /* Set selected user ID in cookie for future reference. */
    this._cookieService.put("selected_uid", userId);
  }

}
