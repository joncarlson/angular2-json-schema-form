import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderableDirective } from '../shared/orderable.directive';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { BASIC_WIDGETS } from './index';
import { CKEditorModule } from 'ngx-ckeditor';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MaterialSelectIconComponent } from '../framework-library/material-design-framework/material-select-icon.component';
var WidgetLibraryModule = /** @class */ (function () {
    function WidgetLibraryModule() {
    }
    WidgetLibraryModule.forRoot = function () {
        return {
            ngModule: WidgetLibraryModule,
            providers: [JsonSchemaFormService]
        };
    };
    return WidgetLibraryModule;
}());
export { WidgetLibraryModule };
WidgetLibraryModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, DpDatePickerModule],
                declarations: tslib_1.__spread(BASIC_WIDGETS, [OrderableDirective]),
                exports: tslib_1.__spread(BASIC_WIDGETS, [OrderableDirective]),
                entryComponents: tslib_1.__spread(BASIC_WIDGETS, [MaterialSelectIconComponent]),
                providers: [JsonSchemaFormService]
            },] },
];
//# sourceMappingURL=widget-library.module.js.map
