import { Component, Input, ViewChild } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { DatePickerComponent } from 'ng2-date-picker';
import moment from 'moment';
export class MaterialDatetimepickerComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.autoCompleteList = [];
        this.theme = 'dp-material dp-main';
        this.datePickerConfig = {
            firstDayOfWeek: 'su',
            format: 'YYYY-MM-DD HH:mm:ss',
            monthFormat: 'MMM YYYY',
            disableKeypress: false,
            allowMultiSelect: false,
            closeOnSelect: true,
            closeOnSelectDelay: 100,
            openOnFocus: true,
            openOnClick: true,
            onOpenDelay: 0,
            weekDayFormat: 'ddd',
            appendTo: document.body,
            showNearMonthDays: true,
            showWeekNumbers: false,
            enableMonthSelector: true,
            yearFormat: 'YYYY',
            showGoToCurrent: true,
            dayBtnFormat: 'DD',
            monthBtnFormat: 'MMM',
            hours12Format: 'hh',
            hours24Format: 'HH',
            meridiemFormat: 'A',
            minutesFormat: 'mm',
            minutesInterval: 1,
            secondsFormat: 'ss',
            secondsInterval: 1,
            showSeconds: true,
            showTwentyFourHours: true,
            timeSeparator: ':',
            multipleYearsNavigateBy: 10,
            showMultipleYearsNavigation: false,
            locale: moment.locale(),
            hideInputContainer: false,
            returnedValueType: String,
            unSelectOnClick: true,
            hideOnOutsideClick: true
        };
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        this.options.format ? this.datePickerConfig.format = this.options.format : this.datePickerConfig.format = 'YYYY-MM-DD HH:mm:ss';
        this.options.mode ? this.mode = this.options.mode : this.mode = 'daytime';
        this.setControlDate(this.controlValue);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    }
    ngOnChanges() {
        this.setControlDate(this.controlValue);
    }
    setControlDate(dateString) {
        dateString ? dateString : dateString = moment(new Date().getTime()).format(this.datePickerConfig.format);
        console.log(dateString);
        this.dateValue = moment(dateString, this.datePickerConfig.format);
    }
    updateValue(event) {
        this.options.showErrors = true;
        this.dateValue = moment(event[0]).format(this.datePickerConfig.format);
        this.jsf.updateValue(this, this.dateValue);
    }
    open() {
        this.datePicker.api.open();
    }
    close() {
        this.datePicker.api.close();
    }
}
MaterialDatetimepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-datetimepicker-widget',
                template: `
  <div class="datepicker-wrapper">
    <div class="datepicker-title">
      {{ options?.title }}
    </div>
    <dp-date-picker #myDatePicker
      [(ngModel)]="dateValue"
      [mode]="mode"
      [config]="datePickerConfig"
      [theme]="theme"
      [placeholder]="options?.title"
      (onChange)="updateValue($event)">
    </dp-date-picker>
    <mat-icon (click)="open()">calendar_today</mat-icon>
  </div>
  `,
                styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }

    dp-date-picker {
      float: left;
    }

    mat-icon {
      padding-top: 2px;
      cursor: pointer;
    }

    .datepicker-title {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      padding: 2px 0;
    }

    .datepicker-wrapper {
      margin-bottom: 10px;
    }

  `],
            },] },
];
/** @nocollapse */
MaterialDatetimepickerComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialDatetimepickerComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
    "datePicker": [{ type: ViewChild, args: ['myDatePicker',] },],
};
//# sourceMappingURL=material-datetimepicker.component.js.map
