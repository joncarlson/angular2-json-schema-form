import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Framework } from '../framework';
import { FlexLayoutRootComponent } from './flex-layout-root.component';
import { FlexLayoutSectionComponent } from './flex-layout-section.component';
import { MaterialAddReferenceComponent } from './material-add-reference.component';
import { MaterialOneOfComponent } from './material-one-of.component';
import { MaterialButtonComponent } from './material-button.component';
import { MaterialButtonGroupComponent } from './material-button-group.component';
import { MaterialCheckboxComponent } from './material-checkbox.component';
import { MaterialCheckboxesComponent } from './material-checkboxes.component';
import { MaterialChipListComponent } from './material-chip-list.component';
import { MaterialCkeditorComponent } from './material-ckeditor.component';
import { MaterialDatepickerComponent } from './material-datepicker.component';
import { MaterialDatetimepickerComponent } from './material-datetimepicker.component';
import { MaterialFileComponent } from './material-file.component';
import { MaterialInputComponent } from './material-input.component';
import { MaterialNumberComponent } from './material-number.component';
import { MaterialRadiosComponent } from './material-radios.component';
import { MaterialSelectComponent } from './material-select.component';
import { MaterialSelectColorComponent } from './material-select-color.component';
import { MaterialSelectIconComponent } from './material-select-icon.component';
import { MaterialSliderComponent } from './material-slider.component';
import { MaterialStepperComponent } from './material-stepper.component';
import { MaterialTabsComponent } from './material-tabs.component';
import { MaterialTextareaComponent } from './material-textarea.component';
import { MaterialDesignFrameworkComponent } from './material-design-framework.component';
var MaterialDesignFramework = /** @class */ (function (_super) {
    tslib_1.__extends(MaterialDesignFramework, _super);
    function MaterialDesignFramework() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'material-design';
        _this.framework = MaterialDesignFrameworkComponent;
        _this.stylesheets = [
            '//fonts.googleapis.com/icon?family=Material+Icons',
            '//fonts.googleapis.com/css?family=Roboto:300,500,700',
        ];
        _this.widgets = {
            'root': FlexLayoutRootComponent,
            'section': FlexLayoutSectionComponent,
            '$ref': MaterialAddReferenceComponent,
            'button': MaterialButtonComponent,
            'button-group': MaterialButtonGroupComponent,
            'checkbox': MaterialCheckboxComponent,
            'checkboxes': MaterialCheckboxesComponent,
            'chip-list': MaterialChipListComponent,
            'date': MaterialDatepickerComponent,
            'datetime': MaterialDatetimepickerComponent,
            'file': MaterialFileComponent,
            'number': MaterialNumberComponent,
            'one-of': MaterialOneOfComponent,
            'radios': MaterialRadiosComponent,
            'select': MaterialSelectComponent,
            'color': MaterialSelectColorComponent,
            'slider': MaterialSliderComponent,
            'stepper': MaterialStepperComponent,
            'tabs': MaterialTabsComponent,
            'text': MaterialInputComponent,
            'textarea': MaterialTextareaComponent,
            'ckeditor': MaterialCkeditorComponent,
            'icon': MaterialSelectIconComponent,
            'alt-date': 'date',
            'any-of': 'one-of',
            'card': 'section',
            'expansion-panel': 'section',
            'hidden': 'none',
            'image': 'none',
            'integer': 'number',
            'radiobuttons': 'button-group',
            'range': 'slider',
            'submit': 'button',
            'tagsinput': 'chip-list',
            'wizard': 'stepper',
        };
        return _this;
    }
    MaterialDesignFramework.decorators = [
        { type: Injectable },
    ];
    return MaterialDesignFramework;
}(Framework));
export { MaterialDesignFramework };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLmZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay9tYXRlcmlhbC1kZXNpZ24uZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFJekMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDckUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDOUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7O0lBRzVDLG1EQUFTOzs7cUJBQzdDLGlCQUFpQjswQkFFWixnQ0FBZ0M7NEJBRTlCO1lBQ1osbURBQW1EO1lBQ25ELHNEQUFzRDtTQUN2RDt3QkFFUztZQUNSLE1BQU0sRUFBYSx1QkFBdUI7WUFDMUMsU0FBUyxFQUFVLDBCQUEwQjtZQUM3QyxNQUFNLEVBQWEsNkJBQTZCO1lBQ2hELFFBQVEsRUFBVyx1QkFBdUI7WUFDMUMsY0FBYyxFQUFLLDRCQUE0QjtZQUMvQyxVQUFVLEVBQVMseUJBQXlCO1lBQzVDLFlBQVksRUFBTywyQkFBMkI7WUFDOUMsV0FBVyxFQUFRLHlCQUF5QjtZQUM1QyxNQUFNLEVBQWEsMkJBQTJCO1lBQzlDLFVBQVUsRUFBUywrQkFBK0I7WUFDbEQsTUFBTSxFQUFhLHFCQUFxQjtZQUN4QyxRQUFRLEVBQVcsdUJBQXVCO1lBQzFDLFFBQVEsRUFBVyxzQkFBc0I7WUFDekMsUUFBUSxFQUFXLHVCQUF1QjtZQUMxQyxRQUFRLEVBQVcsdUJBQXVCO1lBQzFDLE9BQU8sRUFBWSw0QkFBNEI7WUFDL0MsUUFBUSxFQUFXLHVCQUF1QjtZQUMxQyxTQUFTLEVBQVUsd0JBQXdCO1lBQzNDLE1BQU0sRUFBYSxxQkFBcUI7WUFDeEMsTUFBTSxFQUFhLHNCQUFzQjtZQUN6QyxVQUFVLEVBQVMseUJBQXlCO1lBQzVDLFVBQVUsRUFBUyx5QkFBeUI7WUFDNUMsTUFBTSxFQUFhLDJCQUEyQjtZQUM5QyxVQUFVLEVBQVMsTUFBTTtZQUN6QixRQUFRLEVBQVcsUUFBUTtZQUMzQixNQUFNLEVBQWEsU0FBUztZQUM1QixpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLFFBQVEsRUFBVyxNQUFNO1lBQ3pCLE9BQU8sRUFBWSxNQUFNO1lBQ3pCLFNBQVMsRUFBVSxRQUFRO1lBQzNCLGNBQWMsRUFBSyxjQUFjO1lBQ2pDLE9BQU8sRUFBWSxRQUFRO1lBQzNCLFFBQVEsRUFBVyxRQUFRO1lBQzNCLFdBQVcsRUFBUSxXQUFXO1lBQzlCLFFBQVEsRUFBVyxTQUFTO1NBQzdCOzs7O2dCQS9DRixVQUFVOztrQ0EvQlg7RUFnQzZDLFNBQVM7U0FBekMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGcmFtZXdvcmsgfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xuXG4vLyBNYXRlcmlhbCBEZXNpZ24gRnJhbWV3b3JrXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9tYXRlcmlhbDJcbmltcG9ydCB7IEZsZXhMYXlvdXRSb290Q29tcG9uZW50IH0gZnJvbSAnLi9mbGV4LWxheW91dC1yb290LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGbGV4TGF5b3V0U2VjdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vZmxleC1sYXlvdXQtc2VjdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxBZGRSZWZlcmVuY2VDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWFkZC1yZWZlcmVuY2UuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsT25lT2ZDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLW9uZS1vZi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWJ1dHRvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxCdXR0b25Hcm91cENvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtYnV0dG9uLWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbENoZWNrYm94Q29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1jaGVja2JveC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxDaGVja2JveGVzQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1jaGVja2JveGVzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbENoaXBMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1jaGlwLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsQ2tlZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWNrZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbERhdGVwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWRhdGVwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsRGF0ZXRpbWVwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWRhdGV0aW1lcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbEZpbGVDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWZpbGUuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbE51bWJlckNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtbnVtYmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFJhZGlvc0NvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtcmFkaW9zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFNlbGVjdENvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtc2VsZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFNlbGVjdENvbG9yQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1zZWxlY3QtY29sb3IuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsU2VsZWN0SWNvbkNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtc2VsZWN0LWljb24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsU2xpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1zbGlkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsU3RlcHBlckNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtc3RlcHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxUYWJzQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC10YWJzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFRleHRhcmVhQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC10ZXh0YXJlYS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxEZXNpZ25GcmFtZXdvcmtDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsuY29tcG9uZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrIGV4dGVuZHMgRnJhbWV3b3JrIHtcbiAgbmFtZSA9ICdtYXRlcmlhbC1kZXNpZ24nO1xuXG4gIGZyYW1ld29yayA9IE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrQ29tcG9uZW50O1xuXG4gIHN0eWxlc2hlZXRzID0gW1xuICAgICcvL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2ljb24/ZmFtaWx5PU1hdGVyaWFsK0ljb25zJyxcbiAgICAnLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90bzozMDAsNTAwLDcwMCcsXG4gIF07XG5cbiAgd2lkZ2V0cyA9IHtcbiAgICAncm9vdCc6ICAgICAgICAgICAgRmxleExheW91dFJvb3RDb21wb25lbnQsXG4gICAgJ3NlY3Rpb24nOiAgICAgICAgIEZsZXhMYXlvdXRTZWN0aW9uQ29tcG9uZW50LFxuICAgICckcmVmJzogICAgICAgICAgICBNYXRlcmlhbEFkZFJlZmVyZW5jZUNvbXBvbmVudCxcbiAgICAnYnV0dG9uJzogICAgICAgICAgTWF0ZXJpYWxCdXR0b25Db21wb25lbnQsXG4gICAgJ2J1dHRvbi1ncm91cCc6ICAgIE1hdGVyaWFsQnV0dG9uR3JvdXBDb21wb25lbnQsXG4gICAgJ2NoZWNrYm94JzogICAgICAgIE1hdGVyaWFsQ2hlY2tib3hDb21wb25lbnQsXG4gICAgJ2NoZWNrYm94ZXMnOiAgICAgIE1hdGVyaWFsQ2hlY2tib3hlc0NvbXBvbmVudCxcbiAgICAnY2hpcC1saXN0JzogICAgICAgTWF0ZXJpYWxDaGlwTGlzdENvbXBvbmVudCxcbiAgICAnZGF0ZSc6ICAgICAgICAgICAgTWF0ZXJpYWxEYXRlcGlja2VyQ29tcG9uZW50LFxuICAgICdkYXRldGltZSc6ICAgICAgICBNYXRlcmlhbERhdGV0aW1lcGlja2VyQ29tcG9uZW50LFxuICAgICdmaWxlJzogICAgICAgICAgICBNYXRlcmlhbEZpbGVDb21wb25lbnQsXG4gICAgJ251bWJlcic6ICAgICAgICAgIE1hdGVyaWFsTnVtYmVyQ29tcG9uZW50LFxuICAgICdvbmUtb2YnOiAgICAgICAgICBNYXRlcmlhbE9uZU9mQ29tcG9uZW50LFxuICAgICdyYWRpb3MnOiAgICAgICAgICBNYXRlcmlhbFJhZGlvc0NvbXBvbmVudCxcbiAgICAnc2VsZWN0JzogICAgICAgICAgTWF0ZXJpYWxTZWxlY3RDb21wb25lbnQsXG4gICAgJ2NvbG9yJzogICAgICAgICAgIE1hdGVyaWFsU2VsZWN0Q29sb3JDb21wb25lbnQsXG4gICAgJ3NsaWRlcic6ICAgICAgICAgIE1hdGVyaWFsU2xpZGVyQ29tcG9uZW50LFxuICAgICdzdGVwcGVyJzogICAgICAgICBNYXRlcmlhbFN0ZXBwZXJDb21wb25lbnQsXG4gICAgJ3RhYnMnOiAgICAgICAgICAgIE1hdGVyaWFsVGFic0NvbXBvbmVudCxcbiAgICAndGV4dCc6ICAgICAgICAgICAgTWF0ZXJpYWxJbnB1dENvbXBvbmVudCxcbiAgICAndGV4dGFyZWEnOiAgICAgICAgTWF0ZXJpYWxUZXh0YXJlYUNvbXBvbmVudCxcbiAgICAnY2tlZGl0b3InOiAgICAgICAgTWF0ZXJpYWxDa2VkaXRvckNvbXBvbmVudCxcbiAgICAnaWNvbic6ICAgICAgICAgICAgTWF0ZXJpYWxTZWxlY3RJY29uQ29tcG9uZW50LFxuICAgICdhbHQtZGF0ZSc6ICAgICAgICAnZGF0ZScsXG4gICAgJ2FueS1vZic6ICAgICAgICAgICdvbmUtb2YnLFxuICAgICdjYXJkJzogICAgICAgICAgICAnc2VjdGlvbicsXG4gICAgJ2V4cGFuc2lvbi1wYW5lbCc6ICdzZWN0aW9uJyxcbiAgICAnaGlkZGVuJzogICAgICAgICAgJ25vbmUnLFxuICAgICdpbWFnZSc6ICAgICAgICAgICAnbm9uZScsXG4gICAgJ2ludGVnZXInOiAgICAgICAgICdudW1iZXInLFxuICAgICdyYWRpb2J1dHRvbnMnOiAgICAnYnV0dG9uLWdyb3VwJyxcbiAgICAncmFuZ2UnOiAgICAgICAgICAgJ3NsaWRlcicsXG4gICAgJ3N1Ym1pdCc6ICAgICAgICAgICdidXR0b24nLFxuICAgICd0YWdzaW5wdXQnOiAgICAgICAnY2hpcC1saXN0JyxcbiAgICAnd2l6YXJkJzogICAgICAgICAgJ3N0ZXBwZXInLFxuICB9O1xufVxuIl19