import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../../../../../_services/general.service';
import { Helpers } from '../../../../../../helpers';

@Component({
    selector: 'app-feature-edit',
    templateUrl: './feature-edit.component.html',
    styleUrls: ['./feature-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeatureEditComponent implements OnInit {
    public post$: Subscription;

    public tokenUser: any;
    public myForm: any = null;

    public id: any;
    disableBtn: boolean = false;
    feature_name: any;
    status: any;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        private _generalService: GeneralService
    ) {
        this.tokenUser = localStorage.getItem('user_token');

        this.myForm = fb.group({
            'setFeatureName': ['', Validators.compose([Validators.required])],
            'setStatus': ['', Validators.compose([Validators.required])]
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
            urlName: 'feature/show',
            body: {
                token: this.tokenUser,
                id: id
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            result => {
                if (result['response_code'] === 200) {
                    this.feature_name = result['data'].name;
                    this.status = result['data'].status;

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
            urlName: 'feature/update',
            body: {
                token: this.tokenUser,
                id: this.id,
                name: data.setFeatureName,
                status: data.setStatus,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            result => {
                if (result) {
                    this.goFeature();
                }
            });
    }



    goFeature() {
        this.disableBtn = true;
        this.router.navigate(['/setting/feature']);
    }

}
