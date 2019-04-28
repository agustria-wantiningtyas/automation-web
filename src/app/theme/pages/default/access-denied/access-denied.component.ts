import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: '.m-wrapper',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AccessDeniedComponent implements OnInit {
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