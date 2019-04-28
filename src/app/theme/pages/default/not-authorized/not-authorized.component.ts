import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: '.m-wrapper',
    templateUrl: './not-authorized.component.html',
    styleUrls: ['./not-authorized.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NotAuthorizedComponent implements OnInit {
    dataUser: any;

    constructor(
        public router: Router
    ) {
        this.dataUser = JSON.parse(localStorage.getItem('dataUser'));
    }

    ngOnInit() {
    }

    goHome() {
        this.router.navigate([this.dataUser.wms_default_menu]);
    }

    goBack() {
        window.history.back();
    }
}