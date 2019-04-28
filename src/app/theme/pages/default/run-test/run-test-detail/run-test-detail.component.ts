import { Message } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-run-test-detail',
    templateUrl: './run-test-detail.component.html',
    styleUrls: ['./run-test-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RunTestDetailComponent implements OnInit {
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
    ) {
        this.tokenUser = localStorage.getItem('user_token');
    }

    ngOnInit() {
    }

    goRunTest() {
        this.disableBtn = true;
        this.router.navigate(['/run-test']);
    }

}
