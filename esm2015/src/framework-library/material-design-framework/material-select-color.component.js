import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isArray } from '../../shared';
export class MaterialSelectColorComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
        this.defaultColors = [
            "#e6194b",
            "#3cb44b",
            "#ffe119",
            "#0082c8",
            "#f58231",
            "#911eb4",
            "#46f0f0",
            "#f032e6",
            "#d2f53c",
            "#fabebe",
            "#008080",
            "#e6beff",
            "#aa6e28",
            "#fffac8",
            "#800000",
            "#aaffc3",
            "#808000",
            "#ffd8b1",
            "#000080",
            "#808080",
            "#FFFFFF",
            "#000000"
        ];
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.options.enum ? this.selectList = this.defaultColors.concat(this.options.enum) : this.selectList = this.defaultColors;
        if (this.controlValue && this.selectList.indexOf(this.controlValue) === -1) {
            this.selectList.push(this.controlValue);
        }
        this.jsf.initializeControl(this, !this.options.readonly);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    }
    updateValue(event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    }
}
MaterialSelectColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-select-color-widget',
                template: `
    <mat-form-field
      [class]="options?.htmlClass || ''"
      [floatLabel]="options?.floatPlaceholder || (options?.notitle ? 'never' : 'auto')"
      [style.width]="'100%'">
      <span matPrefix *ngIf="options?.prefix || options?.fieldAddonLeft"
        [innerHTML]="options?.prefix || options?.fieldAddonLeft"></span>
      <mat-select
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.name]="controlName"
        [disabled]="controlDisabled || options?.readonly"
        [id]="'control' + layoutNode?._id"
        [multiple]="options?.multiple"
        [placeholder]="options?.notitle ? options?.placeholder : options?.title"
        [required]="options?.required"
        [style.width]="'100%'"
        [value]="controlValue"
        (blur)="options.showErrors = true"
        (selectionChange)="updateValue($event)"
        [(ngModel)]="controlValue">
        <mat-select-trigger *ngIf="controlValue">
          <span class="color-box" [style.background-color]="controlValue"></span>
          <span>{{ controlValue }}</span>
        </mat-select-trigger>
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <mat-option
            [value]="selectItem">
            <span class="color-box" [style.background-color]="selectItem"></span>
            <span>{{ selectItem }}</span>
          </mat-option>
        </ng-template>
      </mat-select>
      <span matSuffix *ngIf="options?.suffix || options?.fieldAddonRight"
        [innerHTML]="options?.suffix || options?.fieldAddonRight"></span>
      <mat-hint *ngIf="options?.description && (!options?.showErrors || !options?.errorMessage)"
        align="end" [innerHTML]="options?.description"></mat-hint>
    </mat-form-field>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
                styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }

    .color-box {
      display:inline-block;
      height:14px;
      width:14px;
      margin-right:4px;
      border:1px solid #000;
    }`
                ],
            },] },
];
/** @nocollapse */
MaterialSelectColorComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialSelectColorComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtc2VsZWN0LWNvbG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay9tYXRlcmlhbC1zZWxlY3QtY29sb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBaUIsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBeUR0RCxNQUFNO0lBc0NKLFlBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7K0JBbkNsQixLQUFLOzRCQUNSLEtBQUs7MEJBRUEsRUFBRTt1QkFDWixPQUFPOzZCQUtEO1lBQ2QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWO0tBSUk7SUFFTCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzFILEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDekM7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUNyRDtLQUNGO0lBRUQsV0FBVyxDQUFDLEtBQUs7UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6Qzs7O1lBaEhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsOEJBQThCO2dCQUN4QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VEQXNDMkM7Z0JBQ3JELE1BQU0sRUFBRSxDQUFDOzs7Ozs7Ozs7OztNQVdMO2lCQUNIO2FBQ0Y7Ozs7WUF6RFEscUJBQXFCOzs7MkJBbUUzQixLQUFLOzRCQUNMLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgYnVpbGRUaXRsZU1hcCwgaXNBcnJheSB9IGZyb20gJy4uLy4uL3NoYXJlZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdGVyaWFsLXNlbGVjdC1jb2xvci13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxtYXQtZm9ybS1maWVsZFxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICBbZmxvYXRMYWJlbF09XCJvcHRpb25zPy5mbG9hdFBsYWNlaG9sZGVyIHx8IChvcHRpb25zPy5ub3RpdGxlID8gJ25ldmVyJyA6ICdhdXRvJylcIlxuICAgICAgW3N0eWxlLndpZHRoXT1cIicxMDAlJ1wiPlxuICAgICAgPHNwYW4gbWF0UHJlZml4ICpuZ0lmPVwib3B0aW9ucz8ucHJlZml4IHx8IG9wdGlvbnM/LmZpZWxkQWRkb25MZWZ0XCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5wcmVmaXggfHwgb3B0aW9ucz8uZmllbGRBZGRvbkxlZnRcIj48L3NwYW4+XG4gICAgICA8bWF0LXNlbGVjdFxuICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICdTdGF0dXMnXCJcbiAgICAgICAgW2F0dHIubmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW211bHRpcGxlXT1cIm9wdGlvbnM/Lm11bHRpcGxlXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyBvcHRpb25zPy5wbGFjZWhvbGRlciA6IG9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgW3JlcXVpcmVkXT1cIm9wdGlvbnM/LnJlcXVpcmVkXCJcbiAgICAgICAgW3N0eWxlLndpZHRoXT1cIicxMDAlJ1wiXG4gICAgICAgIFt2YWx1ZV09XCJjb250cm9sVmFsdWVcIlxuICAgICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCJcbiAgICAgICAgKHNlbGVjdGlvbkNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCJcbiAgICAgICAgWyhuZ01vZGVsKV09XCJjb250cm9sVmFsdWVcIj5cbiAgICAgICAgPG1hdC1zZWxlY3QtdHJpZ2dlciAqbmdJZj1cImNvbnRyb2xWYWx1ZVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29sb3ItYm94XCIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwiY29udHJvbFZhbHVlXCI+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnt7IGNvbnRyb2xWYWx1ZSB9fTwvc3Bhbj5cbiAgICAgICAgPC9tYXQtc2VsZWN0LXRyaWdnZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtc2VsZWN0SXRlbSBbbmdGb3JPZl09XCJzZWxlY3RMaXN0XCI+XG4gICAgICAgICAgPG1hdC1vcHRpb25cbiAgICAgICAgICAgIFt2YWx1ZV09XCJzZWxlY3RJdGVtXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbG9yLWJveFwiIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cInNlbGVjdEl0ZW1cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj57eyBzZWxlY3RJdGVtIH19PC9zcGFuPlxuICAgICAgICAgIDwvbWF0LW9wdGlvbj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDxzcGFuIG1hdFN1ZmZpeCAqbmdJZj1cIm9wdGlvbnM/LnN1ZmZpeCB8fCBvcHRpb25zPy5maWVsZEFkZG9uUmlnaHRcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnN1ZmZpeCB8fCBvcHRpb25zPy5maWVsZEFkZG9uUmlnaHRcIj48L3NwYW4+XG4gICAgICA8bWF0LWhpbnQgKm5nSWY9XCJvcHRpb25zPy5kZXNjcmlwdGlvbiAmJiAoIW9wdGlvbnM/LnNob3dFcnJvcnMgfHwgIW9wdGlvbnM/LmVycm9yTWVzc2FnZSlcIlxuICAgICAgICBhbGlnbj1cImVuZFwiIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZGVzY3JpcHRpb25cIj48L21hdC1oaW50PlxuICAgIDwvbWF0LWZvcm0tZmllbGQ+XG4gICAgPG1hdC1lcnJvciAqbmdJZj1cIm9wdGlvbnM/LnNob3dFcnJvcnMgJiYgb3B0aW9ucz8uZXJyb3JNZXNzYWdlXCJcbiAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZXJyb3JNZXNzYWdlXCI+PC9tYXQtZXJyb3I+YCxcbiAgc3R5bGVzOiBbYFxuICAgIG1hdC1lcnJvciB7IGZvbnQtc2l6ZTogNzUlOyBtYXJnaW4tdG9wOiAtMXJlbTsgbWFyZ2luLWJvdHRvbTogMC41cmVtOyB9XG4gICAgOjpuZy1kZWVwIG1hdC1mb3JtLWZpZWxkIC5tYXQtZm9ybS1maWVsZC13cmFwcGVyIC5tYXQtZm9ybS1maWVsZC1mbGV4XG4gICAgICAubWF0LWZvcm0tZmllbGQtaW5maXggeyB3aWR0aDogaW5pdGlhbDsgfVxuXG4gICAgLmNvbG9yLWJveCB7XG4gICAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcbiAgICAgIGhlaWdodDoxNHB4O1xuICAgICAgd2lkdGg6MTRweDtcbiAgICAgIG1hcmdpbi1yaWdodDo0cHg7XG4gICAgICBib3JkZXI6MXB4IHNvbGlkICMwMDA7XG4gICAgfWBcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTZWxlY3RDb2xvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgc2VsZWN0TGlzdDogYW55W10gPSBbXTtcbiAgaXNBcnJheSA9IGlzQXJyYXk7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGRlZmF1bHRDb2xvcnMgPSBbXG4gICAgXCIjZTYxOTRiXCIsXG4gICAgXCIjM2NiNDRiXCIsXG4gICAgXCIjZmZlMTE5XCIsXG4gICAgXCIjMDA4MmM4XCIsXG4gICAgXCIjZjU4MjMxXCIsXG4gICAgXCIjOTExZWI0XCIsXG4gICAgXCIjNDZmMGYwXCIsXG4gICAgXCIjZjAzMmU2XCIsXG4gICAgXCIjZDJmNTNjXCIsXG4gICAgXCIjZmFiZWJlXCIsXG4gICAgXCIjMDA4MDgwXCIsXG4gICAgXCIjZTZiZWZmXCIsXG4gICAgXCIjYWE2ZTI4XCIsXG4gICAgXCIjZmZmYWM4XCIsXG4gICAgXCIjODAwMDAwXCIsXG4gICAgXCIjYWFmZmMzXCIsXG4gICAgXCIjODA4MDAwXCIsXG4gICAgXCIjZmZkOGIxXCIsXG4gICAgXCIjMDAwMDgwXCIsXG4gICAgXCIjODA4MDgwXCIsXG4gICAgXCIjRkZGRkZGXCIsXG4gICAgXCIjMDAwMDAwXCJcbiAgXVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLm9wdGlvbnMuZW51bSA/IHRoaXMuc2VsZWN0TGlzdCA9IHRoaXMuZGVmYXVsdENvbG9ycy5jb25jYXQodGhpcy5vcHRpb25zLmVudW0pIDogdGhpcy5zZWxlY3RMaXN0ID0gdGhpcy5kZWZhdWx0Q29sb3JzO1xuICAgIGlmKHRoaXMuY29udHJvbFZhbHVlICYmIHRoaXMuc2VsZWN0TGlzdC5pbmRleE9mKHRoaXMuY29udHJvbFZhbHVlKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdC5wdXNoKHRoaXMuY29udHJvbFZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcywgIXRoaXMub3B0aW9ucy5yZWFkb25seSk7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubm90aXRsZSAmJiAhdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uICYmIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50LnZhbHVlKTtcbiAgfVxufVxuIl19