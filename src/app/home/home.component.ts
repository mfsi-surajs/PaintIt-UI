import { Component, OnInit } from '@angular/core';

import { CookieService } from 'angular2-cookie/core';
import { LoginService } from './home.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LoginService]
})
export class HomeComponent implements OnInit {

  profileImageUrl = "http://localhost:8080/paintingApis/getProfileImage?path=";

  title = 'app';
  loginBtnVisibility = true;

  loginStatus = '0';

  constructor(private loginService: LoginService, private _cookieService: CookieService) { }

  users;

  ngOnInit() {
    console.log("In onInit");
    this.loginService.getAllUsers()
      .subscribe(users => {
      this.users = users;
        console.log("Users: " + JSON.stringify(this.users))
      }
      );

    this.loginStatus = this._cookieService.get("login");

    console.log("loginStatus: " + this.loginStatus);

    if (this.loginStatus == "1")
      this.loginBtnVisibility = false;

    else
      this.loginBtnVisibility = true;

  }

  onClickLogOut() {
    this._cookieService.put("login", "0");
    this._cookieService.put("username", "");
    this._cookieService.put("uid", "");
    window.location.reload();
  }

  onClickUserImage(userId) {
    console.log("userId: " + userId);
    this._cookieService.put("selected_uid", userId);
  }

}
