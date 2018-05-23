import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatStepperModule, MatTabsModule, MatTooltipModule, } from '@angular/material';
export const ANGULAR_MATERIAL_MODULES = [
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule,
    MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
    MatStepperModule, MatTabsModule, MatTooltipModule,
];
import { WidgetLibraryModule } from '../../widget-library/widget-library.module';
import { Framework } from '../framework';
import { MATERIAL_FRAMEWORK_COMPONENTS } from './index';
import { MaterialDesignFramework } from './material-design.framework';
import { CKEditorModule } from 'ngx-ckeditor';
export class MaterialDesignFrameworkModule {
    static forRoot() {
        return {
            ngModule: MaterialDesignFrameworkModule,
            providers: [
                { provide: Framework, useClass: MaterialDesignFramework, multi: true }
            ]
        };
    }
}
MaterialDesignFrameworkModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
                    ...ANGULAR_MATERIAL_MODULES, WidgetLibraryModule, CKEditorModule
                ],
                declarations: [...MATERIAL_FRAMEWORK_COMPONENTS],
                exports: [...MATERIAL_FRAMEWORK_COMPONENTS],
                entryComponents: [...MATERIAL_FRAMEWORK_COMPONENTS]
            },] },
];
//# sourceMappingURL=material-design-framework.module.js.map