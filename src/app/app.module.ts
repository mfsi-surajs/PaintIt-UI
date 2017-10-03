import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';


import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { LoginFormComponent} from './login/login.component';
import { UserProfileComponent } from './user_profile/user_profile.component'
import { HomeComponent} from './home/home.component';
import { EditProfileComponent } from './edit_profile/edit_profile.component';
import { SecurePipe } from './home/secure.pipe';
import { HttpInterceptor } from './http.interceptor';
import {httpFactory} from "./http.factory";
import {NotifyService} from './loader.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    UserProfileComponent,
    HomeComponent,
    EditProfileComponent,
    SecurePipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'',redirectTo: '/home', pathMatch: 'full'},
      {path:'home',component: HomeComponent,},
      {path:'profile',component: UserProfileComponent}
      
    ])
  ],
  providers: [
    CookieService,
    NotifyService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [ XHRBackend, RequestOptions, NotifyService]
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
