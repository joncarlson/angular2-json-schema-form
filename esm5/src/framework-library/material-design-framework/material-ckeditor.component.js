import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialCkeditorComponent = /** @class */ (function () {
    function MaterialCkeditorComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.config = {
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            toolbarGroups: [
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'forms' },
                { name: 'tools' },
                { name: 'document',
                    groups: ['mode', 'document', 'doctools'] },
                { name: 'others' },
                '/',
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
                { name: 'styles' },
                { name: 'colors' },
                { name: 'about' }
            ],
            // Remove some buttons provided by the standard plugins, which are
            // not needed in the Standard(s) toolbar.
            removeButtons: 'Underline',
            // Set the most common block elements.
            format_tags: 'p;h1;h2;h3;pre',
            // Simplify the dialog windows.
            removeDialogTabs: 'image:advanced;link:advanced',
            filebrowserBrowseUrl: '/browser/browse.php',
            filebrowserUploadUrl: '/uploader/upload.php'
        };
    }
    MaterialCkeditorComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialCkeditorComponent.prototype.commentsClick = function () {
        console.log(this.layoutNode.dataPointer);
    };
    MaterialCkeditorComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event);
    };
    return MaterialCkeditorComponent;
}());
export { MaterialCkeditorComponent };
MaterialCkeditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-ckeditor-widget',
                template: "<div\n    [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <ck-editor (ngModelChange)=\"updateValue($event)\" [(ngModel)]=\"controlValue\" [name]=\"controlName\" [config]=\"config\">\n      </ck-editor>\n       <button mat-mini-fab *ngIf=\"options?.comments\" color=\"primary\" (click)=\"commentsClick()\"><mat-icon>comment</mat-icon></button>\n    </div>\n    "
            },] },
];
/** @nocollapse */
MaterialCkeditorComponent.ctorParameters = function () { return [
    { type: JsonSchemaFormService, },
]; };
MaterialCkeditorComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};
//# sourceMappingURL=material-ckeditor.component.js.map