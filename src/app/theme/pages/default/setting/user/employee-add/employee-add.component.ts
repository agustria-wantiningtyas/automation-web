import { Message } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../../../../../_services/general.service';
import { Helpers } from '../../../../../../helpers';

@Component({
    selector: 'app-employee-add',
    templateUrl: './employee-add.component.html',
    styleUrls: ['./employee-add.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmployeeAddComponent implements OnInit {
    public post$: Subscription;
    public msgs: Message[] = [];
    public tokenUser: any;
    public myForm: any = null;
    public disableBtn: boolean = false;
    gender: { label: string; value: string; }[];
    isGender: string;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private _generalService: GeneralService
    ) {
        this.tokenUser = localStorage.getItem('user_token');

        this.myForm = fb.group({
            'setName': ['', Validators.compose([Validators.required])],
            'setGender': ['', Validators.compose([Validators.required])],
            'setEmail': ['', Validators.compose([Validators.required, Validators.email])],
            'setNoTelp': ['', Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
    }

    doAdd(data) {
        Helpers.setLoading(true);
        this.disableBtn = true;

        if (data.setGender == 0) {
            this.isGender = 'M';
        } else {
            this.isGender = 'F';
        }
        const content = {
            urlName: 'employee/store',
            body: {
                token: this.tokenUser,
                name: data.setName,
                email: data.setEmail,
                gender: this.isGender,
                no_telp: data.setNoTelp,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            _result => {
                Helpers.setLoading(false);
                this.disableBtn = false;

                if (_result['response_code'] == 200) {
                    this.goEmployee();
                } else {
                    this.msgs = [{ severity: 'warn', summary: 'Warning!', detail: _result['message_detail'] }];
                }
            });
    }



    goEmployee() {
        this.disableBtn = true;
        this.router.navigate(['/master-data/employee']);
    }

}
