import { Message } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

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
    public path_url: any;
    urlSafe: SafeResourceUrl;
    constructor(
        public fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        public sanitizer: DomSanitizer
    ) {
        this.tokenUser = localStorage.getItem('user_token');
        this.path_url = atob(this.route.snapshot.paramMap.get('str'));
    }

    ngOnInit() {
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.path_url);
    }

    goRunTest() {
        this.disableBtn = true;
        this.router.navigate(['/run-test']);
    }

}
