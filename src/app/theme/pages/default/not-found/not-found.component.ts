import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: '.m-wrapper',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent implements OnInit {
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