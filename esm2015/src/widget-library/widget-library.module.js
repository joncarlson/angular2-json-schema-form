import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderableDirective } from '../shared/orderable.directive';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { BASIC_WIDGETS } from './index';
import { CKEditorModule } from 'ngx-ckeditor';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MaterialSelectIconComponent } from '../framework-library/material-design-framework/material-select-icon.component';
export class WidgetLibraryModule {
    static forRoot() {
        return {
            ngModule: WidgetLibraryModule,
            providers: [JsonSchemaFormService]
        };
    }
}
WidgetLibraryModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, DpDatePickerModule],
                declarations: [...BASIC_WIDGETS, OrderableDirective],
                exports: [...BASIC_WIDGETS, OrderableDirective],
                entryComponents: [...BASIC_WIDGETS, MaterialSelectIconComponent],
                providers: [JsonSchemaFormService]
            },] },
];
//# sourceMappingURL=widget-library.module.js.map
