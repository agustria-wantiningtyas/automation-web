import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { ExcelService } from '../../../../_services/excel.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { DataTableModule, PaginatorModule, ConfirmationService, ConfirmDialogModule, GrowlModule, CalendarModule, MultiSelectModule, DialogModule, DropdownModule } from 'primeng/primeng';
import { GeneralService } from '../../../../_services/general.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ReportComponent
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
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule
    ], exports: [
        RouterModule
    ], declarations: [
        ReportComponent
    ],
    providers: [ConfirmationService, GeneralService, ExcelService],
})
export class ReportModule {

}