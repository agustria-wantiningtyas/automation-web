import { Message } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../../../../../_services/general.service';
import { Helpers } from '../../../../../../helpers';

@Component({
    selector: 'app-feature-add',
    templateUrl: './feature-add.component.html',
    styleUrls: ['./feature-add.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeatureAddComponent implements OnInit {
    public post$: Subscription;
    public msgs: Message[] = [];
    public tokenUser: any;
    public myForm: any = null;
    public disableBtn: boolean = false;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private _generalService: GeneralService
    ) {
        this.tokenUser = localStorage.getItem('user_token');

        this.myForm = fb.group({
            'setFeatureName': ['', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
    }

    doAdd(data) {
        Helpers.setLoading(true);
        this.disableBtn = true;

        const content = {
            urlName: 'feature/store',
            body: {
                token: this.tokenUser,
                feature_name: data.setFeatureName,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            _result => {
                Helpers.setLoading(false);
                this.disableBtn = false;

                if (_result['response_code'] == 200) {
                    this.goFeature();
                } else {
                    this.msgs = [{ severity: 'warn', summary: 'Warning!', detail: _result['message_detail'] }];
                }
            });
    }



    goFeature() {
        this.disableBtn = true;
        this.router.navigate(['/setting/feature']);
    }

}
