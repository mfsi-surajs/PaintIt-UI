import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { User } from './user';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

declare var jQuery: any;

@Component({
    selector: 'login-form',
    templateUrl: '../login/login.component.html',
    styleUrls: ['../login/login.component.css'],
    providers: [LoginService]
})

export class LoginFormComponent implements OnInit {

    loginFailed = false;

    loginForm = new FormGroup({
        name: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    signUpForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, this.validateEmail]),
        phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    loginDialog = false;

    onClickSignUp() {
        this.loginDialog = true;
    }

    onClickLogIn() {
        this.loginDialog = false;
    }

    countries;

    ngOnInit() {
        this._loginService.getCountries()
            .subscribe(loginResponse => {
                this.countries = loginResponse;
                console.log("Countries: " + JSON.stringify(this.countries));
            });
    }

    loginData: any = { message: "" };

    constructor(private _loginService: LoginService, private _cookieService: CookieService) { }
    onSubmitLogin() {
        console.log(this.loginForm.value);
        this._loginService.userLogin(this.loginForm.value.name, this.loginForm.value.password)
            .subscribe(loginResponse => {
                this.loginData = loginResponse;
                console.log("Service message: " + JSON.stringify(this.loginData));
                if (this.loginData.success == "1") {
                    this.loginFailed = false;
                    // alert(this.loginData.success);

                    var expire = new Date();
                    var time = Date.now() + ((60 * 1000) * 25); // current time + 25 minutes ///
                    expire.setTime(time);

                    this._cookieService.put("login", "1", { expires: expire });
                    this._cookieService.put("username", this.loginData.user.username);
                    this._cookieService.put("uid", this.loginData.user.id);

                    jQuery("#loginDialog").modal('hide');

                    window.location.reload();


                    //this.loginDialog = true;
                } else if (this.loginData.success == "0") {
                    this.loginFailed = true;
                    //alert(this.loginData.success);
                    this._cookieService.put("login", "0");
                    //this.loginDialog = false;
                }
            },
        error =>{
            
        });
    }

    signUpError = false;
    signUpErrorText:string;
    onSubmitSignUp() {
        console.log(this.loginForm.value);
        this._loginService.userSignUp(this.signUpForm.value)
            .subscribe(loginResponse => {
                //this.loginData = loginResponse; 
                //console.log("Service message: " + JSON.stringify(this.loginData)); 
                if (loginResponse.success == "1") {
                    jQuery("#loginDialog").modal('hide');
                    this.signUpError = false;
                    window.location.reload();
                }else{
                    this.signUpError = true;
                    this.signUpErrorText= loginResponse.message;
                }
            });
    }

    validateEmail(c: FormControl) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        return EMAIL_REGEXP.test(c.value) ? null : {
            validateEmail: {
                valid: false
            }
        };
    }

    validateCountry(c: FormControl) {
        return (c.value != "") ? null : {
            validateEmail: {
                valid: false
            }
        };
    }
}