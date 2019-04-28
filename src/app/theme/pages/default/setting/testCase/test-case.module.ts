import { TestCaseComponent } from './test-case.component';
import { ExcelService } from '../../../../../_services/excel.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { DataTableModule, PaginatorModule, ConfirmationService, ConfirmDialogModule, GrowlModule, CalendarModule, MultiSelectModule, DialogModule } from 'primeng/primeng';
import { GeneralService } from '../../../../../_services/general.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": TestCaseComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        DataTableModule,
        PaginatorModule,
        ConfirmDialogModule,
        CalendarModule,
        MultiSelectModule,
        GrowlModule,
        DialogModule
    ], exports: [
        RouterModule
    ], declarations: [
        TestCaseComponent
    ],
    providers: [ConfirmationService, GeneralService, ExcelService],
})
export class TestCaseModule {

}