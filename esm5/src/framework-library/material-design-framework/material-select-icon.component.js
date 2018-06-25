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
            "fa-power-off"
        ];
    }
    MaterialSelectIconComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.selectList = this.options.enum || this.defaultIcons;
        // this.selectList = buildTitleMap(
        //   this.options.titleMap || this.options.enumNames,
        //   this.options.enum, !!this.options.required, !!this.options.flatList
        // );
        this.jsf.initializeControl(this, !this.options.readonly);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialSelectIconComponent.prototype.updateValue = function (event) {
        this.options.showErrors = true;
        this.jsf.updateValue(this, event.value);
    };
    return MaterialSelectIconComponent;
}());
export { MaterialSelectIconComponent };
MaterialSelectIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-select-icon-widget',
                template: "\n    <mat-form-field\n      [class]=\"options?.htmlClass || ''\"\n      [floatLabel]=\"options?.floatPlaceholder || (options?.notitle ? 'never' : 'auto')\"\n      [style.width]=\"'100%'\">\n      <span matPrefix *ngIf=\"options?.prefix || options?.fieldAddonLeft\"\n        [innerHTML]=\"options?.prefix || options?.fieldAddonLeft\"></span>\n      <mat-select\n        [attr.aria-describedby]=\"'control' + layoutNode?._id + 'Status'\"\n        [attr.name]=\"controlName\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [id]=\"'control' + layoutNode?._id\"\n        [multiple]=\"options?.multiple\"\n        [placeholder]=\"options?.notitle ? options?.placeholder : options?.title\"\n        [required]=\"options?.required\"\n        [style.width]=\"'100%'\"\n        [value]=\"controlValue\"\n        (blur)=\"options.showErrors = true\"\n        (selectionChange)=\"updateValue($event)\"\n        [(ngModel)]=\"selected\">\n        <mat-select-trigger *ngIf=\"selected\">\n          <i class=\"fa align-middle\" [ngClass]=\"selected\"></i>\n          <span class=\"icon-name\">{{ selected }}</span>\n        </mat-select-trigger>\n        <ng-template ngFor let-selectItem [ngForOf]=\"selectList\">\n          <mat-option\n            [value]=\"selectItem\">\n            <i class=\"fa align-middle\" [ngClass]=\"selectItem\"></i>\n            <span class=\"icon-name\">{{ selectItem }}</span>\n          </mat-option>\n        </ng-template>\n      </mat-select>\n      <span matSuffix *ngIf=\"options?.suffix || options?.fieldAddonRight\"\n        [innerHTML]=\"options?.suffix || options?.fieldAddonRight\"></span>\n      <mat-hint *ngIf=\"options?.description && (!options?.showErrors || !options?.errorMessage)\"\n        align=\"end\" [innerHTML]=\"options?.description\"></mat-hint>\n    </mat-form-field>\n    <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n      [innerHTML]=\"options?.errorMessage\"></mat-error>",
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
//# sourceMappingURL=material-select-icon.component.js.map
