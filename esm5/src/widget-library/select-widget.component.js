import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var SelectWidgetComponent = /** @class */ (function () {
    function SelectWidgetComponent(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    SelectWidgetComponent.prototype.ngOnInit = function () {
        this.updateComponent();
    };
    SelectWidgetComponent.prototype.ngOnChanges = function () {
        this.updateComponent();
    };
    SelectWidgetComponent.prototype.updateComponent = function () {
        if (!this.newComponent && (this.layoutNode || {}).widget) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.widget));
        }
        if (this.newComponent) {
            try {
                for (var _a = tslib_1.__values(['layoutNode', 'layoutIndex', 'dataIndex']), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var input = _b.value;
                    this.newComponent.instance[input] = this[input];
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
    SelectWidgetComponent.decorators = [
        { type: Component, args: [{
                    selector: 'select-widget-widget',
                    template: "<div #widgetContainer></div>",
                },] },
    ];
    /** @nocollapse */
    SelectWidgetComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver, },
        { type: JsonSchemaFormService, },
    ]; };
    SelectWidgetComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
        "widgetContainer": [{ type: ViewChild, args: ['widgetContainer', { read: ViewContainerRef },] },],
    };
    return SelectWidgetComponent;
}());
export { SelectWidgetComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3dpZGdldC1saWJyYXJ5L3NlbGVjdC13aWRnZXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLHdCQUF3QixFQUFnQixLQUFLLEVBQ3JDLFNBQVMsRUFBRSxnQkFBZ0IsRUFDL0MsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0lBY2xFLCtCQUNVLGdCQUEwQyxFQUMxQyxHQUEwQjtRQUQxQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTBCO1FBQzFDLFFBQUcsR0FBSCxHQUFHLENBQXVCOzRCQVRGLElBQUk7S0FVakM7SUFFTCx3Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0tBQ3hCO0lBRUQsMkNBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN4QjtJQUVELCtDQUFlLEdBQWY7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQ3RFLENBQUM7U0FDSDtRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOztnQkFDdEIsR0FBRyxDQUFDLENBQWdCLElBQUEsS0FBQSxpQkFBQSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUEsZ0JBQUE7b0JBQXpELElBQU0sS0FBSyxXQUFBO29CQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDakQ7Ozs7Ozs7OztTQUNGOztLQUNGOztnQkFwQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSw4QkFBOEI7aUJBQ3pDOzs7O2dCQVRZLHdCQUF3QjtnQkFJNUIscUJBQXFCOzs7K0JBUTNCLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxLQUFLO29DQUNMLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTs7Z0NBaEIxRDs7U0FXYSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgQ29tcG9uZW50UmVmLCBJbnB1dCxcbiAgT25DaGFuZ2VzLCBPbkluaXQsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2VsZWN0LXdpZGdldC13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3dpZGdldENvbnRhaW5lcj48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCB7XG4gIG5ld0NvbXBvbmVudDogQ29tcG9uZW50UmVmPGFueT4gPSBudWxsO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcbiAgQFZpZXdDaGlsZCgnd2lkZ2V0Q29udGFpbmVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pXG4gICAgd2lkZ2V0Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy51cGRhdGVDb21wb25lbnQoKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbXBvbmVudCgpIHtcbiAgICBpZiAoIXRoaXMubmV3Q29tcG9uZW50ICYmICh0aGlzLmxheW91dE5vZGUgfHwge30pLndpZGdldCkge1xuICAgICAgdGhpcy5uZXdDb21wb25lbnQgPSB0aGlzLndpZGdldENvbnRhaW5lci5jcmVhdGVDb21wb25lbnQoXG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeS5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0aGlzLmxheW91dE5vZGUud2lkZ2V0KVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmV3Q29tcG9uZW50KSB7XG4gICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIFsnbGF5b3V0Tm9kZScsICdsYXlvdXRJbmRleCcsICdkYXRhSW5kZXgnXSkge1xuICAgICAgICB0aGlzLm5ld0NvbXBvbmVudC5pbnN0YW5jZVtpbnB1dF0gPSB0aGlzW2lucHV0XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==