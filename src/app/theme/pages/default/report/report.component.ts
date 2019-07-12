import { ExcelService } from '../../../../_services/excel.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DataTable, Message, ConfirmationService, LazyLoadEvent } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Config } from './../../../../components/api-config';

import { GeneralService } from '../../../../_services/general.service';
import { TransferService } from '../../../../_services/transfer.service';
import * as moment from 'moment';
import { Validators, FormBuilder } from '@angular/forms';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

type AOA = any[][];
@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild('fileInput') fileInput: ElementRef;
    public tokenUser: any;
    msgs: Message[] = [];
    public data: any = [];
    public arrFeature: any = [];
    public feature: any = [];

    // refresh filter
    post$: Subscription;
    public filters: any;

    // pagination
    public start_ta = 0;
    public limit_ta = 5;
    public rows = 5;
    public pageLinks = 3;
    public rowsPerPageOptions: any = [5, 10, 20];
    public stop_ta = false;
    public order_ta: any = 'id';
    public sortOrder: any = 'DESC'
    public loading = true;
    totalRecords: any;
    public user_role: any = 2;

    roleUser: any = false;
    no: any = 1;
    ls_cus_id: any;
    cusId: any;
    dataUser: any;
    ExportTitle: string;
    ExportName: string;
    tmpAttData: any[];
    dialog: boolean;
    modalTitle: string;
    styleClass: string;
    modalStyle: { 'min-width': string; 'max-width': string; 'min-height': string; 'max-height': string; };
    isFile: boolean;
    loading_import: boolean;
    //xls
    dataXLS: AOA = [[1, 2], [3, 4]];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    linkDownload: any;
    arrDataXLS: any = [];
    validationFail: boolean = false;
    headerTmpAttData: any[];
    startCellData: any;
    attData: any[];
    selectedFile: File;
    fileName: any;
    isGender: string;
    label: string;
    gender_filter: any = [];
    public genderFilter: any;
    nameFilter: any;
    emailFilter: any;
    noTelephoneFilter: any;
    is_preview: boolean = false;
    is_pdf: boolean = false;
    is_month: any = [];
    is_year: any = [];
    is_selected_month: any;
    is_selected_year: any;
    today: any;

    public myForm: any = null;
    config: ExportAsConfig = {
        type: 'pdf', // the type you want to download
        elementId: 'mytable', // the id of html/table element
    }
    _month: string;
    public arrData: any;

    constructor(
        public router: Router,
        public http: HttpClient,
        public confirmationService: ConfirmationService,
        public _generalService: GeneralService,
        private excelService: ExcelService,
        public _transferService: TransferService,
        public fb: FormBuilder,
        private exportAsService: ExportAsService

    ) {
        moment.locale('id');
        this.today = moment().format("DD MMMM YYYY");
        this.myForm = fb.group({
            'selectedMonth': ['', Validators.compose([Validators.required])],
            'selectedYear': ['', Validators.compose([Validators.required])],
        });

        this.tokenUser = localStorage.getItem('user_token');
        this.dataUser = JSON.parse(localStorage.getItem('user_data'));
    }

    ngOnInit() {
        this.is_month = [
            {
                value: 1,
                label: 'Januari',
            }, {
                value: 2,
                label: 'Februari',
            }, {
                value: 3,
                label: 'Maret',
            }, {
                value: 4,
                label: 'April',
            }, {
                value: 5,
                label: 'Mei',
            }, {
                value: 6,
                label: 'Juni',
            }, {
                value: 7,
                label: 'Juli',
            }, {
                value: 8,
                label: 'Agustus',
            }, {
                value: 9,
                label: 'Sepetember',
            }, {
                value: 10,
                label: 'October',
            }, {
                value: 11,
                label: 'November',
            }, {
                value: 12,
                label: 'Desember',
            }
        ];

        for (let i = 2015; i <= parseInt(moment().format('YYYY')); i++) {
            this.is_year.push(
                {
                    value: i,
                    label: i,
                }
            );
        };

        this.is_year.sort();
        this.is_year.reverse();
        this.loadProfile();

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

    export() {
        // download the file using old school javascript method
        this.exportAsService.save(this.config, 'report').subscribe(() => {
            // save started
            // this.is_pdf = true;
        });
        // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
        // this.exportAsService.get(this.config).subscribe(content => {
        //     console.log(content);
        // });
    }

    /* Begin index list */
    loadFeature(event) {
        // this.loading = true;
        const content = {
            urlName: 'report/index',
            body: {
                token: this.tokenUser,
                limit: this.limit_ta,
                skip: this.start_ta,
                order: this.order_ta,
                sortOrder: this.sortOrder,
                filters: this.filters,
                month: this.is_selected_month,
                year: this.is_selected_year
            }
        }

        setTimeout(() => {
            this.post$ = this._generalService.getData(content).subscribe(
                result => {
                    this.loading = false;
                    this.data = result['data'];

                    this.totalRecords = result['totalRecords'];
                    this.is_preview = true;
                    if (this.data.length !== 0) {

                        // data
                        this.arrFeature = [];

                        if (event === '') {
                            // this.arrFeature = this.data;
                            for (const item of this.data) {

                                this.arrFeature.push({
                                    id: item.id,
                                    name: item.name,
                                    created_at: moment(item.created_at).format("DD MMMM YYYY  HH:mm:ss"),
                                });
                            }
                        } else {
                            for (const item of this.data) {
                                this.arrFeature.push({
                                    id: item.id,
                                    name: item.name,
                                    created_at: moment(item.created_at).format("DD MMMM YYYY  HH:mm:ss"),
                                });
                            }
                            this.arrFeature = this.arrFeature.slice(0, this.rows);

                        }

                    } else {
                        this.arrFeature = [];
                    }
                }
            );
        }, 500);

        this.feature = [
            { field: 'name', header: 'Test Case', style: { width: '110px', 'text-align': 'left' }, filter: false, filterMatchMode: 'contains', sortable: true },
            { field: 'created_at', header: 'Date', style: { width: '110px', 'text-align': 'left' }, filter: false, filterMatchMode: 'contains', sortable: true },
        ];

    }

    loadTaskLazy(event: LazyLoadEvent) {
        // loading
        this.loading = true;

        this.start_ta = event.first;
        this.limit_ta = (event.first + event.rows);
        this.rows = event.rows;
        this.filters = event.filters;


        if (event.sortField) {
            this.order_ta = event.sortField;
        }
        if (event.sortOrder === 1) {
            this.sortOrder = 'DESC';
        } else {
            this.sortOrder = 'ASC'
        }

        this.loadFeature(event);

        setTimeout(() => {
            if (this.arrFeature) {
                this.arrFeature = this.arrFeature.slice(this.start_ta, this.limit_ta);
            }
        }, 250);
    }
    /* End index list */

    mapIdle() {
        console.log('idle');
    }

    // Export Spreadsheet
    doExport(data) {
        var d = new Date(data.selectedMonth + '/01/2019');
        var month = new Array();
        month[0] = "Januari";
        month[1] = "Februari";
        month[2] = "Maret";
        month[3] = "April";
        month[4] = "Mei";
        month[5] = "Juni";
        month[6] = "Juli";
        month[7] = "Agustus";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "Desember";
        var n = month[d.getMonth()];

        const content = {
            urlName: 'report/index',
            body: {
                token: this.tokenUser,
                order: this.order_ta,
                sortOrder: this.sortOrder,
                month: data.selectedMonth,
                year: data.selectedYear
            }

        }

        setTimeout(() => {
            this.post$ = this._generalService.getData(content).subscribe(
                result => {
                    this.tmpAttData = [];
                    this.ExportTitle = 'Laporan Pengujian Otomatis Periode ' + n + ' ' + data.selectedYear;
                    this.ExportName = 'report_test_case';
                    this.headerTmpAttData = [];
                    this.headerTmpAttData.push(
                        {
                            A: this.ExportTitle
                        }, {
                            A: ''
                        }
                    );

                    if (result['response_code'] === 200) {
                        for (let i = 0; i < result['data'].length; i++) {
                            this.tmpAttData.push({
                                'No': i + 1,
                                'Nama Pengujian': result['data'][i].name,
                                'Tanggal Pengujian': result['data'][i].created_at,
                            });
                        }
                        this.startCellData = this.headerTmpAttData.length;
                        this.excelService.exportAsExcelFile(this.startCellData, this.headerTmpAttData, this.tmpAttData, this.ExportName);
                        this.msgs = [{ severity: 'success', summary: 'Downloading..', detail: this.ExportTitle }];
                    } else {
                        this.msgs = [{ severity: 'error', summary: 'Error Occured..!', detail: 'Cannot Export to Spreadsheet File!' }];
                    }
                }
            );
        }, 500);
    }

    confirmDelete(employee) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                const content = {
                    urlName: 'employee/delete',
                    body: {
                        token: this.tokenUser,
                        id: employee.id
                    }
                }

                this.post$ = this._generalService.getData(content).subscribe(
                    _result => {
                        this.loadFeature('');
                        this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Record deleted' }];
                    });
            },
            reject: () => {
                this.msgs = [{ severity: 'error', summary: 'Canceled', detail: 'Canceled' }];
            }
        });
    }

    doPreview(data) {
        this.is_selected_month = data.selectedMonth,
            this.is_selected_year = data.selectedYear
        if (data.selectedMonth == 1) {
            this._month = "Januari";
        }
        if (data.selectedMonth == 2) {
            this._month = "Februari";
        }
        if (data.selectedMonth == 3) {
            this._month = "Maret";
        }
        if (data.selectedMonth == 4) {
            this._month = "April";
        }
        if (data.selectedMonth == 5) {
            this._month = "Mei";
        }
        if (data.selectedMonth == 6) {
            this._month = "Juni";
        }
        if (data.selectedMonth == 7) {
            this._month = "Juli";
        }
        if (data.selectedMonth == 8) {
            this._month = "Agustus";
        }
        if (data.selectedMonth == 9) {
            this._month = "September";
        }
        if (data.selectedMonth == 10) {
            this._month = "October";
        }
        if (data.selectedMonth == 11) {
            this._month = "November";
        }
        if (data.selectedMonth == 12) {
            this._month = "Desember";
        }
        this.loadFeature('');
    }

    goEdit(feature) {
        this.router.navigate(['/setting/test-case/edit', { id: feature.id }]);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        if (this.post$) {
            this.post$.unsubscribe();
        }
    }

    doRefresh() {
        this.filters = {};
        this.genderFilter = null;
        this.nameFilter = null;
        this.emailFilter = null;
        this.noTelephoneFilter = null;
        this.dataTableComponent.reset();
        this.loadFeature('');
    }
}
