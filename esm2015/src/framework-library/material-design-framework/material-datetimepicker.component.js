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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGF0ZXRpbWVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWRhdGV0aW1lcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRy9FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRXZFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXRELE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQThDNUIsTUFBTTtJQTBESixZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQXJEbEIsS0FBSzs0QkFDUixLQUFLO2dDQUVTLEVBQUU7cUJBT3ZCLHFCQUFxQjtnQ0FFVjtZQUNqQixjQUFjLEVBQUUsSUFBSTtZQUNwQixNQUFNLEVBQUUscUJBQXFCO1lBQzdCLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsYUFBYSxFQUFFLElBQUk7WUFDbkIsa0JBQWtCLEVBQUUsR0FBRztZQUN2QixXQUFXLEVBQUUsSUFBSTtZQUNqQixXQUFXLEVBQUUsSUFBSTtZQUNqQixXQUFXLEVBQUUsQ0FBQztZQUNkLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSTtZQUN2QixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLG1CQUFtQixFQUFFLElBQUk7WUFDekIsVUFBVSxFQUFFLE1BQU07WUFDbEIsZUFBZSxFQUFFLElBQUk7WUFD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QzVCO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOzs7WUExSUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0dBZVQ7Z0JBQ0QsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCUixDQUFDO2FBQ0g7Ozs7WUFqRFEscUJBQXFCOzs7MkJBNkQzQixLQUFLOzRCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxTQUFTLFNBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgT25DaGFuZ2VzLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IGRhdGVUb1N0cmluZywgaGFzT3duLCBzdHJpbmdUb0RhdGUgfSBmcm9tICcuLi8uLi9zaGFyZWQnO1xuaW1wb3J0IHsgRGF0ZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJ25nMi1kYXRlLXBpY2tlcic7XG5cbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtZGF0ZXRpbWVwaWNrZXItd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImRhdGVwaWNrZXItd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLXRpdGxlXCI+XG4gICAgICB7eyBvcHRpb25zPy50aXRsZSB9fVxuICAgIDwvZGl2PlxuICAgIDxkcC1kYXRlLXBpY2tlciAjbXlEYXRlUGlja2VyXG4gICAgICBbKG5nTW9kZWwpXT1cImRhdGVWYWx1ZVwiXG4gICAgICBbbW9kZV09XCJtb2RlXCJcbiAgICAgIFtjb25maWddPVwiZGF0ZVBpY2tlckNvbmZpZ1wiXG4gICAgICBbdGhlbWVdPVwidGhlbWVcIlxuICAgICAgW3BsYWNlaG9sZGVyXT1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgIChvbkNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCI+XG4gICAgPC9kcC1kYXRlLXBpY2tlcj5cbiAgICA8bWF0LWljb24gKGNsaWNrKT1cIm9wZW4oKVwiPmNhbGVuZGFyX3RvZGF5PC9tYXQtaWNvbj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICBtYXQtZXJyb3IgeyBmb250LXNpemU6IDc1JTsgbWFyZ2luLXRvcDogLTFyZW07IG1hcmdpbi1ib3R0b206IDAuNXJlbTsgfVxuICAgIDo6bmctZGVlcCBtYXQtZm9ybS1maWVsZCAubWF0LWZvcm0tZmllbGQtd3JhcHBlciAubWF0LWZvcm0tZmllbGQtZmxleFxuICAgICAgLm1hdC1mb3JtLWZpZWxkLWluZml4IHsgd2lkdGg6IGluaXRpYWw7IH1cblxuICAgIGRwLWRhdGUtcGlja2VyIHtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgIH1cblxuICAgIG1hdC1pY29uIHtcbiAgICAgIHBhZGRpbmctdG9wOiAycHg7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuXG4gICAgLmRhdGVwaWNrZXItdGl0bGUge1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41NCk7XG4gICAgICBwYWRkaW5nOiAycHggMDtcbiAgICB9XG5cbiAgICAuZGF0ZXBpY2tlci13cmFwcGVyIHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgfVxuXG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbERhdGV0aW1lcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBkYXRlVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIGF1dG9Db21wbGV0ZUxpc3Q6IHN0cmluZ1tdID0gW107XG4gIG1vZGU6IHN0cmluZztcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG4gIEBWaWV3Q2hpbGQoJ215RGF0ZVBpY2tlcicpIGRhdGVQaWNrZXI6IERhdGVQaWNrZXJDb21wb25lbnQ7XG5cbiAgdGhlbWUgPSAnZHAtbWF0ZXJpYWwgZHAtbWFpbic7XG5cbiAgZGF0ZVBpY2tlckNvbmZpZyA9IHtcbiAgICBmaXJzdERheU9mV2VlazogJ3N1JyxcbiAgICBmb3JtYXQ6ICdZWVlZLU1NLUREIEhIOm1tOnNzJyxcbiAgICBtb250aEZvcm1hdDogJ01NTSBZWVlZJyxcbiAgICBkaXNhYmxlS2V5cHJlc3M6IGZhbHNlLFxuICAgIGFsbG93TXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gICAgY2xvc2VPblNlbGVjdERlbGF5OiAxMDAsXG4gICAgb3Blbk9uRm9jdXM6IHRydWUsXG4gICAgb3Blbk9uQ2xpY2s6IHRydWUsXG4gICAgb25PcGVuRGVsYXk6IDAsXG4gICAgd2Vla0RheUZvcm1hdDogJ2RkZCcsXG4gICAgYXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG4gICAgc2hvd05lYXJNb250aERheXM6IHRydWUsXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBmYWxzZSxcbiAgICBlbmFibGVNb250aFNlbGVjdG9yOiB0cnVlLFxuICAgIHllYXJGb3JtYXQ6ICdZWVlZJyxcbiAgICBzaG93R29Ub0N1cnJlbnQ6IHRydWUsXG4gICAgZGF5QnRuRm9ybWF0OiAnREQnLFxuICAgIG1vbnRoQnRuRm9ybWF0OiAnTU1NJyxcbiAgICBob3VyczEyRm9ybWF0OiAnaGgnLFxuICAgIGhvdXJzMjRGb3JtYXQ6ICdISCcsXG4gICAgbWVyaWRpZW1Gb3JtYXQ6ICdBJyxcbiAgICBtaW51dGVzRm9ybWF0OiAnbW0nLFxuICAgIG1pbnV0ZXNJbnRlcnZhbDogMSxcbiAgICBzZWNvbmRzRm9ybWF0OiAnc3MnLFxuICAgIHNlY29uZHNJbnRlcnZhbDogMSxcbiAgICBzaG93U2Vjb25kczogdHJ1ZSxcbiAgICBzaG93VHdlbnR5Rm91ckhvdXJzOiB0cnVlLFxuICAgIHRpbWVTZXBhcmF0b3I6ICc6JyxcbiAgICBtdWx0aXBsZVllYXJzTmF2aWdhdGVCeTogMTAsXG4gICAgc2hvd011bHRpcGxlWWVhcnNOYXZpZ2F0aW9uOiBmYWxzZSxcbiAgICBsb2NhbGU6IG1vbWVudC5sb2NhbGUoKSxcbiAgICBoaWRlSW5wdXRDb250YWluZXI6IGZhbHNlLFxuICAgIHJldHVybmVkVmFsdWVUeXBlOiBTdHJpbmcsXG4gICAgdW5TZWxlY3RPbkNsaWNrOiB0cnVlLFxuICAgIGhpZGVPbk91dHNpZGVDbGljazogdHJ1ZVxuICB9O1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMsICF0aGlzLm9wdGlvbnMucmVhZG9ubHkpO1xuICAgIHRoaXMub3B0aW9ucy5mb3JtYXQgPyB0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0ID0gdGhpcy5vcHRpb25zLmZvcm1hdCA6IHRoaXMuZGF0ZVBpY2tlckNvbmZpZy5mb3JtYXQgPSAnWVlZWS1NTS1ERCBISDptbTpzcyc7XG4gICAgdGhpcy5vcHRpb25zLm1vZGUgPyB0aGlzLm1vZGUgPSB0aGlzLm9wdGlvbnMubW9kZSA6IHRoaXMubW9kZSA9ICdkYXl0aW1lJztcbiAgICB0aGlzLnNldENvbnRyb2xEYXRlKHRoaXMuY29udHJvbFZhbHVlKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ub3RpdGxlICYmICF0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gJiYgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5zZXRDb250cm9sRGF0ZSh0aGlzLmNvbnRyb2xWYWx1ZSk7XG4gIH1cblxuICBzZXRDb250cm9sRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpIHtcbiAgICBkYXRlU3RyaW5nID8gZGF0ZVN0cmluZyA6IGRhdGVTdHJpbmcgPSBtb21lbnQobmV3IERhdGUoKS5nZXRUaW1lKCkpLmZvcm1hdCh0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0KTtcbiAgICB0aGlzLmRhdGVWYWx1ZSA9IG1vbWVudChkYXRlU3RyaW5nLCB0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0KTtcbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuZGF0ZVZhbHVlID0gbW9tZW50KGV2ZW50WzBdKS5mb3JtYXQodGhpcy5kYXRlUGlja2VyQ29uZmlnLmZvcm1hdCk7XG4gICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgdGhpcy5kYXRlVmFsdWUpO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLmRhdGVQaWNrZXIuYXBpLm9wZW4oKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZGF0ZVBpY2tlci5hcGkuY2xvc2UoKTtcbiAgfVxufVxuIl19