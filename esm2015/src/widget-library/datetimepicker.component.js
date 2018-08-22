import { Component, Input, ViewChild } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { DatePickerComponent } from 'ng2-date-picker';
import moment from 'moment';
export class DatetimepickerComponent {
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
        this.dateValue = moment(dateString, this.datePickerConfig.format);
    }
    updateValue(event) {
        this.options.showErrors = true;
        this.dateValue = moment(event[0]).format(this.datePickerConfig.format);
        this.jsf.updateValue(this, this.dateValue);
    }
}
DatetimepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'datetimepicker-widget',
                template: `
    <dp-date-picker
      [(ngModel)]="dateValue"
      [mode]="mode"
      [config]="datePickerConfig"
      [theme]="theme"
      [placeholder]="options?.title"
      (onChange)="updateValue($event)">
    </dp-date-picker>
  `,
                styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }
  `],
            },] },
];
/** @nocollapse */
DatetimepickerComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
DatetimepickerComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
    "datePicker": [{ type: ViewChild, args: ['myDatePicker',] },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS9kYXRldGltZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUcvRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVwRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFvQjVCLE1BQU07SUF5REosWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjsrQkFyRGxCLEtBQUs7NEJBQ1IsS0FBSztnQ0FFUyxFQUFFO3FCQVF2QixxQkFBcUI7Z0NBRVY7WUFDakIsY0FBYyxFQUFFLElBQUk7WUFDcEIsTUFBTSxFQUFFLHFCQUFxQjtZQUM3QixXQUFXLEVBQUUsVUFBVTtZQUN2QixlQUFlLEVBQUUsS0FBSztZQUN0QixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGtCQUFrQixFQUFFLEdBQUc7WUFDdkIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLENBQUM7WUFDZCxhQUFhLEVBQUUsS0FBSztZQUNwQixRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDdkIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixlQUFlLEVBQUUsS0FBSztZQUN0QixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGFB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Ozs7O1lBdkJRLHFCQUFxQjs7OzJCQWtDM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBRUwsU0FBUyxTQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIE9uQ2hhbmdlcywgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBkYXRlVG9TdHJpbmcsIGhhc093biwgc3RyaW5nVG9EYXRlIH0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7IERhdGVQaWNrZXJDb21wb25lbnQgfSBmcm9tICduZzItZGF0ZS1waWNrZXInO1xuXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGV0aW1lcGlja2VyLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRwLWRhdGUtcGlja2VyXG4gICAgICBbKG5nTW9kZWwpXT1cImRhdGVWYWx1ZVwiXG4gICAgICBbbW9kZV09XCJtb2RlXCJcbiAgICAgIFtjb25maWddPVwiZGF0ZVBpY2tlckNvbmZpZ1wiXG4gICAgICBbdGhlbWVdPVwidGhlbWVcIlxuICAgICAgW3BsYWNlaG9sZGVyXT1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgIChvbkNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCI+XG4gICAgPC9kcC1kYXRlLXBpY2tlcj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAgIG1hdC1lcnJvciB7IGZvbnQtc2l6ZTogNzUlOyBtYXJnaW4tdG9wOiAtMXJlbTsgbWFyZ2luLWJvdHRvbTogMC41cmVtOyB9XG4gICAgOjpuZy1kZWVwIG1hdC1mb3JtLWZpZWxkIC5tYXQtZm9ybS1maWVsZC13cmFwcGVyIC5tYXQtZm9ybS1maWVsZC1mbGV4XG4gICAgICAubWF0LWZvcm0tZmllbGQtaW5maXggeyB3aWR0aDogaW5pdGlhbDsgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXRpbWVwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBkYXRlVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIGF1dG9Db21wbGV0ZUxpc3Q6IHN0cmluZ1tdID0gW107XG4gIG1vZGU6IHN0cmluZztcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgQFZpZXdDaGlsZCgnbXlEYXRlUGlja2VyJykgZGF0ZVBpY2tlcjogRGF0ZVBpY2tlckNvbXBvbmVudDtcblxuICB0aGVtZSA9ICdkcC1tYXRlcmlhbCBkcC1tYWluJztcblxuICBkYXRlUGlja2VyQ29uZmlnID0ge1xuICAgIGZpcnN0RGF5T2ZXZWVrOiAnc3UnLFxuICAgIGZvcm1hdDogJ1lZWVktTU0tREQgSEg6bW06c3MnLFxuICAgIG1vbnRoRm9ybWF0OiAnTU1NIFlZWVknLFxuICAgIGRpc2FibGVLZXlwcmVzczogZmFsc2UsXG4gICAgYWxsb3dNdWx0aVNlbGVjdDogZmFsc2UsXG4gICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgICBjbG9zZU9uU2VsZWN0RGVsYXk6IDEwMCxcbiAgICBvcGVuT25Gb2N1czogdHJ1ZSxcbiAgICBvcGVuT25DbGljazogdHJ1ZSxcbiAgICBvbk9wZW5EZWxheTogMCxcbiAgICB3ZWVrRGF5Rm9ybWF0OiAnZGRkJyxcbiAgICBhcHBlbmRUbzogZG9jdW1lbnQuYm9keSxcbiAgICBzaG93TmVhck1vbnRoRGF5czogdHJ1ZSxcbiAgICBzaG93V2Vla051bWJlcnM6IGZhbHNlLFxuICAgIGVuYWJsZU1vbnRoU2VsZWN0b3I6IHRydWUsXG4gICAgeWVhckZvcm1hdDogJ1lZWVknLFxuICAgIHNob3dHb1RvQ3VycmVudDogdHJ1ZSxcbiAgICBkYXlCdG5Gb3JtYXQ6ICdERCcsXG4gICAgbW9udGhCdG5Gb3JtYXQ6ICdNTU0nLFxuICAgIGhvdXJzMTJGb3JtYXQ6ICdoaCcsXG4gICAgaG91cnMyNEZvcm1hdDogJ0hIJyxcbiAgICBtZXJpZGllbUZvcm1hdDogJ0EnLFxuICAgIG1pbnV0ZXNGb3JtYXQ6ICdtbScsXG4gICAgbWludXRlc0ludGVydmFsOiAxLFxuICAgIHNlY29uZHNGb3JtYXQ6ICdzcycsXG4gICAgc2Vjb25kc0ludGVydmFsOiAxLFxuICAgIHNob3dTZWNvbmRzOiB0cnVlLFxuICAgIHNob3dUd2VudHlGb3VySG91cnM6IHRydWUsXG4gICAgdGltZVNlcGFyYXRvcjogJzonLFxuICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiAxMCxcbiAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IGZhbHNlLFxuICAgIGxvY2FsZTogbW9tZW50LmxvY2FsZSgpLFxuICAgIGhpZGVJbnB1dENvbnRhaW5lcjogZmFsc2UsXG4gICAgcmV0dXJuZWRWYWx1ZVR5cGU6IFN0cmluZyxcbiAgICB1blNlbGVjdE9uQ2xpY2s6IHRydWUsXG4gICAgaGlkZU9uT3V0c2lkZUNsaWNrOiB0cnVlXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMsICF0aGlzLm9wdGlvbnMucmVhZG9ubHkpO1xuICAgIHRoaXMub3B0aW9ucy5mb3JtYXQgPyB0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0ID0gdGhpcy5vcHRpb25zLmZvcm1hdCA6IHRoaXMuZGF0ZVBpY2tlckNvbmZpZy5mb3JtYXQgPSAnWVlZWS1NTS1ERCBISDptbTpzcyc7XG4gICAgdGhpcy5vcHRpb25zLm1vZGUgPyB0aGlzLm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZSA6IHRoaXMubW9kZSA9ICdkYXl0aW1lJztcbiAgICB0aGlzLnNldENvbnRyb2xEYXRlKHRoaXMuY29udHJvbFZhbHVlKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ub3RpdGxlICYmICF0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gJiYgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zZXRDb250cm9sRGF0ZSh0aGlzLmNvbnRyb2xWYWx1ZSk7XG4gIH1cblxuICBzZXRDb250cm9sRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpIHtcbiAgICBkYXRlU3RyaW5nID8gZGF0ZVN0cmluZyA6IGRhdGVTdHJpbmcgPSBtb21lbnQobmV3IERhdGUoKS5nZXRUaW1lKCkpLmZvcm1hdCh0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0KTtcbiAgICB0aGlzLmRhdGVWYWx1ZSA9IG1vbWVudChkYXRlU3RyaW5nLCB0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0KTtcbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuZGF0ZVZhbHVlID0gbW9tZW50KGV2ZW50WzBdKS5mb3JtYXQodGhpcy5kYXRlUGlja2VyQ29uZmlnLmZvcm1hdCk7XG4gICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgdGhpcy5kYXRlVmFsdWUpO1xuICB9XG59XG4iXX0=