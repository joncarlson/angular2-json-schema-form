import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isArray } from '../../shared';
export class MaterialSelectIconComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.selectList = [];
        this.isArray = isArray;
        this.defaultIcons = [
            "fa-address-book",
            "fa-archive",
            "fa-car",
            "fa-camera-retro",
            "fa-cloud",
            "fa-bathtub",
            "fa-bullhorn",
            "fa-comments",
            "fa-clone",
            "fa-columns",
            "fa-code",
            "fa-eraser",
            "fa-eject",
            "fa-desktop",
            "fa-fire",
            "fa-cube",
            "fa-list-alt",
            "fa-microchip",
            "fa-fax",
            "fa-flag",
            "fa-print",
            "fa-power-off",
            "fa-bell"
        ];
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.options.enum ? this.selectList = this.defaultIcons.concat(this.options.enum) : this.selectList = this.defaultIcons;
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
MaterialSelectIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-select-icon-widget',
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
          <i class="fa align-middle" [ngClass]="controlValue"></i>
          <span class="icon-name">{{ controlValue }}</span>
        </mat-select-trigger>
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <mat-option
            [value]="selectItem">
            <i class="fa align-middle" [ngClass]="selectItem"></i>
            <span class="icon-name">{{ selectItem }}</span>
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

    .icon-name {
      margin-left:5px;
    }`
                ],
            },] },
];
/** @nocollapse */
MaterialSelectIconComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialSelectIconComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtc2VsZWN0LWljb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLXNlbGVjdC1pY29uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN2RSxPQUFPLEVBQWlCLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQXFEdEQsTUFBTTtJQXVDSixZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQXBDbEIsS0FBSzs0QkFDUixLQUFLOzBCQUVBLEVBQUU7dUJBQ1osT0FBTzs0QkFLRjtZQUNiLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osUUFBUTtZQUNSLGlCQUFpQjtZQUNqQixVQUFVO1lBQ1YsWUFBWTtZQUNaLGFBQWE7WUFDYixhQUFhO1lBQ2IsVUFBVTtZQUNWLFlBQVk7WUFDWixTQUFTO1lBQ1QsV0FBVztZQUNYLFVBQVU7WUFDVixZQUFZO1lBQ1osU0FBUztZQUNULFNBQVM7WUFDVCxhQUFhO1lBQ2IsY0FBYztZQUNkLFFBQVE7WUFDUixTQUFTO1lBQ1QsVUFBVTtZQUNWLGNBQWM7WUFDZCxTQUFTO1NBQ1Y7S0FJSTtJQUVMLFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDeEgsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3JEO0tBQ0Y7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pDOzs7WUE3R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dURBc0MyQztnQkFDckQsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7TUFPTDtpQkFDSDthQUNGOzs7O1lBckRRLHFCQUFxQjs7OzJCQStEM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IGJ1aWxkVGl0bGVNYXAsIGlzQXJyYXkgfSBmcm9tICcuLi8uLi9zaGFyZWQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXRlcmlhbC1zZWxlY3QtaWNvbi13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxtYXQtZm9ybS1maWVsZFxuICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICBbZmxvYXRMYWJlbF09XCJvcHRpb25zPy5mbG9hdFBsYWNlaG9sZGVyIHx8IChvcHRpb25zPy5ub3RpdGxlID8gJ25ldmVyJyA6ICdhdXRvJylcIlxuICAgICAgW3N0eWxlLndpZHRoXT1cIicxMDAlJ1wiPlxuICAgICAgPHNwYW4gbWF0UHJlZml4ICpuZ0lmPVwib3B0aW9ucz8ucHJlZml4IHx8IG9wdGlvbnM/LmZpZWxkQWRkb25MZWZ0XCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5wcmVmaXggfHwgb3B0aW9ucz8uZmllbGRBZGRvbkxlZnRcIj48L3NwYW4+XG4gICAgICA8bWF0LXNlbGVjdFxuICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICdTdGF0dXMnXCJcbiAgICAgICAgW2F0dHIubmFtZV09XCJjb250cm9sTmFtZVwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICBbaWRdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW211bHRpcGxlXT1cIm9wdGlvbnM/Lm11bHRpcGxlXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyBvcHRpb25zPy5wbGFjZWhvbGRlciA6IG9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgW3JlcXVpcmVkXT1cIm9wdGlvbnM/LnJlcXVpcmVkXCJcbiAgICAgICAgW3N0eWxlLndpZHRoXT1cIicxMDAlJ1wiXG4gICAgICAgIFt2YWx1ZV09XCJjb250cm9sVmFsdWVcIlxuICAgICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCJcbiAgICAgICAgKHNlbGVjdGlvbkNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCJcbiAgICAgICAgWyhuZ01vZGVsKV09XCJjb250cm9sVmFsdWVcIj5cbiAgICAgICAgPG1hdC1zZWxlY3QtdHJpZ2dlciAqbmdJZj1cImNvbnRyb2xWYWx1ZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwiZmEgYWxpZ24tbWlkZGxlXCIgW25nQ2xhc3NdPVwiY29udHJvbFZhbHVlXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbi1uYW1lXCI+e3sgY29udHJvbFZhbHVlIH19PC9zcGFuPlxuICAgICAgICA8L21hdC1zZWxlY3QtdHJpZ2dlcj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1zZWxlY3RJdGVtIFtuZ0Zvck9mXT1cInNlbGVjdExpc3RcIj5cbiAgICAgICAgICA8bWF0LW9wdGlvblxuICAgICAgICAgICAgW3ZhbHVlXT1cInNlbGVjdEl0ZW1cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgYWxpZ24tbWlkZGxlXCIgW25nQ2xhc3NdPVwic2VsZWN0SXRlbVwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbi1uYW1lXCI+e3sgc2VsZWN0SXRlbSB9fTwvc3Bhbj5cbiAgICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8L21hdC1zZWxlY3Q+XG4gICAgICA8c3BhbiBtYXRTdWZmaXggKm5nSWY9XCJvcHRpb25zPy5zdWZmaXggfHwgb3B0aW9ucz8uZmllbGRBZGRvblJpZ2h0XCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5zdWZmaXggfHwgb3B0aW9ucz8uZmllbGRBZGRvblJpZ2h0XCI+PC9zcGFuPlxuICAgICAgPG1hdC1oaW50ICpuZ0lmPVwib3B0aW9ucz8uZGVzY3JpcHRpb24gJiYgKCFvcHRpb25zPy5zaG93RXJyb3JzIHx8ICFvcHRpb25zPy5lcnJvck1lc3NhZ2UpXCJcbiAgICAgICAgYWxpZ249XCJlbmRcIiBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmRlc2NyaXB0aW9uXCI+PC9tYXQtaGludD5cbiAgICA8L21hdC1mb3JtLWZpZWxkPlxuICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJvcHRpb25zPy5zaG93RXJyb3JzICYmIG9wdGlvbnM/LmVycm9yTWVzc2FnZVwiXG4gICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmVycm9yTWVzc2FnZVwiPjwvbWF0LWVycm9yPmAsXG4gIHN0eWxlczogW2BcbiAgICBtYXQtZXJyb3IgeyBmb250LXNpemU6IDc1JTsgbWFyZ2luLXRvcDogLTFyZW07IG1hcmdpbi1ib3R0b206IDAuNXJlbTsgfVxuICAgIDo6bmctZGVlcCBtYXQtZm9ybS1maWVsZCAubWF0LWZvcm0tZmllbGQtd3JhcHBlciAubWF0LWZvcm0tZmllbGQtZmxleFxuICAgICAgLm1hdC1mb3JtLWZpZWxkLWluZml4IHsgd2lkdGg6IGluaXRpYWw7IH1cblxuICAgIC5pY29uLW5hbWUge1xuICAgICAgbWFyZ2luLWxlZnQ6NXB4O1xuICAgIH1gXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU2VsZWN0SWNvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2w7XG4gIGNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIGNvbnRyb2xWYWx1ZTogYW55O1xuICBjb250cm9sRGlzYWJsZWQgPSBmYWxzZTtcbiAgYm91bmRDb250cm9sID0gZmFsc2U7XG4gIG9wdGlvbnM6IGFueTtcbiAgc2VsZWN0TGlzdDogYW55W10gPSBbXTtcbiAgaXNBcnJheSA9IGlzQXJyYXk7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGRlZmF1bHRJY29ucyA9IFtcbiAgICBcImZhLWFkZHJlc3MtYm9va1wiLFxuICAgIFwiZmEtYXJjaGl2ZVwiLFxuICAgIFwiZmEtY2FyXCIsXG4gICAgXCJmYS1jYW1lcmEtcmV0cm9cIixcbiAgICBcImZhLWNsb3VkXCIsXG4gICAgXCJmYS1iYXRodHViXCIsXG4gICAgXCJmYS1idWxsaG9yblwiLFxuICAgIFwiZmEtY29tbWVudHNcIixcbiAgICBcImZhLWNsb25lXCIsXG4gICAgXCJmYS1jb2x1bW5zXCIsXG4gICAgXCJmYS1jb2RlXCIsXG4gICAgXCJmYS1lcmFzZXJcIixcbiAgICBcImZhLWVqZWN0XCIsXG4gICAgXCJmYS1kZXNrdG9wXCIsXG4gICAgXCJmYS1maXJlXCIsXG4gICAgXCJmYS1jdWJlXCIsXG4gICAgXCJmYS1saXN0LWFsdFwiLFxuICAgIFwiZmEtbWljcm9jaGlwXCIsXG4gICAgXCJmYS1mYXhcIixcbiAgICBcImZhLWZsYWdcIixcbiAgICBcImZhLXByaW50XCIsXG4gICAgXCJmYS1wb3dlci1vZmZcIixcbiAgICBcImZhLWJlbGxcIlxuICBdXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMub3B0aW9ucy5lbnVtID8gdGhpcy5zZWxlY3RMaXN0ID0gdGhpcy5kZWZhdWx0SWNvbnMuY29uY2F0KHRoaXMub3B0aW9ucy5lbnVtKSA6IHRoaXMuc2VsZWN0TGlzdCA9IHRoaXMuZGVmYXVsdEljb25zO1xuICAgIGlmKHRoaXMuY29udHJvbFZhbHVlICYmIHRoaXMuc2VsZWN0TGlzdC5pbmRleE9mKHRoaXMuY29udHJvbFZhbHVlKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdC5wdXNoKHRoaXMuY29udHJvbFZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcywgIXRoaXMub3B0aW9ucy5yZWFkb25seSk7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubm90aXRsZSAmJiAhdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uICYmIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50LnZhbHVlKTtcbiAgfVxufVxuIl19