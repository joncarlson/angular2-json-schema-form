import { Component, Input, ViewChild } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import moment from 'moment';
var DatetimepickerComponent = /** @class */ (function () {
    function DatetimepickerComponent(jsf) {
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
    DatetimepickerComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        this.options.format ? this.datePickerConfig.format = this.options.format : this.datePickerConfig.format = 'YYYY-MM-DD HH:mm:ss';
        this.options.mode ? this.mode = this.options.mode : this.mode = 'daytime';
        this.setControlDate(this.controlValue);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    DatetimepickerComponent.prototype.ngOnChanges = function () {
        this.setControlDate(this.controlValue);
    };
    DatetimepickerComponent.prototype.setControlDate = function (dateString) {
        dateString ? dateString : dateString = moment(new Date().getTime()).format(this.datePickerConfig.format);
        this.dateValue = moment(dateString, this.datePickerConfig.format);
    };
    DatetimepickerComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.dateValue = moment(event[0]).format(this.datePickerConfig.format);
        this.jsf.updateValue(this, this.dateValue);
    };
    return DatetimepickerComponent;
}());
export { DatetimepickerComponent };
DatetimepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'datetimepicker-widget',
                template: "\n    <dp-date-picker\n      [(ngModel)]=\"dateValue\"\n      [mode]=\"mode\"\n      [config]=\"datePickerConfig\"\n      [theme]=\"theme\"\n      [placeholder]=\"options?.title\"\n      (onChange)=\"updateValue($event)\">\n    </dp-date-picker>\n  ",
                styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n  "],
            },] },
];
/** @nocollapse */
DatetimepickerComponent.ctorParameters = function () { return [
    { type: JsonSchemaFormService, },
]; };
DatetimepickerComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
    "datePicker": [{ type: ViewChild, args: ['myDatePicker',] },],
};
//# sourceMappingURL=datetimepicker.component.js.map
