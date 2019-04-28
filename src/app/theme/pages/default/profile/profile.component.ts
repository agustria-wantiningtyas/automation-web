import { Message } from 'primeng/primeng';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { GeneralService } from '../../../../_services/general.service';


@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
    public post$: Subscription;
    // initialization
    public arrData: any;
    public tokenUser: any;
    public myForm: any = null;
    msgs: Message[] = [];

    oldPassword: any;
    newPassword: any;
    retypeNewPassword: any;
    passMsg: any;
    public validate: any = false;
    public validateRetype: any = true;
    dataUser: string;

    constructor(
        public router: Router,
        public http: HttpClient,
        public fb: FormBuilder,
        private _generalService: GeneralService
    ) {
        this.tokenUser = localStorage.getItem('user_token');
        this.dataUser = JSON.parse(localStorage.getItem('user_data'));

        this.myForm = fb.group({
            'setOldPassword': ['', Validators.compose([Validators.required])],
            'setNewPassword': ['', Validators.compose([Validators.required])],
            'setRetypeNewPassword': ['', Validators.compose([Validators.required])]
        });

    }
    ngOnInit() {
        this.loadProfile();
    }

    checkPwd() {
        if (this.newPassword.length < 8) {
            return ("Password must contain 8 character");
        } else if (this.newPassword.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\?]/) != -1) {
            return ("Space and some special character not allowed!");
        } else if (this.newPassword.search(/\d/) == -1) {
            return ("Password must contain numbers!");
        } else if (this.newPassword.search(/[a-zA-Z]/) == -1) {
            return ("Password must contain letters!");
        } else if (this.newPassword.search(/[!\@\#\$\%\^\&\*\(\)\_\+\?]/) == -1) {
            return ("Password must contain !@#$%^&*()_+?");
        } else if (this.newPassword.length > 16) {
            return ("Password must be less than 16 character!");
        } else {
            return ("ok");
        }
    }

    checkPass() {
        this.passMsg = this.checkPwd();
        if (this.passMsg == "ok") {
            document.getElementById('passwordMsgId').style.visibility = "hidden";
            this.validateRetype = false;
        } else {
            document.getElementById('passwordMsgId').style.visibility = "visible";
            document.getElementById('passwordMsgId').style.color = "#f44242";
            this.validateRetype = true;
        }
    }

    validateNewPassword() {
        if (this.newPassword == this.retypeNewPassword) {
            return true;
        } else {
            return false;
        }
    }

    changePassword(value) {
        if (this.validate = this.validateNewPassword()) {
            const content = {
                urlName: 'changepassword',
                body: {
                    token: this.tokenUser,
                    oldPassword: value.setOldPassword,
                    newPassword: value.setNewPassword,
                }
            }

            this.post$ = this._generalService.getData(content).subscribe(
                result => {
                    if (result['response_code'] === 200) {
                        if (result['message'] == 'success') {
                            // Success Change Password
                            this.msgs = [{ severity: 'success', summary: 'Success', detail: result['message'] + " change password" }];
                            this.oldPassword = '';
                            this.newPassword = '';
                            this.retypeNewPassword = '';
                        } else {
                            // Wrong Password
                            this.msgs = [{ severity: 'warn', summary: 'Warning', detail: result['message'] }];
                        }
                    } else {
                        // Fail Change Password
                        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'error occur..' }];
                        console.log('failed');
                    }
                });
        } else {
            this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'New Password and Retype must equals!' }];
        }
    }

    loadProfile() {

        const content = {
            urlName: 'employee/show',
            body: {
                token: this.tokenUser,
                id: this.dataUser['user_id']
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            val => {
                this.arrData = val['data'];
            });
    }

    goHome() {
        this.router.navigate(['/index']);
    }
}