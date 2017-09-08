import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule} from '@angular/http';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { LoginFormComponent} from './login/login.component';
import { UserProfileComponent } from './user_profile/user_profile.component'
import { HomeComponent} from './home/home.component';
import { EditProfileComponent } from './edit_profile/edit_profile.component';
import { SecurePipe } from './home/secure.pipe';


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
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
