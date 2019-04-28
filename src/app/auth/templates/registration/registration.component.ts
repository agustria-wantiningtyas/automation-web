import { GeneralService } from './../../../_services/general.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Subscription } from 'rxjs';
import { AlertComponent } from './../../_directives/alert.component';
import { Helpers } from '../../../helpers';

declare let $: any;
declare let mUtil: any;

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
    private baseUrl: string = 'https://elabramdev.com/wms-api-ktm/api/';
    // private baseUrl: string = 'http://localhost:8000/api/';
    public post$: Subscription;
    model: any = {};
    returnUrl: any;
    tokenUser: string;
    msgs: Message[] = [];
    leave_type: any = [];
    dataUser: any;
    regisValid: boolean = true;
    passMsg: string;
    dialogTitle: any;
    dialogStyle: any;
    display: boolean = false;
    displayLoginAs: boolean = false;
    displayDialogError: boolean = false;
    loading = false;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        public http: HttpClient,
        public _generalService: GeneralService,
        private cfr: ComponentFactoryResolver,

    ) {
        this.tokenUser = localStorage.getItem('tokenUser');
        if (this.tokenUser != null) {
            this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
            this._router.navigate([this.returnUrl]);
        }
    }

    ngOnInit() {
    }

    registerValidation() {
        if (this.model.company == '' || this.model.company == null) {
            this.regisValid = true;
        } else if (this.model.admin == '' || this.model.admin == null) {
            this.regisValid = true;
        } else if (this.model.email == '' || this.model.email == null) {
            this.regisValid = true;
        } else if (this.model.reg_password == '' || this.model.reg_password == null) {
            this.regisValid = true;
        } else {
            this.passMsg = this.checkPwd(this.model.reg_password);
            if (this.validateEmail()) {
                if (this.passMsg == "ok") {
                    this.passMsg = '';
                    document.getElementById('passwordMsgId').style.visibility = "hidden";
                    this.regisValid = false;
                } else {
                    document.getElementById('passwordMsgId').style.visibility = "visible";
                    document.getElementById('passwordMsgId').style.color = "#f44242";
                    this.regisValid = true;
                }
            } else {
                this.regisValid = true;
                if (this.passMsg == "ok") {
                    this.passMsg = '';
                }
            }
        }
    }

    registrater() {
        Helpers.setLoading(true);
        const body = {
            company_name: this.model.company,
            admin_name: this.model.admin,
            email: this.model.email,
            password: this.model.reg_password
        }
        this.http.post(this.baseUrl + 'registration', body).subscribe(
            result => {
                Helpers.setLoading(false);

                if (result['response_code'] === 200) {
                    this.msgs = [{ severity: 'success', summary: result['message'], detail: result['message_detail'] }];
                    setTimeout(() => {
                        this._router.navigate(['/index']);
                    }, 3500);
                } else {
                    this.msgs = [{ severity: 'warn', summary: result['message'], detail: result['message_detail'] }];
                }

            }, error => {
                Helpers.setLoading(false);
                this.msgs = [{ severity: 'error', summary: error.name, detail: error.message }];
            });
    }

    checkPwd(paswd) {
        if (paswd.length < 8) {
            return ("Password must contain 8 character");
        } else if (paswd.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\?]/) != -1) {
            return ("Space and some special character not allowed!");
        } else if (paswd.search(/\d/) == -1) {
            return ("Password must contain numbers!");
        } else if (paswd.search(/[a-zA-Z]/) == -1) {
            return ("Password must contain letters!");
        } else if (paswd.search(/[!\@\#\$\%\^\&\*\(\)\_\+\?]/) == -1) {
            return ("Password must contain !@#$%^&*()_+?");
        } else if (paswd.length > 16) {
            return ("Password must be less than 16 character!");
        } else {
            return ("ok");
        }
    }

    validateEmail() {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.model.email);
    }

    displaySignInForm() {
        this.hideDialog();
        if (this.dialogTitle != "Company Registration") {
            let login = document.getElementById('m_login');
            mUtil.removeClass(login, 'm-login--forget-password');
            mUtil.removeClass(login, 'm-login--signup');
            mUtil.removeClass(login, 'm-login--code-verification');
            mUtil.removeClass(login, 'm-login--new-password');
            mUtil.removeClass(login, 'm-login--company-registration');

            try {
                $('form').data('validator').resetForm();
            } catch (e) {
            }

            mUtil.addClass(login, 'm-login--signin');
            mUtil.animateClass(login.getElementsByClassName('m-login__signin')[0], 'flipInX animated');
        }
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    showDialog() {
        this.display = true;
    }

    hideDialog() {
        this.display = false;
    }

    loginPage() {
        this._router.navigate(['/index']);
    }
}
