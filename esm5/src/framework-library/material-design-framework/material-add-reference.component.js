import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialAddReferenceComponent = /** @class */ (function () {
    function MaterialAddReferenceComponent(jsf) {
        this.jsf = jsf;
    }
    MaterialAddReferenceComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "showAddButton", {
        get: function () {
            return !this.layoutNode.arrayItem ||
                this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    MaterialAddReferenceComponent.prototype.addItem = function (event) {
        event.preventDefault();
        this.jsf.addItem(this);
    };
    Object.defineProperty(MaterialAddReferenceComponent.prototype, "buttonText", {
        get: function () {
            var parent = {
                dataIndex: this.dataIndex.slice(0, -1),
                layoutIndex: this.layoutIndex.slice(0, -1),
                layoutNode: this.jsf.getParentNode(this),
            };
            return parent.layoutNode.add ||
                this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
        },
        enumerable: true,
        configurable: true
    });
    return MaterialAddReferenceComponent;
}());
export { MaterialAddReferenceComponent };
MaterialAddReferenceComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-add-reference-widget',
                template: "\n    <section [class]=\"options?.htmlClass || ''\" align=\"start\">\n      <button mat-mini-fab *ngIf=\"showAddButton\" \n        style=\"margin-bottom: 10px;\"\n        [color]=\"options?.color || 'accent'\"\n        [disabled]=\"options?.readonly\"\n        (click)=\"addItem($event)\"\n        matTooltip=\"{{options?.title}}\">\n        <mat-icon>add</mat-icon>\n      </button>\n    </section>",
                changeDetection: ChangeDetectionStrategy.Default,
            },] },
];
/** @nocollapse */
MaterialAddReferenceComponent.ctorParameters = function () { return [
    { type: JsonSchemaFormService, },
]; };
MaterialAddReferenceComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};
//# sourceMappingURL=material-add-reference.component.js.map
