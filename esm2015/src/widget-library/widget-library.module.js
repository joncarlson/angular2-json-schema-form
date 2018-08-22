import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderableDirective } from '../shared/orderable.directive';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { BASIC_WIDGETS } from './index';
import { CKEditorModule } from 'ngx-ckeditor';
import { DpDatePickerModule } from 'ng2-date-picker';
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
                entryComponents: [...BASIC_WIDGETS],
                providers: [JsonSchemaFormService]
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LWxpYnJhcnkubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS93aWRnZXQtbGlicmFyeS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVwRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFTckQsTUFBTTtJQUNKLE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsQ0FBRSxxQkFBcUIsQ0FBRTtTQUNyQyxDQUFDO0tBQ0g7OztZQWJGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQVUsQ0FBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsQ0FBRTtnQkFDdkcsWUFBWSxFQUFLLENBQUUsR0FBRyxhQUFhLEVBQUUsa0JBQWtCLENBQUU7Z0JBQ3pELE9BQU8sRUFBVSxDQUFFLEdBQUcsYUFBYSxFQUFFLGtCQUFrQixDQUFFO2dCQUN6RCxlQUFlLEVBQUUsQ0FBRSxHQUFHLGFBQWEsQ0FBRTtnQkFDckMsU0FBUyxFQUFRLENBQUUscUJBQXFCLENBQUU7YUFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBPcmRlcmFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9zaGFyZWQvb3JkZXJhYmxlLmRpcmVjdGl2ZSc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbmltcG9ydCB7IEJBU0lDX1dJREdFVFMgfSBmcm9tICcuL2luZGV4JztcblxuXG5pbXBvcnQgeyBDS0VkaXRvck1vZHVsZSB9IGZyb20gJ25neC1ja2VkaXRvcic7XG5pbXBvcnQgeyBEcERhdGVQaWNrZXJNb2R1bGUgfSBmcm9tICduZzItZGF0ZS1waWNrZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiAgICAgICAgIFsgQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgQ0tFZGl0b3JNb2R1bGUsIERwRGF0ZVBpY2tlck1vZHVsZSBdLFxuICBkZWNsYXJhdGlvbnM6ICAgIFsgLi4uQkFTSUNfV0lER0VUUywgT3JkZXJhYmxlRGlyZWN0aXZlIF0sXG4gIGV4cG9ydHM6ICAgICAgICAgWyAuLi5CQVNJQ19XSURHRVRTLCBPcmRlcmFibGVEaXJlY3RpdmUgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbIC4uLkJBU0lDX1dJREdFVFMgXSxcbiAgcHJvdmlkZXJzOiAgICAgICBbIEpzb25TY2hlbWFGb3JtU2VydmljZSBdXG59KVxuZXhwb3J0IGNsYXNzIFdpZGdldExpYnJhcnlNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdpZGdldExpYnJhcnlNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIF1cbiAgICB9O1xuICB9XG59XG4iXX0=