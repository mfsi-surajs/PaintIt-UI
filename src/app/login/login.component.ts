import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { User } from './user';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { Subject } from 'rxjs/Subject';

declare var jQuery: any;

declare const gapi: any;

interface IValidation {
    [key: string]: boolean;
}
/**
 * <login-form> holds both login and sign up forms.
 * 
 * @export
 * @class LoginFormComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'login-form',
    templateUrl: '../login/login.component.html',
    styleUrls: ['../login/login.component.css'],
    providers: [LoginService]
})

export class LoginFormComponent implements OnInit {

    /* @searchUsername Subject for realtime username search for new user. */
    searchUsername = new Subject<string>();

    /* @duplicateResponseValidator Subject for reponse of realtime searchUsername for new user. */
    duplicateResponseValidator = new Subject<any>();

    /* @usernameSearchData Unique Username search response. */
    usernameSearchData = { "success": "", "message": "" };

    loginFailed = false;

    /* @loginForm Login form Model. */
    loginForm = new FormGroup({
        name: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    /* @signUpForm New user Sign Up form Model. */
    signUpForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, this.validateEmail]),
        phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        username: new FormControl('', [Validators.required], this.validateUsername.bind(this)),
        password: new FormControl('', [Validators.required, this.validatePasswordStrength])
    });

    /**
     * @loginDialog sets visibility of login/sign up forms.
     * "true" -> login form hidden / sign up form visible.
     * "false" -> login form visible / sign up form hidden.
     * 
     * @memberof LoginFormComponent
     */
    loginDialog = false;

    /**
     * Function called on click of Sign Up button. Sets visiblity of forms.
     * Makes @loginDialog true.
     * 
     * @memberof LoginFormComponent
     */
    onClickSignUp() {
        this.loginDialog = true;
    }

    /**
     * Function called on click of Login button. Sets visiblity of forms.
     * Makes @loginDialog false.
     * 
     * @memberof LoginFormComponent
     */
    onClickLogIn() {
        this.loginDialog = false;
    }

    /**
     * @countries Holds list all countries requested from database.
     * 
     * @memberof LoginFormComponent
     */
    countries;

    /**
     * Function Called on Creation of an instance of LoginFormComponent.
     * 
     * @memberof LoginFormComponent
     */
    ngOnInit() {
        /* Http Request for all the countries. */
        this._loginService.getCountries()
            .subscribe(loginResponse => {
                this.countries = loginResponse;
                //console.log("Countries: " + JSON.stringify(this.countries));
            });
    }

    loginData: any = { message: "" };



    /**
     * Creates an instance of LoginFormComponent.
     * @param {LoginService} _loginService 
     * @param {CookieService} _cookieService 
     * @memberof LoginFormComponent
     */
    constructor(private _loginService: LoginService, private _cookieService: CookieService) {
        this._loginService
            .searchUsername(this.searchUsername)
            .subscribe(response => {

                this.usernameSearchData = response;
                if (response.success == 1 || response.success == "1") {
                    this.duplicateResponseValidator.next(null);
                    console.log("username response: " + JSON.stringify(response));
                } else {
                    this.duplicateResponseValidator.next({ 'validateUsername': true });
                    console.log("username response: " + JSON.stringify(response));
                }
            });

        this.searchUsername.subscribe(username => {
            console.log("test: " + username);
            (username == null || username == "") ? this.usernameSearchData.success = null : {};
        });
    }

    /**
     * Function called on submmit of login form.
     * 
     * @memberof LoginFormComponent
     */
    onSubmitLogin() {
        console.log(this.loginForm.value);
        this._loginService.userLogin(this.loginForm.value.name, this.loginForm.value.password)
            .subscribe(loginResponse => {
                this.loginData = loginResponse;
                //console.log("Service message: " + JSON.stringify(this.loginData));
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

                    this._cookieService.put("login", "0");
                    //this.loginDialog = false;
                }
            },
            error => {

            });
    }

    /* @signUpError sets visibility of error message div. */
    signUpError = false;

    /* @signUpErrorText sets the text of error message. */
    signUpErrorText: string;

    /**
     * Function called on submit of sign up form.
     * 
     * @memberof LoginFormComponent
     */
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
                } else {
                    this.signUpError = true;
                    this.signUpErrorText = loginResponse.message;
                }
            });
    }

    /**
     * Pattern validation for email.
     * 
     * @param {FormControl} c 
     * @returns 
     * @memberof LoginFormComponent
     */
    validateEmail(c: FormControl) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        return EMAIL_REGEXP.test(c.value) ? null : {
            validateEmail: {
                valid: false
            }
        };
    }

    /**
     * Validate Duplicate username.
     * 
     * @returns 
     * @memberof LoginFormComponent
     */
    validateUsername() {
        return this.duplicateResponseValidator.asObservable().first();
    }

    /**
     * Pattern validation for Password Strength.
     * 
     * @param {FormControl} c 
     * @returns 
     * @memberof LoginFormComponent
     */
    validatePasswordStrength(c: FormControl) {
        let PASS_REGEXP = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        return PASS_REGEXP.test(c.value) ? null : {
            increaseStrength: true
            /* validateEmail: {
                valid: false
            } */
        };
    }

    onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }


    public auth2: any;
    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '357590710293-rr20f3q3266v8grugjufksc89jjshmq2.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
            //this.attachSignin(document.getElementById('googleBtn'));
        });
    }



    public googleSignin() {

        console.log('I am passing signIn');

        var auth2 = gapi.auth2.getAuthInstance();
        // Sign the user in, and then retrieve their ID.
        auth2.signIn().then(() => {
        //if (auth2.isSignedIn.get()) {
            console.log(auth2.currentUser.get().getAuthResponse().id_token);
            this._loginService.googleSignIn(auth2.currentUser.get().getAuthResponse().id_token)
                .subscribe(loginResponse => {

                    console.log("result: " + JSON.stringify(loginResponse));
                    this.loginData = loginResponse;

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

                        this._cookieService.put("login", "0");
                        //this.loginDialog = false;
                    }
                },
                error => { }
                );
        });

        /* this.auth2.attachClickHandler(element, {},
            (googleUser) => {

                let profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                this._loginService.googleSignIn(googleUser.getAuthResponse().id_token)
                    .subscribe(loginResponse => {

                        console.log("result: " + JSON.stringify(loginResponse));
                        this.loginData = loginResponse;

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

                            this._cookieService.put("login", "0");
                            //this.loginDialog = false;
                        }
                    },
                    error => { }
                    );
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                //YOUR CODE HERE


            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            }
        ); */
    }

    ngAfterViewInit() {
        this.googleInit();
    }

}