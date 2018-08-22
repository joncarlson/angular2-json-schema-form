import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class CheckboxComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = this.options.title;
        }
    }
    updateValue(event) {
        event.preventDefault();
        this.jsf.updateValue(this, event.target.checked ? this.trueValue : this.falseValue);
    }
    get isChecked() {
        return this.jsf.getFormControlValue(this) === this.trueValue;
    }
}
CheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'checkbox-widget',
                template: `
    <label
      [attr.for]="'control' + layoutNode?._id"
      [class]="options?.itemLabelHtmlClass || ''">
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        type="checkbox">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [checked]="isChecked ? 'checked' : null"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [value]="controlValue"
        type="checkbox"
        (change)="updateValue($event)">
      <span *ngIf="options?.title"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </label>`,
            },] },
];
/** @nocollapse */
CheckboxComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
CheckboxComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS9jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFvQ3BFLE1BQU07SUFhSixZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQVZsQixLQUFLOzRCQUNSLEtBQUs7eUJBRUgsSUFBSTswQkFDSCxLQUFLO0tBT2xCO0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7U0FDeEM7S0FDRjtJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JGO0lBRUQsSUFBSSxTQUFTO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUM5RDs7O1lBbEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzthQThCQzthQUNaOzs7O1lBbkNRLHFCQUFxQjs7OzJCQTZDM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2hlY2tib3gtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bGFiZWxcbiAgICAgIFthdHRyLmZvcl09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/Lml0ZW1MYWJlbEh0bWxDbGFzcyB8fCAnJ1wiPlxuICAgICAgPGlucHV0ICpuZ0lmPVwiYm91bmRDb250cm9sXCJcbiAgICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWQgKyAnU3RhdHVzJ1wiXG4gICAgICAgIFtjbGFzc109XCIob3B0aW9ucz8uZmllbGRIdG1sQ2xhc3MgfHwgJycpICsgKGlzQ2hlY2tlZCA/XG4gICAgICAgICAgKCcgJyArIChvcHRpb25zPy5hY3RpdmVDbGFzcyB8fCAnJykgKyAnICcgKyAob3B0aW9ucz8uc3R5bGU/LnNlbGVjdGVkIHx8ICcnKSkgOlxuICAgICAgICAgICgnICcgKyAob3B0aW9ucz8uc3R5bGU/LnVuc2VsZWN0ZWQgfHwgJycpKSlcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgICBbcmVhZG9ubHldPVwib3B0aW9ucz8ucmVhZG9ubHkgPyAncmVhZG9ubHknIDogbnVsbFwiXG4gICAgICAgIHR5cGU9XCJjaGVja2JveFwiPlxuICAgICAgPGlucHV0ICpuZ0lmPVwiIWJvdW5kQ29udHJvbFwiXG4gICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkICsgJ1N0YXR1cydcIlxuICAgICAgICBbY2hlY2tlZF09XCJpc0NoZWNrZWQgPyAnY2hlY2tlZCcgOiBudWxsXCJcbiAgICAgICAgW2NsYXNzXT1cIihvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJykgKyAoaXNDaGVja2VkID9cbiAgICAgICAgICAoJyAnICsgKG9wdGlvbnM/LmFjdGl2ZUNsYXNzIHx8ICcnKSArICcgJyArIChvcHRpb25zPy5zdHlsZT8uc2VsZWN0ZWQgfHwgJycpKSA6XG4gICAgICAgICAgKCcgJyArIChvcHRpb25zPy5zdHlsZT8udW5zZWxlY3RlZCB8fCAnJykpKVwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWRcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgICBbcmVhZG9ubHldPVwib3B0aW9ucz8ucmVhZG9ubHkgPyAncmVhZG9ubHknIDogbnVsbFwiXG4gICAgICAgIFt2YWx1ZV09XCJjb250cm9sVmFsdWVcIlxuICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAoY2hhbmdlKT1cInVwZGF0ZVZhbHVlKCRldmVudClcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9zcGFuPlxuICAgIDwvbGFiZWw+YCxcbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIHRydWVWYWx1ZTogYW55ID0gdHJ1ZTtcbiAgZmFsc2VWYWx1ZTogYW55ID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzKTtcbiAgICBpZiAodGhpcy5jb250cm9sVmFsdWUgPT09IG51bGwgfHwgdGhpcy5jb250cm9sVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb250cm9sVmFsdWUgPSB0aGlzLm9wdGlvbnMudGl0bGU7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50LnRhcmdldC5jaGVja2VkID8gdGhpcy50cnVlVmFsdWUgOiB0aGlzLmZhbHNlVmFsdWUpO1xuICB9XG5cbiAgZ2V0IGlzQ2hlY2tlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5qc2YuZ2V0Rm9ybUNvbnRyb2xWYWx1ZSh0aGlzKSA9PT0gdGhpcy50cnVlVmFsdWU7XG4gIH1cbn1cbiJdfQ==