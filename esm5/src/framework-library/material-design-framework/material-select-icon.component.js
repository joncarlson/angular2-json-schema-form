import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isArray } from '../../shared';
var MaterialSelectIconComponent = /** @class */ (function () {
    function MaterialSelectIconComponent(jsf) {
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
    MaterialSelectIconComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.options.enum ? this.selectList = this.defaultIcons.concat(this.options.enum) : this.selectList = this.defaultIcons;
        if (this.controlValue && this.selectList.indexOf(this.controlValue) === -1) {
            this.selectList.push(this.controlValue);
        }
        this.jsf.initializeControl(this, !this.options.readonly);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialSelectIconComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    };
    MaterialSelectIconComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-select-icon-widget',
                    template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatPlaceholder || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <mat-select\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.name]=\"controlName\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [multiple]=\"options?.multiple\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [value]=\"controlValue\"\n        (blur)=\"options.showErrors = true\"\n        (selectionChange)=\"updateValue($event)\"\n        [(ngModel)]=\"controlValue\">\n        <mat-select-trigger *ngIf=\"controlValue\">\n          <i class=\"fa align-middle\" [ngClass]=\"controlValue\"></i>\n          <span class=\"icon-name\">{{ controlValue }}</span>\n        </mat-select-trigger>\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <mat-option\n            [value]=\"selectItem\">\n            <i class=\"fa align-middle\" [ngClass]=\"selectItem\"></i>\n            <span class=\"icon-name\">{{ selectItem }}</span>\n          </mat-option>\n        </ng-template>\n      </mat-select>\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                    styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n\n    .icon-name {\n      margin-left:5px;\n    }"
                    ],
                },] },
    ];
    /** @nocollapse */
    MaterialSelectIconComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    MaterialSelectIconComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return MaterialSelectIconComponent;
}());
export { MaterialSelectIconComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtc2VsZWN0LWljb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLXNlbGVjdC1pY29uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN2RSxPQUFPLEVBQWlCLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQzs7SUE0RnBELHFDQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQXBDbEIsS0FBSzs0QkFDUixLQUFLOzBCQUVBLEVBQUU7dUJBQ1osT0FBTzs0QkFLRjtZQUNiLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osUUFBUTtZQUNSLGlCQUFpQjtZQUNqQixVQUFVO1lBQ1YsWUFBWTtZQUNaLGFBQWE7WUFDYixhQUFhO1lBQ2IsVUFBVTtZQUNWLFlBQVk7WUFDWixTQUFTO1lBQ1QsV0FBVztZQUNYLFVBQVU7WUFDVixZQUFZO1lBQ1osU0FBUztZQUNULFNBQVM7WUFDVCxhQUFhO1lBQ2IsY0FBYztZQUNkLFFBQVE7WUFDUixTQUFTO1lBQ1QsVUFBVTtZQUNWLGNBQWM7WUFDZCxTQUFTO1NBQ1Y7S0FJSTtJQUVMLDhDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDeEgsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3JEO0tBQ0Y7SUFFRCxpREFBVyxHQUFYLFVBQVksS0FBSztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pDOztnQkE3R0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLFFBQVEsRUFBRSxpOERBc0MyQztvQkFDckQsTUFBTSxFQUFFLENBQUMsOFBBT0w7cUJBQ0g7aUJBQ0Y7Ozs7Z0JBckRRLHFCQUFxQjs7OytCQStEM0IsS0FBSztnQ0FDTCxLQUFLOzhCQUNMLEtBQUs7O3NDQXBFUjs7U0F5RGEsMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBidWlsZFRpdGxlTWFwLCBpc0FycmF5IH0gZnJvbSAnLi4vLi4vc2hhcmVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtc2VsZWN0LWljb24td2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bWF0LWZvcm0tZmllbGRcbiAgICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIlxuICAgICAgW2Zsb2F0TGFiZWxdPVwib3B0aW9ucz8uZmxvYXRQbGFjZWhvbGRlciB8fCAob3B0aW9ucz8ubm90aXRsZSA/ICduZXZlcicgOiAnYXV0bycpXCJcbiAgICAgIFtzdHlsZS53aWR0aF09XCInMTAwJSdcIj5cbiAgICAgIDxzcGFuIG1hdFByZWZpeCAqbmdJZj1cIm9wdGlvbnM/LnByZWZpeCB8fCBvcHRpb25zPy5maWVsZEFkZG9uTGVmdFwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8ucHJlZml4IHx8IG9wdGlvbnM/LmZpZWxkQWRkb25MZWZ0XCI+PC9zcGFuPlxuICAgICAgPG1hdC1zZWxlY3RcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWQgKyAnU3RhdHVzJ1wiXG4gICAgICAgIFthdHRyLm5hbWVdPVwiY29udHJvbE5hbWVcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiY29udHJvbERpc2FibGVkIHx8IG9wdGlvbnM/LnJlYWRvbmx5XCJcbiAgICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICAgIFttdWx0aXBsZV09XCJvcHRpb25zPy5tdWx0aXBsZVwiXG4gICAgICAgIFtwbGFjZWhvbGRlcl09XCJvcHRpb25zPy5ub3RpdGxlID8gb3B0aW9ucz8ucGxhY2Vob2xkZXIgOiBvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIFtyZXF1aXJlZF09XCJvcHRpb25zPy5yZXF1aXJlZFwiXG4gICAgICAgIFtzdHlsZS53aWR0aF09XCInMTAwJSdcIlxuICAgICAgICBbdmFsdWVdPVwiY29udHJvbFZhbHVlXCJcbiAgICAgICAgKGJsdXIpPVwib3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZVwiXG4gICAgICAgIChzZWxlY3Rpb25DaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiXG4gICAgICAgIFsobmdNb2RlbCldPVwiY29udHJvbFZhbHVlXCI+XG4gICAgICAgIDxtYXQtc2VsZWN0LXRyaWdnZXIgKm5nSWY9XCJjb250cm9sVmFsdWVcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImZhIGFsaWduLW1pZGRsZVwiIFtuZ0NsYXNzXT1cImNvbnRyb2xWYWx1ZVwiPjwvaT5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tbmFtZVwiPnt7IGNvbnRyb2xWYWx1ZSB9fTwvc3Bhbj5cbiAgICAgICAgPC9tYXQtc2VsZWN0LXRyaWdnZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtc2VsZWN0SXRlbSBbbmdGb3JPZl09XCJzZWxlY3RMaXN0XCI+XG4gICAgICAgICAgPG1hdC1vcHRpb25cbiAgICAgICAgICAgIFt2YWx1ZV09XCJzZWxlY3RJdGVtXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGFsaWduLW1pZGRsZVwiIFtuZ0NsYXNzXT1cInNlbGVjdEl0ZW1cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tbmFtZVwiPnt7IHNlbGVjdEl0ZW0gfX08L3NwYW4+XG4gICAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9tYXQtc2VsZWN0PlxuICAgICAgPHNwYW4gbWF0U3VmZml4ICpuZ0lmPVwib3B0aW9ucz8uc3VmZml4IHx8IG9wdGlvbnM/LmZpZWxkQWRkb25SaWdodFwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uc3VmZml4IHx8IG9wdGlvbnM/LmZpZWxkQWRkb25SaWdodFwiPjwvc3Bhbj5cbiAgICAgIDxtYXQtaGludCAqbmdJZj1cIm9wdGlvbnM/LmRlc2NyaXB0aW9uICYmICghb3B0aW9ucz8uc2hvd0Vycm9ycyB8fCAhb3B0aW9ucz8uZXJyb3JNZXNzYWdlKVwiXG4gICAgICAgIGFsaWduPVwiZW5kXCIgW2lubmVySFRNTF09XCJvcHRpb25zPy5kZXNjcmlwdGlvblwiPjwvbWF0LWhpbnQ+XG4gICAgPC9tYXQtZm9ybS1maWVsZD5cbiAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5lcnJvck1lc3NhZ2VcIj48L21hdC1lcnJvcj5gLFxuICBzdHlsZXM6IFtgXG4gICAgbWF0LWVycm9yIHsgZm9udC1zaXplOiA3NSU7IG1hcmdpbi10b3A6IC0xcmVtOyBtYXJnaW4tYm90dG9tOiAwLjVyZW07IH1cbiAgICA6Om5nLWRlZXAgbWF0LWZvcm0tZmllbGQgLm1hdC1mb3JtLWZpZWxkLXdyYXBwZXIgLm1hdC1mb3JtLWZpZWxkLWZsZXhcbiAgICAgIC5tYXQtZm9ybS1maWVsZC1pbmZpeCB7IHdpZHRoOiBpbml0aWFsOyB9XG5cbiAgICAuaWNvbi1uYW1lIHtcbiAgICAgIG1hcmdpbi1sZWZ0OjVweDtcbiAgICB9YFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFNlbGVjdEljb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIHNlbGVjdExpc3Q6IGFueVtdID0gW107XG4gIGlzQXJyYXkgPSBpc0FycmF5O1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBkZWZhdWx0SWNvbnMgPSBbXG4gICAgXCJmYS1hZGRyZXNzLWJvb2tcIixcbiAgICBcImZhLWFyY2hpdmVcIixcbiAgICBcImZhLWNhclwiLFxuICAgIFwiZmEtY2FtZXJhLXJldHJvXCIsXG4gICAgXCJmYS1jbG91ZFwiLFxuICAgIFwiZmEtYmF0aHR1YlwiLFxuICAgIFwiZmEtYnVsbGhvcm5cIixcbiAgICBcImZhLWNvbW1lbnRzXCIsXG4gICAgXCJmYS1jbG9uZVwiLFxuICAgIFwiZmEtY29sdW1uc1wiLFxuICAgIFwiZmEtY29kZVwiLFxuICAgIFwiZmEtZXJhc2VyXCIsXG4gICAgXCJmYS1lamVjdFwiLFxuICAgIFwiZmEtZGVza3RvcFwiLFxuICAgIFwiZmEtZmlyZVwiLFxuICAgIFwiZmEtY3ViZVwiLFxuICAgIFwiZmEtbGlzdC1hbHRcIixcbiAgICBcImZhLW1pY3JvY2hpcFwiLFxuICAgIFwiZmEtZmF4XCIsXG4gICAgXCJmYS1mbGFnXCIsXG4gICAgXCJmYS1wcmludFwiLFxuICAgIFwiZmEtcG93ZXItb2ZmXCIsXG4gICAgXCJmYS1iZWxsXCJcbiAgXVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLm9wdGlvbnMuZW51bSA/IHRoaXMuc2VsZWN0TGlzdCA9IHRoaXMuZGVmYXVsdEljb25zLmNvbmNhdCh0aGlzLm9wdGlvbnMuZW51bSkgOiB0aGlzLnNlbGVjdExpc3QgPSB0aGlzLmRlZmF1bHRJY29ucztcbiAgICBpZih0aGlzLmNvbnRyb2xWYWx1ZSAmJiB0aGlzLnNlbGVjdExpc3QuaW5kZXhPZih0aGlzLmNvbnRyb2xWYWx1ZSkgPT09IC0xKSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3QucHVzaCh0aGlzLmNvbnRyb2xWYWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMsICF0aGlzLm9wdGlvbnMucmVhZG9ubHkpO1xuICAgIGlmICghdGhpcy5vcHRpb25zLm5vdGl0bGUgJiYgIXRoaXMub3B0aW9ucy5kZXNjcmlwdGlvbiAmJiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVWYWx1ZShldmVudCkge1xuICAgIHRoaXMub3B0aW9ucy5zaG93RXJyb3JzID0gdHJ1ZTtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudC52YWx1ZSk7XG4gIH1cbn1cbiJdfQ==