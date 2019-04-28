import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../validation.service';

/**
 * Generated class for the ControlMessagesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'control-messages',
    template: '<div *ngIf="errorMessage !== null" style="color:#DC281E;">{{errorMessage}}</div>'
})
export class ControlMessagesComponent {

    // text: string;
    @Input() control: FormControl;

    constructor() {
        console.log('Hello ControlMessagesComponent Component');
        // this.text = 'Hello World';
    }

    get errorMessage() {
        for (const propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }
        return null;
    }

}
