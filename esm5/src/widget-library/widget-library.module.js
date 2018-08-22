import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderableDirective } from '../shared/orderable.directive';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { BASIC_WIDGETS } from './index';
import { CKEditorModule } from 'ngx-ckeditor';
import { DpDatePickerModule } from 'ng2-date-picker';
var WidgetLibraryModule = /** @class */ (function () {
    function WidgetLibraryModule() {
    }
    WidgetLibraryModule.forRoot = function () {
        return {
            ngModule: WidgetLibraryModule,
            providers: [JsonSchemaFormService]
        };
    };
    WidgetLibraryModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, DpDatePickerModule],
                    declarations: tslib_1.__spread(BASIC_WIDGETS, [OrderableDirective]),
                    exports: tslib_1.__spread(BASIC_WIDGETS, [OrderableDirective]),
                    entryComponents: tslib_1.__spread(BASIC_WIDGETS),
                    providers: [JsonSchemaFormService]
                },] },
    ];
    return WidgetLibraryModule;
}());
export { WidgetLibraryModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LWxpYnJhcnkubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS93aWRnZXQtbGlicmFyeS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFcEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUd4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7O0lBVTVDLDJCQUFPLEdBQWQ7UUFDRSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxDQUFFLHFCQUFxQixDQUFFO1NBQ3JDLENBQUM7S0FDSDs7Z0JBYkYsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBVSxDQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixDQUFFO29CQUN2RyxZQUFZLG1CQUFVLGFBQWEsR0FBRSxrQkFBa0IsRUFBRTtvQkFDekQsT0FBTyxtQkFBZSxhQUFhLEdBQUUsa0JBQWtCLEVBQUU7b0JBQ3pELGVBQWUsbUJBQU8sYUFBYSxDQUFFO29CQUNyQyxTQUFTLEVBQVEsQ0FBRSxxQkFBcUIsQ0FBRTtpQkFDM0M7OzhCQXBCRDs7U0FxQmEsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgT3JkZXJhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vc2hhcmVkL29yZGVyYWJsZS5kaXJlY3RpdmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBCQVNJQ19XSURHRVRTIH0gZnJvbSAnLi9pbmRleCc7XG5cblxuaW1wb3J0IHsgQ0tFZGl0b3JNb2R1bGUgfSBmcm9tICduZ3gtY2tlZGl0b3InO1xuaW1wb3J0IHsgRHBEYXRlUGlja2VyTW9kdWxlIH0gZnJvbSAnbmcyLWRhdGUtcGlja2VyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogICAgICAgICBbIENvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIENLRWRpdG9yTW9kdWxlLCBEcERhdGVQaWNrZXJNb2R1bGUgXSxcbiAgZGVjbGFyYXRpb25zOiAgICBbIC4uLkJBU0lDX1dJREdFVFMsIE9yZGVyYWJsZURpcmVjdGl2ZSBdLFxuICBleHBvcnRzOiAgICAgICAgIFsgLi4uQkFTSUNfV0lER0VUUywgT3JkZXJhYmxlRGlyZWN0aXZlIF0sXG4gIGVudHJ5Q29tcG9uZW50czogWyAuLi5CQVNJQ19XSURHRVRTIF0sXG4gIHByb3ZpZGVyczogICAgICAgWyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgXVxufSlcbmV4cG9ydCBjbGFzcyBXaWRnZXRMaWJyYXJ5TW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXaWRnZXRMaWJyYXJ5TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbIEpzb25TY2hlbWFGb3JtU2VydmljZSBdXG4gICAgfTtcbiAgfVxufVxuIl19