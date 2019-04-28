import { TestCaseEditComponent } from './test-case-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { CalendarModule, InputTextareaModule, DropdownModule, MultiSelectModule, RadioButtonModule, CheckboxModule } from 'primeng/primeng';
import { GeneralService } from '../../../../../../_services/general.service';
import { FormsModule, ReactiveFormsModule } from '../../../../../../../../node_modules/@angular/forms';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": TestCaseEditComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        FormsModule,
        ReactiveFormsModule,
        MultiSelectModule,
        CheckboxModule,
        RadioButtonModule
    ], exports: [
        RouterModule
    ], declarations: [
        TestCaseEditComponent
    ],
    providers: [GeneralService],
})
export class TestCaseEditModule {



}