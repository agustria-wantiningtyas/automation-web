import { GrowlModule } from 'primeng/growl';
import { ControlMessagesComponentModule } from './../../../../components/control-messages/control-messages.module';
import { InputTextModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { GeneralService } from '../../../../_services/general.service';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ProfileComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule, ControlMessagesComponentModule,
        GrowlModule
    ], exports: [
        RouterModule
    ], declarations: [
        ProfileComponent
    ],
    providers: [GeneralService],
})
export class ProfileModule {



}