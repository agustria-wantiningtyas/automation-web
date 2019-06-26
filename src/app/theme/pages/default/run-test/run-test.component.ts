import { Helpers } from './../../../../helpers';
import { FormBuilder, Validators } from '@angular/forms';
import { ExcelService } from '../../../../_services/excel.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DataTable, Message, ConfirmationService, LazyLoadEvent } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

import { GeneralService } from '../../../../_services/general.service';
import { TransferService } from '../../../../_services/transfer.service';

type AOA = any[][];
@Component({
    selector: 'app-run-test',
    templateUrl: './run-test.component.html',
    styleUrls: ['./run-test.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RunTestComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild('fileInput') fileInput: ElementRef;
    public tokenUser: any;
    msgs: Message[] = [];
    _msgs: Message[] = []
    public data: any = [];
    public arrEmployee: any = [];
    public employee: any = [];

    // refresh filter
    post$: Subscription;
    public filters: any;

    // pagination
    public start_ta = 0;
    public limit_ta = 10;
    public rows = 10;
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
    test_case: any = [];
    public myForm: any = null;

    constructor(
        public router: Router,
        public http: HttpClient,
        public confirmationService: ConfirmationService,
        public _generalService: GeneralService,
        private excelService: ExcelService,
        public _transferService: TransferService,
        public fb: FormBuilder,


    ) {
        this.myForm = fb.group({
            'selectedCase': ['', Validators.compose([Validators.required])],
        });

        this.tokenUser = localStorage.getItem('user_token');
        this.dataUser = JSON.parse(localStorage.getItem('user_data'));
    }

    ngOnInit() {
        this.loadTestCase();
    }

    loadTestCase() {
        const content = {
            urlName: 'testCase/showByStatus',
            body: {
                token: this.tokenUser,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            result => {
                if (result['response_code'] === 200) {
                    for (const item of result['data']) {

                        this.test_case.push({
                            label: item.name,
                            value: item.id
                        });

                    }
                }
            });
    }


    /* Begin index list */
    loadEmployee(event) {
        // this.loading = true;
        const content = {
            urlName: 'run-test/index',
            body: {
                token: this.tokenUser,
                limit: this.limit_ta,
                skip: this.start_ta,
                order: this.order_ta,
                sortOrder: this.sortOrder,
                filters: this.filters
            }
        }

        setTimeout(() => {
            this.post$ = this._generalService.getData(content).subscribe(
                result => {
                    this.loading = false;
                    this.data = result['data'];

                    this.totalRecords = result['totalRecords'];
                    if (this.data.length !== 0) {
                        // data
                        this.arrEmployee = [];

                        if (event === '') {
                            // this.arrEmployee = this.data;
                            for (const item of this.data) {

                                this.arrEmployee.push({
                                    id: item.id,
                                    name: item.name,
                                    path_url: item.path_url,
                                    created_at: moment(item.created_at).format("DD MMM YYYY  HH:mm:ss"),
                                });
                            }
                        } else {
                            for (const item of this.data) {
                                this.arrEmployee.push({
                                    id: item.id,
                                    name: item.name,
                                    path_url: item.path_url,
                                    created_at: moment(item.created_at).format("DD MMM YYYY  HH:mm:ss"),
                                });
                            }
                            this.arrEmployee = this.arrEmployee.slice(0, this.rows);

                        }

                        // begin filter
                        if (this.gender_filter.length === 0) {
                            const lookup_gender = {};
                            this.gender_filter = [];
                            for (const item of this.data) {
                                const gender = item.gender;

                                if (!(gender in lookup_gender)) {
                                    lookup_gender[gender] = 1;
                                    if (gender == 'M') {
                                        this.label = 'Male'
                                    } else {
                                        this.label = 'Female'
                                    }
                                    this.gender_filter.push(
                                        {
                                            label: this.label,
                                            value: gender
                                        }
                                    );
                                }
                            }

                        }
                        // end filter

                    } else {
                        this.arrEmployee = [];
                    }
                }
            );
        }, 500);

        this.employee = [
            { field: 'name', header: 'Test Case', style: { width: '110px', 'text-align': 'left' }, filter: true, filterMatchMode: 'contains', sortable: true },
            { field: 'created_at', header: 'Date', style: { width: '110px', 'text-align': 'left' }, filter: false, filterMatchMode: 'contains', sortable: true },
            { field: 'path_url', header: 'Result', style: { width: '130px', 'text-align': 'center' }, filter: false },
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

        this.loadEmployee(event);

        setTimeout(() => {
            if (this.arrEmployee) {
                this.arrEmployee = this.arrEmployee.slice(this.start_ta, this.limit_ta);
            }
        }, 250);
    }
    /* End index list */


    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.post$.unsubscribe();
    }

    mapIdle() {
        console.log('idle');
    }

    // Export Spreadsheet
    exportCSV() {

        const content = {
            urlName: 'employee/index/export',
            body: {
                token: this.tokenUser,
                order: this.order_ta,
                sortOrder: this.sortOrder
            }
        }

        setTimeout(() => {
            this.post$ = this._generalService.getData(content).subscribe(
                result => {
                    this.tmpAttData = [];
                    this.ExportTitle = 'Master Data - Employee'
                    this.ExportName = 'employee';
                    this.headerTmpAttData = [];
                    this.headerTmpAttData.push(
                        {
                            A: this.ExportTitle
                        }, {
                            A: ''
                        }
                    );

                    if (result['response_code'] === 200) {
                        let _gender: any;
                        for (let i = 0; i < result['data'].length; i++) {
                            if (result['data'][i].gender == 'M') {
                                _gender = 'Male';
                            } else {
                                _gender = 'Female';
                            }
                            this.tmpAttData.push({
                                'No': i + 1,
                                'Name': result['data'][i].name,
                                'Gender': _gender,
                                'Email': result['data'][i].email,
                                'No Telphone': result['data'][i].no_telp
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
                        this.loadEmployee('');
                        this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Record deleted' }];
                    });
            },
            reject: () => {
                this.msgs = [{ severity: 'error', summary: 'Canceled', detail: 'Canceled' }];
            }
        });
    }

    goAdd() {
        this.router.navigate(['/master-data/employee/add']);
    }

    goEdit(employee) {
        this.router.navigate(['/master-data/employee/edit', { id: employee.id }]);
    }

    doExecute(data) {
        Helpers.setLoading(true);
        const content = {
            urlName: 'run-test/store',
            body: {
                token: this.tokenUser,
                test_case_id: data.selectedCase,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            _result => {
                Helpers.setLoading(false);
                if (_result['response_code'] == 200) {
                    this.loadEmployee('');
                    setTimeout(() => {
                        this.doExe(data, _result['id_history']);
                    }, 3000);
                    this._msgs = [{ severity: 'success', summary: 'Please wait ... executing automation test.' }];
                } else {
                    this.msgs = [{ severity: 'warn', summary: 'Warning!', detail: _result['message_detail'] }];
                }
            });
    }

    doExe(data, id) {
        const content = {
            urlName: 'run-test/execute',
            body: {
                test_case_id: data.selectedCase,
                id_history: id,
            }
        }

        this.post$ = this._generalService.getData(content).subscribe(
            _result => {
                try {
                    console.log('ok');

                } catch (error) {
                    this.msgs = [{ severity: 'warn', summary: 'Warning!', detail: _result['message_detail'] }];
                }
            });
    }

    goDetail(_data) {
        var path_url = _data.path_url;
        var encodedString = btoa(path_url);
        this.router.navigate(['/run-test/detail', { str: encodedString }]);
    }

    doRefresh() {
        this.filters = {};
        this.genderFilter = null;
        this.nameFilter = null;
        this.emailFilter = null;
        this.noTelephoneFilter = null;
        this.dataTableComponent.reset();
        this.loadEmployee('');
    }
}
