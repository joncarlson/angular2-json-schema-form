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
            "fa-power-off"
        ];
    }
    ngOnInit() {
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
        [(ngModel)]="selected">
        <mat-select-trigger *ngIf="selected">
          <i class="fa align-middle" [ngClass]="selected"></i>
          <span class="icon-name">{{ selected }}</span>
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
//# sourceMappingURL=material-select-icon.component.js.map
