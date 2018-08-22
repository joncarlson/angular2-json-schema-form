import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { buildTitleMap } from '../../shared';
var MaterialButtonGroupComponent = /** @class */ (function () {
    function MaterialButtonGroupComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.radiosList = [];
        this.vertical = false;
    }
    MaterialButtonGroupComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.radiosList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        this.jsf.initializeControl(this);
    };
    MaterialButtonGroupComponent.prototype.updateValue = function (value) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, value);
    };
    MaterialButtonGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-button-group-widget',
                    template: "\n    <div>\n      <div *ngIf=\"options?.title\">\n        <label\n          [attr.for]=\"'control' + layoutNode?._id\"\n          [class]=\"options?.labelHtmlClass || ''\"\n          [style.display]=\"options?.notitle ? 'none' : ''\"\n          [innerHTML]=\"options?.title\"></label>\n      </div>\n      <mat-button-toggle-group\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.readonly]=\"options?.readonly ? 'readonly' : null\"\n        [attr.required]=\"options?.required\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [name]=\"controlName\"\n        [value]=\"controlValue\"\n        [vertical]=\"!!options.vertical\">\n        <mat-button-toggle *ngFor=\"let radioItem of radiosList\"\n          [id]=\"'control' + layoutNode?._id + '/' + radioItem?.name\"\n          [value]=\"radioItem?.value\"\n          (click)=\"updateValue(radioItem?.value)\">\n          <span [innerHTML]=\"radioItem?.name\"></span>\n        </mat-button-toggle>\n      </mat-button-toggle-group>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>",
                    styles: [" mat-error { font-size: 75%; } "],
                },] },
    ];
    /** @nocollapse */
    MaterialButtonGroupComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    MaterialButtonGroupComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return MaterialButtonGroupComponent;
}());
export { MaterialButtonGroupComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay9tYXRlcmlhbC1idXR0b24tZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxjQUFjLENBQUM7O0lBOEMzQyxzQ0FDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjsrQkFWbEIsS0FBSzs0QkFDUixLQUFLOzBCQUVBLEVBQUU7d0JBQ1gsS0FBSztLQU9YO0lBRUwsK0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUN4QixDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQztJQUVELGtEQUFXLEdBQVgsVUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNuQzs7Z0JBNURGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsOEJBQThCO29CQUN4QyxRQUFRLEVBQUUseXFDQTBCRDtvQkFDUCxNQUFNLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztpQkFDOUM7Ozs7Z0JBakNRLHFCQUFxQjs7OytCQTJDM0IsS0FBSztnQ0FDTCxLQUFLOzhCQUNMLEtBQUs7O3VDQWhEUjs7U0FxQ2EsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBidWlsZFRpdGxlTWFwIH0gZnJvbSAnLi4vLi4vc2hhcmVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtYnV0dG9uLWdyb3VwLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiPlxuICAgICAgICA8bGFiZWxcbiAgICAgICAgICBbYXR0ci5mb3JdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy50aXRsZVwiPjwvbGFiZWw+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cFxuICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICdTdGF0dXMnXCJcbiAgICAgICAgW2F0dHIucmVhZG9ubHldPVwib3B0aW9ucz8ucmVhZG9ubHkgPyAncmVhZG9ubHknIDogbnVsbFwiXG4gICAgICAgIFthdHRyLnJlcXVpcmVkXT1cIm9wdGlvbnM/LnJlcXVpcmVkXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2xEaXNhYmxlZCB8fCBvcHRpb25zPy5yZWFkb25seVwiXG4gICAgICAgIFtuYW1lXT1cImNvbnRyb2xOYW1lXCJcbiAgICAgICAgW3ZhbHVlXT1cImNvbnRyb2xWYWx1ZVwiXG4gICAgICAgIFt2ZXJ0aWNhbF09XCIhIW9wdGlvbnMudmVydGljYWxcIj5cbiAgICAgICAgPG1hdC1idXR0b24tdG9nZ2xlICpuZ0Zvcj1cImxldCByYWRpb0l0ZW0gb2YgcmFkaW9zTGlzdFwiXG4gICAgICAgICAgW2lkXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZCArICcvJyArIHJhZGlvSXRlbT8ubmFtZVwiXG4gICAgICAgICAgW3ZhbHVlXT1cInJhZGlvSXRlbT8udmFsdWVcIlxuICAgICAgICAgIChjbGljayk9XCJ1cGRhdGVWYWx1ZShyYWRpb0l0ZW0/LnZhbHVlKVwiPlxuICAgICAgICAgIDxzcGFuIFtpbm5lckhUTUxdPVwicmFkaW9JdGVtPy5uYW1lXCI+PC9zcGFuPlxuICAgICAgICA8L21hdC1idXR0b24tdG9nZ2xlPlxuICAgICAgPC9tYXQtYnV0dG9uLXRvZ2dsZS1ncm91cD5cbiAgICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJvcHRpb25zPy5zaG93RXJyb3JzICYmIG9wdGlvbnM/LmVycm9yTWVzc2FnZVwiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8uZXJyb3JNZXNzYWdlXCI+PC9tYXQtZXJyb3I+XG4gICAgPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgIG1hdC1lcnJvciB7IGZvbnQtc2l6ZTogNzUlOyB9IGBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbEJ1dHRvbkdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICByYWRpb3NMaXN0OiBhbnlbXSA9IFtdO1xuICB2ZXJ0aWNhbCA9IGZhbHNlO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5yYWRpb3NMaXN0ID0gYnVpbGRUaXRsZU1hcChcbiAgICAgIHRoaXMub3B0aW9ucy50aXRsZU1hcCB8fCB0aGlzLm9wdGlvbnMuZW51bU5hbWVzLFxuICAgICAgdGhpcy5vcHRpb25zLmVudW0sIHRydWVcbiAgICApO1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWU7XG4gICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgdmFsdWUpO1xuICB9XG59XG4iXX0=