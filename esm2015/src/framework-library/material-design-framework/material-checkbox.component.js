import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export class MaterialCheckboxComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.trueValue = true;
        this.falseValue = false;
        this.showSlideToggle = false;
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this, !this.options.readonly);
        if (this.controlValue === null || this.controlValue === undefined) {
            this.controlValue = false;
            this.jsf.updateValue(this, this.falseValue);
        }
        if (this.layoutNode.type === 'slide-toggle' ||
            this.layoutNode.format === 'slide-toggle') {
            this.showSlideToggle = true;
        }
    }
    updateValue(event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.checked ? this.trueValue : this.falseValue);
    }
    get isChecked() {
        return this.jsf.getFormControlValue(this) === this.trueValue;
    }
}
MaterialCheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-checkbox-widget',
                template: `
    <mat-checkbox *ngIf="boundControl && !showSlideToggle"
      [formControl]="formControl"
      labelPosition="left"
      [color]="options?.color || 'primary'"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      (blur)="options.showErrors = true">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-checkbox>
    <mat-checkbox *ngIf="!boundControl && !showSlideToggle"
      labelPosition="left"
      [color]="options?.color || 'primary'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      [checked]="isChecked"
      (blur)="options.showErrors = true"
      (change)="updateValue($event)">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-checkbox>
    <mat-slide-toggle *ngIf="boundControl && showSlideToggle"
      [formControl]="formControl"
      align="left"
      [color]="options?.color || 'primary'"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      (blur)="options.showErrors = true">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-slide-toggle>
    <mat-slide-toggle *ngIf="!boundControl && showSlideToggle"
      align="left"
      [color]="options?.color || 'primary'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode?._id"
      labelPosition="after"
      [name]="controlName"
      [checked]="isChecked"
      (blur)="options.showErrors = true"
      (change)="updateValue($event)">
      <span *ngIf="options?.title"
        class="checkbox-name"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
    </mat-slide-toggle>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
                styles: [`
    .checkbox-name { white-space: nowrap; }
    mat-error { font-size: 75%; }
  `],
            },] },
];
/** @nocollapse */
MaterialCheckboxComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialCheckboxComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWNoZWNrYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQXFFdkUsTUFBTTtJQWNKLFlBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7K0JBWGxCLEtBQUs7NEJBQ1IsS0FBSzt5QkFFSCxJQUFJOzBCQUNILEtBQUs7K0JBQ0wsS0FBSztLQU9sQjtJQUVMLFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDN0M7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxjQUFjO1lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLGNBQzdCLENBQUMsQ0FBQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7S0FDRjtJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDOUU7SUFFRCxJQUFJLFNBQVM7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDO0tBQzlEOzs7WUF6R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1REEwRDJDO2dCQUNyRCxNQUFNLEVBQUUsQ0FBQzs7O0dBR1IsQ0FBQzthQUNIOzs7O1lBcEVRLHFCQUFxQjs7OzJCQStFM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IGhhc093biB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL3V0aWxpdHkuZnVuY3Rpb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtY2hlY2tib3gtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bWF0LWNoZWNrYm94ICpuZ0lmPVwiYm91bmRDb250cm9sICYmICFzaG93U2xpZGVUb2dnbGVcIlxuICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgIGxhYmVsUG9zaXRpb249XCJsZWZ0XCJcbiAgICAgIFtjb2xvcl09XCJvcHRpb25zPy5jb2xvciB8fCAncHJpbWFyeSdcIlxuICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwiYWZ0ZXJcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIGNsYXNzPVwiY2hlY2tib3gtbmFtZVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L3NwYW4+XG4gICAgPC9tYXQtY2hlY2tib3g+XG4gICAgPG1hdC1jaGVja2JveCAqbmdJZj1cIiFib3VuZENvbnRyb2wgJiYgIXNob3dTbGlkZVRvZ2dsZVwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwibGVmdFwiXG4gICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwiYWZ0ZXJcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgW2NoZWNrZWRdPVwiaXNDaGVja2VkXCJcbiAgICAgIChibHVyKT1cIm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWVcIlxuICAgICAgKGNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCI+XG4gICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJjaGVja2JveC1uYW1lXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwib3B0aW9ucz8ubm90aXRsZSA/ICdub25lJyA6ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy50aXRsZVwiPjwvc3Bhbj5cbiAgICA8L21hdC1jaGVja2JveD5cbiAgICA8bWF0LXNsaWRlLXRvZ2dsZSAqbmdJZj1cImJvdW5kQ29udHJvbCAmJiBzaG93U2xpZGVUb2dnbGVcIlxuICAgICAgW2Zvcm1Db250cm9sXT1cImZvcm1Db250cm9sXCJcbiAgICAgIGFsaWduPVwibGVmdFwiXG4gICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICAgIFtpZF09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgbGFiZWxQb3NpdGlvbj1cImFmdGVyXCJcbiAgICAgIFtuYW1lXT1cImNvbnRyb2xOYW1lXCJcbiAgICAgIChibHVyKT1cIm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWVcIj5cbiAgICAgIDxzcGFuICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBjbGFzcz1cImNoZWNrYm94LW5hbWVcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9zcGFuPlxuICAgIDwvbWF0LXNsaWRlLXRvZ2dsZT5cbiAgICA8bWF0LXNsaWRlLXRvZ2dsZSAqbmdJZj1cIiFib3VuZENvbnRyb2wgJiYgc2hvd1NsaWRlVG9nZ2xlXCJcbiAgICAgIGFsaWduPVwibGVmdFwiXG4gICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICBsYWJlbFBvc2l0aW9uPVwiYWZ0ZXJcIlxuICAgICAgW25hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgW2NoZWNrZWRdPVwiaXNDaGVja2VkXCJcbiAgICAgIChibHVyKT1cIm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWVcIlxuICAgICAgKGNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCI+XG4gICAgICA8c3BhbiAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJjaGVja2JveC1uYW1lXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwib3B0aW9ucz8ubm90aXRsZSA/ICdub25lJyA6ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy50aXRsZVwiPjwvc3Bhbj5cbiAgICA8L21hdC1zbGlkZS10b2dnbGU+XG4gICAgPG1hdC1lcnJvciAqbmdJZj1cIm9wdGlvbnM/LnNob3dFcnJvcnMgJiYgb3B0aW9ucz8uZXJyb3JNZXNzYWdlXCJcbiAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZXJyb3JNZXNzYWdlXCI+PC9tYXQtZXJyb3I+YCxcbiAgc3R5bGVzOiBbYFxuICAgIC5jaGVja2JveC1uYW1lIHsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxuICAgIG1hdC1lcnJvciB7IGZvbnQtc2l6ZTogNzUlOyB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbENoZWNrYm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICB0cnVlVmFsdWU6IGFueSA9IHRydWU7XG4gIGZhbHNlVmFsdWU6IGFueSA9IGZhbHNlO1xuICBzaG93U2xpZGVUb2dnbGUgPSBmYWxzZTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMsICF0aGlzLm9wdGlvbnMucmVhZG9ubHkpO1xuICAgIGlmICh0aGlzLmNvbnRyb2xWYWx1ZSA9PT0gbnVsbCB8fCB0aGlzLmNvbnRyb2xWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbnRyb2xWYWx1ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgdGhpcy5mYWxzZVZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGF5b3V0Tm9kZS50eXBlID09PSAnc2xpZGUtdG9nZ2xlJyB8fFxuICAgICAgdGhpcy5sYXlvdXROb2RlLmZvcm1hdCA9PT0gJ3NsaWRlLXRvZ2dsZSdcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd1NsaWRlVG9nZ2xlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVWYWx1ZShldmVudCkge1xuICAgIHRoaXMub3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZTtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudC5jaGVja2VkID8gdGhpcy50cnVlVmFsdWUgOiB0aGlzLmZhbHNlVmFsdWUpO1xuICB9XG5cbiAgZ2V0IGlzQ2hlY2tlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5qc2YuZ2V0Rm9ybUNvbnRyb2xWYWx1ZSh0aGlzKSA9PT0gdGhpcy50cnVlVmFsdWU7XG4gIH1cbn1cbiJdfQ==