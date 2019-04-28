import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../../../../../_services/general.service';
import { Helpers } from '../../../../../../helpers';

@Component({
    selector: 'app-employee-edit',
    templateUrl: './employee-edit.component.html',
    styleUrls: ['./employee-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmployeeEditComponent implements OnInit {
    public post$: Subscription;

    public tokenUser: any;
    public myForm: any = null;

    public id: any;
    disableBtn: boolean = false;
    name: any;
    gender: any;
    no_telp: any;
    email: any;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
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
        Helpers.setLoading(true);
        this.disableBtn = true;

        this.id = this.route.snapshot.paramMap.get('id');
        this.loadDataEdit(this.id);
    }

    loadDataEdit(id) {
        const content = {
            urlName: 'employee/show',
            body: {
                token: this.tokenUser,
                id: id
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            result => {
                if (result['response_code'] === 200) {
                    this.name = result['data'].name;
                    this.gender = result['data'].gender == 'M' ? 0 : 1;
                    this.email = result['data'].email;
                    this.no_telp = result['data'].no_telp;

                    setTimeout(() => {
                        Helpers.setLoading(false);
                        this.disableBtn = false;
                    }, 1000);

                }
            });
    }

    doUpdate(data) {
        Helpers.setLoading(true);
        this.disableBtn = true;

        const content = {
            urlName: 'employee/update',
            body: {
                token: this.tokenUser,
                id: this.id,
                name: data.setName,
                gender: data.setGender == 0 ? 'M' : 'F',
                email: data.setEmail,
                no_telp: data.setNoTelp,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            result => {
                if (result) {
                    this.goEmployee();
                }
            });
    }



    goEmployee() {
        this.disableBtn = true;
        this.router.navigate(['/master-data/employee']);
    }

}
