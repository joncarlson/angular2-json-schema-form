import { Component, Input, ViewChild } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { DatePickerComponent } from 'ng2-date-picker';
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
    return DatetimepickerComponent;
}());
export { DatetimepickerComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS9kYXRldGltZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUcvRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVwRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7O0lBNkUxQixpQ0FDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjsrQkFyRGxCLEtBQUs7NEJBQ1IsS0FBSztnQ0FFUyxFQUFFO3FCQVF2QixxQkFBcUI7Z0NBRVY7WUFDakIsY0FBYyxFQUFFLElBQUk7WUFDcEIsTUFBTSxFQUFFLHFCQUFxQjtZQUM3QixXQUFXLEVBQUUsVUFBVTtZQUN2QixlQUFlLEVBQUUsS0FBSztZQUN0QixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGtCQUFrQixFQUFFLEdBQUc7WUFDdkIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLENBQUM7WUFDZCxhQUFhLEVBQUUsS0FBSztZQUNwQixRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDdkIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixlQUFlLEVBQUUsS0FBSztZQUN0QixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGFBQWEsRUFBRSxJ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QztpQkFDSDs7OztnQkF2QlEscUJBQXFCOzs7K0JBa0MzQixLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzsrQkFFTCxTQUFTLFNBQUMsY0FBYzs7a0NBekMzQjs7U0EyQmEsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0LCBPbkNoYW5nZXMsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgZGF0ZVRvU3RyaW5nLCBoYXNPd24sIHN0cmluZ1RvRGF0ZSB9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQgeyBEYXRlUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnbmcyLWRhdGUtcGlja2VyJztcblxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRldGltZXBpY2tlci13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkcC1kYXRlLXBpY2tlclxuICAgICAgWyhuZ01vZGVsKV09XCJkYXRlVmFsdWVcIlxuICAgICAgW21vZGVdPVwibW9kZVwiXG4gICAgICBbY29uZmlnXT1cImRhdGVQaWNrZXJDb25maWdcIlxuICAgICAgW3RoZW1lXT1cInRoZW1lXCJcbiAgICAgIFtwbGFjZWhvbGRlcl09XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAob25DaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiPlxuICAgIDwvZHAtZGF0ZS1waWNrZXI+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICBtYXQtZXJyb3IgeyBmb250LXNpemU6IDc1JTsgbWFyZ2luLXRvcDogLTFyZW07IG1hcmdpbi1ib3R0b206IDAuNXJlbTsgfVxuICAgIDo6bmctZGVlcCBtYXQtZm9ybS1maWVsZCAubWF0LWZvcm0tZmllbGQtd3JhcHBlciAubWF0LWZvcm0tZmllbGQtZmxleFxuICAgICAgLm1hdC1mb3JtLWZpZWxkLWluZml4IHsgd2lkdGg6IGluaXRpYWw7IH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIERhdGV0aW1lcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgZGF0ZVZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBhdXRvQ29tcGxldGVMaXN0OiBzdHJpbmdbXSA9IFtdO1xuICBtb2RlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIEBWaWV3Q2hpbGQoJ215RGF0ZVBpY2tlcicpIGRhdGVQaWNrZXI6IERhdGVQaWNrZXJDb21wb25lbnQ7XG5cbiAgdGhlbWUgPSAnZHAtbWF0ZXJpYWwgZHAtbWFpbic7XG5cbiAgZGF0ZVBpY2tlckNvbmZpZyA9IHtcbiAgICBmaXJzdERheU9mV2VlazogJ3N1JyxcbiAgICBmb3JtYXQ6ICdZWVlZLU1NLUREIEhIOm1tOnNzJyxcbiAgICBtb250aEZvcm1hdDogJ01NTSBZWVlZJyxcbiAgICBkaXNhYmxlS2V5cHJlc3M6IGZhbHNlLFxuICAgIGFsbG93TXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gICAgY2xvc2VPblNlbGVjdERlbGF5OiAxMDAsXG4gICAgb3Blbk9uRm9jdXM6IHRydWUsXG4gICAgb3Blbk9uQ2xpY2s6IHRydWUsXG4gICAgb25PcGVuRGVsYXk6IDAsXG4gICAgd2Vla0RheUZvcm1hdDogJ2RkZCcsXG4gICAgYXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG4gICAgc2hvd05lYXJNb250aERheXM6IHRydWUsXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBmYWxzZSxcbiAgICBlbmFibGVNb250aFNlbGVjdG9yOiB0cnVlLFxuICAgIHllYXJGb3JtYXQ6ICdZWVlZJyxcbiAgICBzaG93R29Ub0N1cnJlbnQ6IHRydWUsXG4gICAgZGF5QnRuRm9ybWF0OiAnREQnLFxuICAgIG1vbnRoQnRuRm9ybWF0OiAnTU1NJyxcbiAgICBob3VyczEyRm9ybWF0OiAnaGgnLFxuICAgIGhvdXJzMjRGb3JtYXQ6ICdISCcsXG4gICAgbWVyaWRpZW1Gb3JtYXQ6ICdBJyxcbiAgICBtaW51dGVzRm9ybWF0OiAnbW0nLFxuICAgIG1pbnV0ZXNJbnRlcnZhbDogMSxcbiAgICBzZWNvbmRzRm9ybWF0OiAnc3MnLFxuICAgIHNlY29uZHNJbnRlcnZhbDogMSxcbiAgICBzaG93U2Vjb25kczogdHJ1ZSxcbiAgICBzaG93VHdlbnR5Rm91ckhvdXJzOiB0cnVlLFxuICAgIHRpbWVTZXBhcmF0b3I6ICc6JyxcbiAgICBtdWx0aXBsZVllYXJzTmF2aWdhdGVCeTogMTAsXG4gICAgc2hvd011bHRpcGxlWWVhcnNOYXZpZ2F0aW9uOiBmYWxzZSxcbiAgICBsb2NhbGU6IG1vbWVudC5sb2NhbGUoKSxcbiAgICBoaWRlSW5wdXRDb250YWluZXI6IGZhbHNlLFxuICAgIHJldHVybmVkVmFsdWVUeXBlOiBTdHJpbmcsXG4gICAgdW5TZWxlY3RPbkNsaWNrOiB0cnVlLFxuICAgIGhpZGVPbk91dHNpZGVDbGljazogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzLCAhdGhpcy5vcHRpb25zLnJlYWRvbmx5KTtcbiAgICB0aGlzLm9wdGlvbnMuZm9ybWF0ID8gdGhpcy5kYXRlUGlja2VyQ29uZmlnLmZvcm1hdCA9IHRoaXMub3B0aW9ucy5mb3JtYXQgOiB0aGlzLmRhdGVQaWNrZXJDb25maWcuZm9ybWF0ID0gJ1lZWVktTU0tREQgSEg6bW06c3MnO1xuICAgIHRoaXMub3B0aW9ucy5tb2RlID8gdGhpcy5tb2RlID0gdGhpcy5vcHRpb25zLm1vZGUgOiB0aGlzLm1vZGUgPSAnZGF5dGltZSc7XG4gICAgdGhpcy5zZXRDb250cm9sRGF0ZSh0aGlzLmNvbnRyb2xWYWx1ZSk7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubm90aXRsZSAmJiAhdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uICYmIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc2V0Q29udHJvbERhdGUodGhpcy5jb250cm9sVmFsdWUpO1xuICB9XG5cbiAgc2V0Q29udHJvbERhdGUoZGF0ZVN0cmluZzogc3RyaW5nKSB7XG4gICAgZGF0ZVN0cmluZyA/IGRhdGVTdHJpbmcgOiBkYXRlU3RyaW5nID0gbW9tZW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpKS5mb3JtYXQodGhpcy5kYXRlUGlja2VyQ29uZmlnLmZvcm1hdCk7XG4gICAgdGhpcy5kYXRlVmFsdWUgPSBtb21lbnQoZGF0ZVN0cmluZywgdGhpcy5kYXRlUGlja2VyQ29uZmlnLmZvcm1hdCk7XG4gIH1cblxuICB1cGRhdGVWYWx1ZShldmVudCkge1xuICAgIHRoaXMub3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZTtcbiAgICB0aGlzLmRhdGVWYWx1ZSA9IG1vbWVudChldmVudFswXSkuZm9ybWF0KHRoaXMuZGF0ZVBpY2tlckNvbmZpZy5mb3JtYXQpO1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIHRoaXMuZGF0ZVZhbHVlKTtcbiAgfVxufVxuIl19