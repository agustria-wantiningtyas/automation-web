import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from '../../../../_services/excel.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { DataTableModule, PaginatorModule, ConfirmationService, ConfirmDialogModule, GrowlModule, CalendarModule, MultiSelectModule, DialogModule, FieldsetModule, DropdownModule } from 'primeng/primeng';
import { GeneralService } from '../../../../_services/general.service';
import { RunTestComponent } from './run-test.component';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": RunTestComponent
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
        FieldsetModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule
    ], exports: [
        RouterModule
    ], declarations: [
        RunTestComponent
    ],
    providers: [ConfirmationService, GeneralService, ExcelService],
})
export class RunTestModule {

}