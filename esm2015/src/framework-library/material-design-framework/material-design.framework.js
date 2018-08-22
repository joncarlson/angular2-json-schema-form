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
export class MaterialDesignFramework extends Framework {
    constructor() {
        super(...arguments);
        this.name = 'material-design';
        this.framework = MaterialDesignFrameworkComponent;
        this.stylesheets = [
            '//fonts.googleapis.com/icon?family=Material+Icons',
            '//fonts.googleapis.com/css?family=Roboto:300,500,700',
        ];
        this.widgets = {
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
    }
}
MaterialDesignFramework.decorators = [
    { type: Injectable },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLmZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay9tYXRlcmlhbC1kZXNpZ24uZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUl6QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN0RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUd6RixNQUFNLDhCQUErQixTQUFRLFNBQVM7OztvQkFDN0MsaUJBQWlCO3lCQUVaLGdDQUFnQzsyQkFFOUI7WUFDWixtREFBbUQ7WUFDbkQsc0RBQXNEO1NBQ3ZEO3VCQUVTO1lBQ1IsTUFBTSxFQUFhLHVCQUF1QjtZQUMxQyxTQUFTLEVBQVUsMEJBQTBCO1lBQzdDLE1BQU0sRUFBYSw2QkFBNkI7WUFDaEQsUUFBUSxFQUFXLHVCQUF1QjtZQUMxQyxjQUFjLEVBQUssNEJBQTRCO1lBQy9DLFVBQVUsRUFBUyx5QkFBeUI7WUFDNUMsWUFBWSxFQUFPLDJCQUEyQjtZQUM5QyxXQUFXLEVBQVEseUJBQXlCO1lBQzVDLE1BQU0sRUFBYSwyQkFBMkI7WUFDOUMsVUFBVSxFQUFTLCtCQUErQjtZQUNsRCxNQUFNLEVBQWEscUJBQXFCO1lBQ3hDLFFBQVEsRUFBVyx1QkFBdUI7WUFDMUMsUUFBUSxFQUFXLHNCQUFzQjtZQUN6QyxRQUFRLEVBQVcsdUJBQXVCO1lBQzFDLFFBQVEsRUFBVyx1QkFBdUI7WUFDMUMsT0FBTyxFQUFZLDRCQUE0QjtZQUMvQyxRQUFRLEVBQVcsdUJBQXVCO1lBQzFDLFNBQVMsRUFBVSx3QkFBd0I7WUFDM0MsTUFBTSxFQUFhLHFCQUFxQjtZQUN4QyxNQUFNLEVBQWEsc0JBQXNCO1lBQ3pDLFVBQVUsRUFBUyx5QkFBeUI7WUFDNUMsVUFBVSxFQUFTLHlCQUF5QjtZQUM1QyxNQUFNLEVBQWEsMkJBQTJCO1lBQzlDLFVBQVUsRUFBUyxNQUFNO1lBQ3pCLFFBQVEsRUFBVyxRQUFRO1lBQzNCLE1BQU0sRUFBYSxTQUFTO1lBQzVCLGlCQUFpQixFQUFFLFNBQVM7WUFDNUIsUUFBUSxFQUFXLE1BQU07WUFDekIsT0FBTyxFQUFZLE1BQU07WUFDekIsU0FBUyxFQUFVLFFBQVE7WUFDM0IsY0FBYyxFQUFLLGNBQWM7WUFDakMsT0FBTyxFQUFZLFFBQVE7WUFDM0IsUUFBUSxFQUFXLFFBQVE7WUFDM0IsV0FBVyxFQUFRLFdBQVc7WUFDOUIsUUFBUSxFQUFXLFNBQVM7U0FDN0I7Ozs7WUEvQ0YsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRnJhbWV3b3JrIH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcblxuLy8gTWF0ZXJpYWwgRGVzaWduIEZyYW1ld29ya1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyXG5pbXBvcnQgeyBGbGV4TGF5b3V0Um9vdENvbXBvbmVudCB9IGZyb20gJy4vZmxleC1sYXlvdXQtcm9vdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmxleExheW91dFNlY3Rpb25Db21wb25lbnQgfSBmcm9tICcuL2ZsZXgtbGF5b3V0LXNlY3Rpb24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsQWRkUmVmZXJlbmNlQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1hZGQtcmVmZXJlbmNlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbE9uZU9mQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1vbmUtb2YuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsQnV0dG9uR3JvdXBDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLWJ1dHRvbi1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxDaGVja2JveENvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtY2hlY2tib3guY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsQ2hlY2tib3hlc0NvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtY2hlY2tib3hlcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxDaGlwTGlzdENvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtY2hpcC1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbENrZWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1ja2VkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxEYXRlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1kYXRlcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbERhdGV0aW1lcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1kYXRldGltZXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxGaWxlQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1maWxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxOdW1iZXJDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLW51bWJlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxSYWRpb3NDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLXJhZGlvcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxTZWxlY3RDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLXNlbGVjdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxTZWxlY3RDb2xvckNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtc2VsZWN0LWNvbG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFNlbGVjdEljb25Db21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLXNlbGVjdC1pY29uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFNsaWRlckNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtc2xpZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRlcmlhbFN0ZXBwZXJDb21wb25lbnQgfSBmcm9tICcuL21hdGVyaWFsLXN0ZXBwZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsVGFic0NvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtdGFicy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0ZXJpYWxUZXh0YXJlYUNvbXBvbmVudCB9IGZyb20gJy4vbWF0ZXJpYWwtdGV4dGFyZWEuY29tcG9uZW50JztcbmltcG9ydCB7IE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrQ29tcG9uZW50IH0gZnJvbSAnLi9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbERlc2lnbkZyYW1ld29yayBleHRlbmRzIEZyYW1ld29yayB7XG4gIG5hbWUgPSAnbWF0ZXJpYWwtZGVzaWduJztcblxuICBmcmFtZXdvcmsgPSBNYXRlcmlhbERlc2lnbkZyYW1ld29ya0NvbXBvbmVudDtcblxuICBzdHlsZXNoZWV0cyA9IFtcbiAgICAnLy9mb250cy5nb29nbGVhcGlzLmNvbS9pY29uP2ZhbWlseT1NYXRlcmlhbCtJY29ucycsXG4gICAgJy8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG86MzAwLDUwMCw3MDAnLFxuICBdO1xuXG4gIHdpZGdldHMgPSB7XG4gICAgJ3Jvb3QnOiAgICAgICAgICAgIEZsZXhMYXlvdXRSb290Q29tcG9uZW50LFxuICAgICdzZWN0aW9uJzogICAgICAgICBGbGV4TGF5b3V0U2VjdGlvbkNvbXBvbmVudCxcbiAgICAnJHJlZic6ICAgICAgICAgICAgTWF0ZXJpYWxBZGRSZWZlcmVuY2VDb21wb25lbnQsXG4gICAgJ2J1dHRvbic6ICAgICAgICAgIE1hdGVyaWFsQnV0dG9uQ29tcG9uZW50LFxuICAgICdidXR0b24tZ3JvdXAnOiAgICBNYXRlcmlhbEJ1dHRvbkdyb3VwQ29tcG9uZW50LFxuICAgICdjaGVja2JveCc6ICAgICAgICBNYXRlcmlhbENoZWNrYm94Q29tcG9uZW50LFxuICAgICdjaGVja2JveGVzJzogICAgICBNYXRlcmlhbENoZWNrYm94ZXNDb21wb25lbnQsXG4gICAgJ2NoaXAtbGlzdCc6ICAgICAgIE1hdGVyaWFsQ2hpcExpc3RDb21wb25lbnQsXG4gICAgJ2RhdGUnOiAgICAgICAgICAgIE1hdGVyaWFsRGF0ZXBpY2tlckNvbXBvbmVudCxcbiAgICAnZGF0ZXRpbWUnOiAgICAgICAgTWF0ZXJpYWxEYXRldGltZXBpY2tlckNvbXBvbmVudCxcbiAgICAnZmlsZSc6ICAgICAgICAgICAgTWF0ZXJpYWxGaWxlQ29tcG9uZW50LFxuICAgICdudW1iZXInOiAgICAgICAgICBNYXRlcmlhbE51bWJlckNvbXBvbmVudCxcbiAgICAnb25lLW9mJzogICAgICAgICAgTWF0ZXJpYWxPbmVPZkNvbXBvbmVudCxcbiAgICAncmFkaW9zJzogICAgICAgICAgTWF0ZXJpYWxSYWRpb3NDb21wb25lbnQsXG4gICAgJ3NlbGVjdCc6ICAgICAgICAgIE1hdGVyaWFsU2VsZWN0Q29tcG9uZW50LFxuICAgICdjb2xvcic6ICAgICAgICAgICBNYXRlcmlhbFNlbGVjdENvbG9yQ29tcG9uZW50LFxuICAgICdzbGlkZXInOiAgICAgICAgICBNYXRlcmlhbFNsaWRlckNvbXBvbmVudCxcbiAgICAnc3RlcHBlcic6ICAgICAgICAgTWF0ZXJpYWxTdGVwcGVyQ29tcG9uZW50LFxuICAgICd0YWJzJzogICAgICAgICAgICBNYXRlcmlhbFRhYnNDb21wb25lbnQsXG4gICAgJ3RleHQnOiAgICAgICAgICAgIE1hdGVyaWFsSW5wdXRDb21wb25lbnQsXG4gICAgJ3RleHRhcmVhJzogICAgICAgIE1hdGVyaWFsVGV4dGFyZWFDb21wb25lbnQsXG4gICAgJ2NrZWRpdG9yJzogICAgICAgIE1hdGVyaWFsQ2tlZGl0b3JDb21wb25lbnQsXG4gICAgJ2ljb24nOiAgICAgICAgICAgIE1hdGVyaWFsU2VsZWN0SWNvbkNvbXBvbmVudCxcbiAgICAnYWx0LWRhdGUnOiAgICAgICAgJ2RhdGUnLFxuICAgICdhbnktb2YnOiAgICAgICAgICAnb25lLW9mJyxcbiAgICAnY2FyZCc6ICAgICAgICAgICAgJ3NlY3Rpb24nLFxuICAgICdleHBhbnNpb24tcGFuZWwnOiAnc2VjdGlvbicsXG4gICAgJ2hpZGRlbic6ICAgICAgICAgICdub25lJyxcbiAgICAnaW1hZ2UnOiAgICAgICAgICAgJ25vbmUnLFxuICAgICdpbnRlZ2VyJzogICAgICAgICAnbnVtYmVyJyxcbiAgICAncmFkaW9idXR0b25zJzogICAgJ2J1dHRvbi1ncm91cCcsXG4gICAgJ3JhbmdlJzogICAgICAgICAgICdzbGlkZXInLFxuICAgICdzdWJtaXQnOiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAndGFnc2lucHV0JzogICAgICAgJ2NoaXAtbGlzdCcsXG4gICAgJ3dpemFyZCc6ICAgICAgICAgICdzdGVwcGVyJyxcbiAgfTtcbn1cbiJdfQ==