import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export class MaterialAddReferenceComponent {
    constructor(jsf) {
        this.jsf = jsf;
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
    }
    get showAddButton() {
        return !this.layoutNode.arrayItem ||
            this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
    }
    addItem(event) {
        event.preventDefault();
        this.jsf.addItem(this);
    }
    get buttonText() {
        const parent = {
            dataIndex: this.dataIndex.slice(0, -1),
            layoutIndex: this.layoutIndex.slice(0, -1),
            layoutNode: this.jsf.getParentNode(this),
        };
        return parent.layoutNode.add ||
            this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
    }
}
MaterialAddReferenceComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-add-reference-widget',
                template: `
    <section [class]="options?.htmlClass || ''" align="start">
      <button mat-mini-fab *ngIf="showAddButton" 
        style="margin-bottom: 10px;"
        [color]="options?.color || 'accent'"
        [disabled]="options?.readonly"
        (click)="addItem($event)"
        matTooltip="{{options?.title}}">
        <mat-icon>add</mat-icon>
      </button>
    </section>`,
                changeDetection: ChangeDetectionStrategy.Default,
            },] },
];
/** @nocollapse */
MaterialAddReferenceComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialAddReferenceComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};
//# sourceMappingURL=material-add-reference.component.js.map
