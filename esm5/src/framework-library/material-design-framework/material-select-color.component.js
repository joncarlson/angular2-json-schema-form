import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isArray } from '../../shared';
var MaterialSelectColorComponent = /** @class */ (function () {
    function MaterialSelectColorComponent(jsf) {
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
    MaterialSelectColorComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.selectList = this.options.enum || this.defaultColors;
        this.jsf.initializeControl(this, !this.options.readonly);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialSelectColorComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    };
    return MaterialSelectColorComponent;
}());
export { MaterialSelectColorComponent };
MaterialSelectColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-select-color-widget',
                template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatPlaceholder || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <mat-select\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.name]=\"controlName\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [multiple]=\"options?.multiple\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [value]=\"controlValue\"\n        (blur)=\"options.showErrors = true\"\n        (selectionChange)=\"updateValue($event)\"\n        [(ngModel)]=\"selected\">\n        <mat-select-trigger *ngIf=\"selected\">\n          <span class=\"color-box\" [style.background-color]=\"selected\"></span>\n          <span>{{ selected}}</span>\n        </mat-select-trigger>\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <mat-option\n            [value]=\"selectItem\">\n            <span class=\"color-box\" [style.background-color]=\"selectItem\"></span>\n            <span>{{ selectItem }}</span>\n          </mat-option>\n        </ng-template>\n      </mat-select>\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
                styles: ["\n    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }\n    ::ng-deep mat-form-field .mat-form-field-wrapper .mat-form-field-flex\n      .mat-form-field-infix { width: initial; }\n\n    .color-box {\n      display:inline-block;\n      height:14px;\n      width:14px;\n      margin-right:4px;\n      border:1px solid #000;\n    }"
                ],
            },] },
];
/** @nocollapse */
MaterialSelectColorComponent.ctorParameters = function () { return [
    { type: JsonSchemaFormService, },
]; };
MaterialSelectColorComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};
//# sourceMappingURL=material-select-color.component.js.map
