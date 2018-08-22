import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { buildTitleMap } from '../../shared';
// TODO: Change this to use a Selection List instead?
// https://material.angular.io/components/list/overview
var MaterialCheckboxesComponent = /** @class */ (function () {
    function MaterialCheckboxesComponent(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.horizontalList = false;
        this.checkboxList = [];
    }
    MaterialCheckboxesComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.horizontalList = this.layoutNode.type === 'checkboxes-inline' ||
            this.layoutNode.type === 'checkboxbuttons';
        this.jsf.initializeControl(this);
        this.checkboxList = buildTitleMap(this.options.titleMap || this.options.enumNames, this.options.enum, true);
        if (this.boundControl) {
            var formArray = this.jsf.getFormControl(this);
            try {
                for (var _a = tslib_1.__values(this.checkboxList), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var checkboxItem = _b.value;
                    checkboxItem.checked = formArray.value.includes(checkboxItem.value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var e_1, _c;
    };
    Object.defineProperty(MaterialCheckboxesComponent.prototype, "allChecked", {
        get: function () {
            return this.checkboxList.filter(function (t) { return t.checked; }).length === this.checkboxList.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialCheckboxesComponent.prototype, "someChecked", {
        get: function () {
            var checkedItems = this.checkboxList.filter(function (t) { return t.checked; }).length;
            return checkedItems > 0 && checkedItems < this.checkboxList.length;
        },
        enumerable: true,
        configurable: true
    });
    MaterialCheckboxesComponent.prototype.updateValue = function () {
        this.options.showErrors = true;
        if (this.boundControl) {
            this.jsf.updateArrayCheckboxList(this, this.checkboxList);
        }
    };
    MaterialCheckboxesComponent.prototype.updateAllValues = function (event) {
        this.options.showErrors = true;
        this.checkboxList.forEach(function (t) { return t.checked = event.checked; });
        this.updateValue();
    };
    MaterialCheckboxesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-checkboxes-widget',
                    template: "\n    <div>\n      <mat-checkbox type=\"checkbox\"\n        [checked]=\"allChecked\"\n        [color]=\"options?.color || 'primary'\"\n        [disabled]=\"controlDisabled || options?.readonly\"\n        [indeterminate]=\"someChecked\"\n        [name]=\"options?.name\"\n        (blur)=\"options.showErrors = true\"\n        (change)=\"updateAllValues($event)\">\n        <span class=\"checkbox-name\" [innerHTML]=\"options?.name\"></span>\n      </mat-checkbox>\n      <label *ngIf=\"options?.title\"\n        class=\"title\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <ul class=\"checkbox-list\" [class.horizontal-list]=\"horizontalList\">\n        <li *ngFor=\"let checkboxItem of checkboxList\"\n          [class]=\"options?.htmlClass || ''\">\n          <mat-checkbox type=\"checkbox\"\n            [(ngModel)]=\"checkboxItem.checked\"\n            [color]=\"options?.color || 'primary'\"\n            [disabled]=\"controlDisabled || options?.readonly\"\n            [name]=\"checkboxItem?.name\"\n            (blur)=\"options.showErrors = true\"\n            (change)=\"updateValue()\">\n            <span class=\"checkbox-name\" [innerHTML]=\"checkboxItem?.name\"></span>\n          </mat-checkbox>\n        </li>\n      </ul>\n      <mat-error *ngIf=\"options?.showErrors && options?.errorMessage\"\n        [innerHTML]=\"options?.errorMessage\"></mat-error>\n    </div>",
                    styles: ["\n    .title { font-weight: bold; }\n    .checkbox-list { list-style-type: none; }\n    .horizontal-list > li { display: inline-block; margin-right: 10px; zoom: 1; }\n    .checkbox-name { white-space: nowrap; }\n    mat-error { font-size: 75%; }\n  "],
                },] },
    ];
    /** @nocollapse */
    MaterialCheckboxesComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    MaterialCheckboxesComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return MaterialCheckboxesComponent;
}());
export { MaterialCheckboxesComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2hlY2tib3hlcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtY2hlY2tib3hlcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBZ0IsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNyRixPQUFPLEVBQWtCLGFBQWEsRUFBdUIsTUFBTSxjQUFjLENBQUM7Ozs7SUErRGhGLHFDQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQVhsQixLQUFLOzRCQUNSLEtBQUs7OEJBRUgsS0FBSzs0QkFFUyxFQUFFO0tBTzVCO0lBRUwsOENBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssbUJBQW1CO1lBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FDekUsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFDaEQsR0FBRyxDQUFDLENBQXVCLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsWUFBWSxDQUFBLGdCQUFBO29CQUF2QyxJQUFNLFlBQVksV0FBQTtvQkFDckIsWUFBWSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3JFOzs7Ozs7Ozs7U0FDRjs7S0FDRjtJQUVELHNCQUFJLG1EQUFVO2FBQWQ7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztTQUNyRjs7O09BQUE7SUFFRCxzQkFBSSxvREFBVzthQUFmO1lBQ0UsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNyRSxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FDcEU7OztPQUFBO0lBRUQsaURBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7S0FDRjtJQUVELHFEQUFlLEdBQWYsVUFBZ0IsS0FBVTtRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQXpCLENBQXlCLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDcEI7O2dCQWxHRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFLGcrQ0FpQ0Q7b0JBQ1QsTUFBTSxFQUFFLENBQUMsMlBBTVIsQ0FBQztpQkFDSDs7OztnQkFqRFEscUJBQXFCOzs7K0JBNEQzQixLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzs7c0NBakVSOztTQXFEYSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1BcnJheSwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UsIFRpdGxlTWFwSXRlbSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBidWlsZEZvcm1Hcm91cCwgYnVpbGRUaXRsZU1hcCwgaGFzT3duLCBKc29uUG9pbnRlciB9IGZyb20gJy4uLy4uL3NoYXJlZCc7XG5cbi8vIFRPRE86IENoYW5nZSB0aGlzIHRvIHVzZSBhIFNlbGVjdGlvbiBMaXN0IGluc3RlYWQ/XG4vLyBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vY29tcG9uZW50cy9saXN0L292ZXJ2aWV3XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdGVyaWFsLWNoZWNrYm94ZXMtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2PlxuICAgICAgPG1hdC1jaGVja2JveCB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICBbY2hlY2tlZF09XCJhbGxDaGVja2VkXCJcbiAgICAgICAgW2NvbG9yXT1cIm9wdGlvbnM/LmNvbG9yIHx8ICdwcmltYXJ5J1wiXG4gICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICBbaW5kZXRlcm1pbmF0ZV09XCJzb21lQ2hlY2tlZFwiXG4gICAgICAgIFtuYW1lXT1cIm9wdGlvbnM/Lm5hbWVcIlxuICAgICAgICAoYmx1cik9XCJvcHRpb25zLnNob3dFcnJvcnMgPSB0cnVlXCJcbiAgICAgICAgKGNoYW5nZSk9XCJ1cGRhdGVBbGxWYWx1ZXMoJGV2ZW50KVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LW5hbWVcIiBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/Lm5hbWVcIj48L3NwYW4+XG4gICAgICA8L21hdC1jaGVja2JveD5cbiAgICAgIDxsYWJlbCAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJ0aXRsZVwiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L2xhYmVsPlxuICAgICAgPHVsIGNsYXNzPVwiY2hlY2tib3gtbGlzdFwiIFtjbGFzcy5ob3Jpem9udGFsLWxpc3RdPVwiaG9yaXpvbnRhbExpc3RcIj5cbiAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBjaGVja2JveEl0ZW0gb2YgY2hlY2tib3hMaXN0XCJcbiAgICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICAgICAgPG1hdC1jaGVja2JveCB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJjaGVja2JveEl0ZW0uY2hlY2tlZFwiXG4gICAgICAgICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sRGlzYWJsZWQgfHwgb3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICAgICAgW25hbWVdPVwiY2hlY2tib3hJdGVtPy5uYW1lXCJcbiAgICAgICAgICAgIChibHVyKT1cIm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWVcIlxuICAgICAgICAgICAgKGNoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgpXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LW5hbWVcIiBbaW5uZXJIVE1MXT1cImNoZWNrYm94SXRlbT8ubmFtZVwiPjwvc3Bhbj5cbiAgICAgICAgICA8L21hdC1jaGVja2JveD5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8bWF0LWVycm9yICpuZ0lmPVwib3B0aW9ucz8uc2hvd0Vycm9ycyAmJiBvcHRpb25zPy5lcnJvck1lc3NhZ2VcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmVycm9yTWVzc2FnZVwiPjwvbWF0LWVycm9yPlxuICAgIDwvZGl2PmAsXG4gIHN0eWxlczogW2BcbiAgICAudGl0bGUgeyBmb250LXdlaWdodDogYm9sZDsgfVxuICAgIC5jaGVja2JveC1saXN0IHsgbGlzdC1zdHlsZS10eXBlOiBub25lOyB9XG4gICAgLmhvcml6b250YWwtbGlzdCA+IGxpIHsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBtYXJnaW4tcmlnaHQ6IDEwcHg7IHpvb206IDE7IH1cbiAgICAuY2hlY2tib3gtbmFtZSB7IHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgICBtYXQtZXJyb3IgeyBmb250LXNpemU6IDc1JTsgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxDaGVja2JveGVzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBob3Jpem9udGFsTGlzdCA9IGZhbHNlO1xuICBmb3JtQXJyYXk6IEFic3RyYWN0Q29udHJvbDtcbiAgY2hlY2tib3hMaXN0OiBUaXRsZU1hcEl0ZW1bXSA9IFtdO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5ob3Jpem9udGFsTGlzdCA9IHRoaXMubGF5b3V0Tm9kZS50eXBlID09PSAnY2hlY2tib3hlcy1pbmxpbmUnIHx8XG4gICAgICB0aGlzLmxheW91dE5vZGUudHlwZSA9PT0gJ2NoZWNrYm94YnV0dG9ucyc7XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcyk7XG4gICAgdGhpcy5jaGVja2JveExpc3QgPSBidWlsZFRpdGxlTWFwKFxuICAgICAgdGhpcy5vcHRpb25zLnRpdGxlTWFwIHx8IHRoaXMub3B0aW9ucy5lbnVtTmFtZXMsIHRoaXMub3B0aW9ucy5lbnVtLCB0cnVlXG4gICAgKTtcbiAgICBpZiAodGhpcy5ib3VuZENvbnRyb2wpIHtcbiAgICAgIGNvbnN0IGZvcm1BcnJheSA9IHRoaXMuanNmLmdldEZvcm1Db250cm9sKHRoaXMpO1xuICAgICAgZm9yIChjb25zdCBjaGVja2JveEl0ZW0gb2YgdGhpcy5jaGVja2JveExpc3QpIHtcbiAgICAgICAgY2hlY2tib3hJdGVtLmNoZWNrZWQgPSBmb3JtQXJyYXkudmFsdWUuaW5jbHVkZXMoY2hlY2tib3hJdGVtLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgYWxsQ2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2JveExpc3QuZmlsdGVyKHQgPT4gdC5jaGVja2VkKS5sZW5ndGggPT09IHRoaXMuY2hlY2tib3hMaXN0Lmxlbmd0aDtcbiAgfVxuXG4gIGdldCBzb21lQ2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBjaGVja2VkSXRlbXMgPSB0aGlzLmNoZWNrYm94TGlzdC5maWx0ZXIodCA9PiB0LmNoZWNrZWQpLmxlbmd0aDtcbiAgICByZXR1cm4gY2hlY2tlZEl0ZW1zID4gMCAmJiBjaGVja2VkSXRlbXMgPCB0aGlzLmNoZWNrYm94TGlzdC5sZW5ndGg7XG4gIH1cblxuICB1cGRhdGVWYWx1ZSgpIHtcbiAgICB0aGlzLm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWU7XG4gICAgaWYgKHRoaXMuYm91bmRDb250cm9sKSB7XG4gICAgICB0aGlzLmpzZi51cGRhdGVBcnJheUNoZWNrYm94TGlzdCh0aGlzLCB0aGlzLmNoZWNrYm94TGlzdCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQWxsVmFsdWVzKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm9wdGlvbnMuc2hvd0Vycm9ycyA9IHRydWU7XG4gICAgdGhpcy5jaGVja2JveExpc3QuZm9yRWFjaCh0ID0+IHQuY2hlY2tlZCA9IGV2ZW50LmNoZWNrZWQpO1xuICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcbiAgfVxufVxuIl19