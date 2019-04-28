import { NgModule } from '@angular/core';
import { ControlMessagesComponent } from './control-messages';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ControlMessagesComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ControlMessagesComponent
    ]
})
export class ControlMessagesComponentModule { }
