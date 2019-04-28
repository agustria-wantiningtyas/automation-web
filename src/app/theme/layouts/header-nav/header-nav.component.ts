import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Config } from './../../../components/api-config';
import { GeneralService } from '../../../_services/general.service';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    styleUrls: ['./header-nav.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
    // initialization
    public arrData: any;
    public arrCus: any = [];
    public dataUser: any;
    public roleUser: any;
    public objCus: any;

    constructor(
        public router: Router,
        public http: HttpClient,
        public _generalService: GeneralService
    ) {
        this.dataUser = JSON.parse(localStorage.getItem('user_data'));
    }
    ngOnInit() {
        this.loadProfile();
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

    loadProfile() {
        const body = {
            token: this.dataUser['token'],
            id: this.dataUser['emp_id']
        }
        this.http.post(Config.apiUrl + 'employee/show', body).subscribe((val) => {
            this.arrData = val['data'];
        });
    }

}