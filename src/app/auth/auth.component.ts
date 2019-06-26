import { Message } from 'primeng/primeng';
import { GeneralService } from './../_services/general.service';
import { Subscription } from 'rxjs/Rx';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AlertService } from './_services/alert.service';
import { AlertComponent } from './_directives/alert.component';
import { Helpers } from '../helpers';
import { HttpClient } from '@angular/common/http';
import { Config } from '../components/api-config';
import { PlatformLocation } from '@angular/common';



declare let $: any;
declare let mUtil: any;

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login.component.html',
    styleUrls: ['./templates/login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    public model: any = {};
    public loading = false;
    public returnUrl: string;
    public apiUrl: any;
    public post$: Subscription;
    public display: boolean = false;
    public msgs: Message[] = [];
    public disableBtn: boolean = false;
    token: any;
    user_data: string;
    regisValid: boolean = true;
    passMsg: string;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        public http: HttpClient,
        public _generalService: GeneralService,
        public platformLocation: PlatformLocation
    ) {
    }

    ngOnInit() {
        this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo6/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleFormSwitch();
                this.handleSignInFormSubmit();
            });
    }

    showDialog() {
        this.display = true;
    }

    hideDialog() {
        this.display = false;
    }

    signin() {
        this.loading = true;
        Helpers.setLoading(false);
        this.disableBtn = true;

        const body = {
            email: this.model.email.toLowerCase(),
            password: this.model.password
        }

        this.http.post(Config.apiUrl + 'login', body).subscribe(
            result => {
                this.loading = false;

                if (result['response_code'] === 200) {
                    this.loadMenu(result);
                } else {
                    this.showAlert('alertSignin');
                    this._alertService.error(result['message_detail']);
                    this.disableBtn = false;
                }
            }, error => {
                console.log(error);
                this.showAlert('alertSignin');
                this._alertService.error('An error occurred. Please try again later.');
                this.loading = false;
                this.disableBtn = false;
            });
    }

    loadMenu(res) {
        this.token = res['data'].token;
        this.user_data = JSON.stringify(res['data']);

        const body = {
            token: this.token
        }

        this.http.post(Config.apiUrl + 'menu/index', body).subscribe(
            result => {
                if (result['response_code'] === 200 && result['data'].length != 0) {
                    const user = {
                        id: undefined,
                        fullName: "Demo",
                        email: "demo@demo.com",
                        token: "433a3fc80dc2e9d8cbd1da6a0084b11f"
                    }

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('user_data', this.user_data);
                    localStorage.setItem('user_token', this.token);
                    localStorage.setItem('default_menu', JSON.stringify(result['data']));

                    setTimeout(() => {
                        this.loading = false;
                        //disable button sign
                        if (this.loading == false) {
                            this.disableBtn = true;
                        }
                        this._router.navigate(['/run-test']);
                        this.showAlert('alertSignin');
                    }, 1000);

                } else {
                    this.hideDialog();
                    this.showAlert('alertSignin');
                    this._alertService.error('You do not have permission to access menu. please contract your administrator/PIC for help');
                    this.loading = false;
                }
            }, error => {
                console.log(error);
                Helpers.setLoading(false);
                this.hideDialog();
                this.showAlert('alertSignin');
                this._alertService.error('An error occurred. Please try again later.');
                this.loading = false;
                this.disableBtn = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    handleSignInFormSubmit() {
        $('#m_login_signin_submit').click((e) => {
            this.loading = true;
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                this.loading = false;
                return;
            } else {
                this.loading = false;
            }
        });
    }

    handleFormSwitch() {
        document.getElementById('m_login_forget_password').addEventListener('click', (e) => {
            e.preventDefault();
            this.displayForgetPasswordForm();
        });

        document.getElementById('m_login_forget_password_cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignInForm();
        });
    }

    displaySignInForm() {
        this.hideDialog();
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--forget-password');

        try {
            $('form').data('validator').resetForm();
        } catch (e) {
        }

        mUtil.addClass(login, 'm-login--signin');
        mUtil.animateClass(login.getElementsByClassName('m-login__signin')[0], 'flipInX animated');
    }

    displayForgetPasswordForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--signin');;

        mUtil.addClass(login, 'm-login--forget-password');
        mUtil.animateClass(login.getElementsByClassName('m-login__forget-password')[0], 'flipInX animated');
    }

    registration() {
        Helpers.setLoading(true);
        const content = {
            urlName: 'employee/store',
            body: {
                name: this.model.name,
                email: this.model.email,
                password: this.model.password
            }
        }

        console.log(content);
        this.post$ = this._generalService.getData(content).subscribe(
            _result => {
                Helpers.setLoading(false);

                if (_result['response_code'] == 200) {
                    this.displaySignInForm();
                    this.showAlert('alertSignin');
                    this._alertService.success('Register successfully');
                } else {
                    this.msgs = [{ severity: 'warn', summary: 'Warning!', detail: _result['message_detail'] }];
                }
            });
    }

    registerValidation() {
        if (this.model.name == '' || this.model.name == null) {
            this.regisValid = true;
        } else if (this.model.email == '' || this.model.email == null) {
            this.regisValid = true;
        } else {
            // this.passMsg = this.checkPwd(this.model.reg_password);
            if (this.validateEmail()) {
                this.passMsg = '';
                document.getElementById('passwordMsgId').style.visibility = "hidden";
                this.regisValid = false;
            } else {
                this.regisValid = true;
                document.getElementById('passwordMsgId').style.visibility = "visible";
                document.getElementById('passwordMsgId').style.color = "#f44242";
                this.passMsg = 'Invalid email';
            }
        }
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

    togglePassword() {
        var getClass = $(".toggle-password").attr("class").split(' ').slice(-1);
        if (String(getClass) == "fa-eye-slash") {
            $(".toggle-password").removeClass("fa-eye-slash");
            $(".toggle-password").addClass("fa-eye");
        } else {
            $(".toggle-password").removeClass("fa-eye");
            $(".toggle-password").addClass("fa-eye-slash");
        }
        var getType = $(".m-login__form-input--last").attr("type");
        if (getType == "password") {
            $(".m-login__form-input--last").attr("type", "text");
        } else {
            $(".m-login__form-input--last").attr('type', "password");
        }
    }

    validateEmail() {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.model.email);
    }
}