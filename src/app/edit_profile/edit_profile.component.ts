import { Component, EventEmitter, OnInit ,Input} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditService } from './edit_profile.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

declare var jQuery: any;

@Component({
    selector: 'edit-form',
    templateUrl: './edit_profile.component.html',
    styleUrls: ['./edit_profile.component.css'],
    providers: [EditService]
})


export class EditProfileComponent implements OnInit {

    /* Inputs user data to initialize form values */
    @Input() userData;
    
    editProfDialog = true;

    /* Edit user form Model */
    editProfForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, this.validateEmail]),
        phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl(''),
        userDetails: new FormControl('', Validators.required)
    }); 

    /* Validation for email pattern. */
    validateEmail(c: FormControl) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        return EMAIL_REGEXP.test(c.value) ? null : {
            validateEmail: {
                valid: false
            }
        };
    }

    countries; // Holds List of Countries

    userId; // Holds Logged in user id


    constructor(private editService: EditService, private cookieService: CookieService) { }

    ngOnInit() {
        console.log("userData: "+JSON.stringify(this.userData));
        // get countries from API to populate on form. 
        this.editService.getCountries()
            .subscribe(loginResponse => {
                this.countries = loginResponse;
                console.log("Countries: " + JSON.stringify(this.countries));
            });

            this.userId = this.cookieService.get("uid");
    

            

            //jQuery("#country").selectmenu("refresh");
        
    }

    editFormData; // Holds edit form data. 
    editError = false; // True if request to user edit is successful else False.
    editErrorText: string; // Holds the user edit request error text to be displayed on error.
    onSubmitEdit() {
        this.editFormData = this.editProfForm.value;
        this.editFormData.id = this.userId; // adding user id form data.
        console.log(this.editFormData);
        this.editService.userEdit(this.editFormData)
            .subscribe(loginResponse => {
                //this.loginData = loginResponse; 
                //console.log("Service message: " + JSON.stringify(this.loginData)); 
                if (loginResponse.success == "1") {
                    jQuery("#loginDialog").modal('hide');
                    this.editError = false;
                    window.location.reload();
                } else {
                    this.editError = true;
                    this.editErrorText = loginResponse.message;
                }
            });
    }

}