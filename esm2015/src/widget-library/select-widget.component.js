import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class SelectWidgetComponent {
    constructor(componentFactory, jsf) {
        this.componentFactory = componentFactory;
        this.jsf = jsf;
        this.newComponent = null;
    }
    ngOnInit() {
        this.updateComponent();
    }
    ngOnChanges() {
        this.updateComponent();
    }
    updateComponent() {
        if (!this.newComponent && (this.layoutNode || {}).widget) {
            this.newComponent = this.widgetContainer.createComponent(this.componentFactory.resolveComponentFactory(this.layoutNode.widget));
        }
        if (this.newComponent) {
            for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
                this.newComponent.instance[input] = this[input];
            }
        }
    }
}
SelectWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'select-widget-widget',
                template: `<div #widgetContainer></div>`,
            },] },
];
/** @nocollapse */
SelectWidgetComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver, },
    { type: JsonSchemaFormService, },
];
SelectWidgetComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
    "widgetContainer": [{ type: ViewChild, args: ['widgetContainer', { read: ViewContainerRef },] },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3dpZGdldC1saWJyYXJ5L3NlbGVjdC13aWRnZXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsd0JBQXdCLEVBQWdCLEtBQUssRUFDckMsU0FBUyxFQUFFLGdCQUFnQixFQUMvQyxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQU1wRSxNQUFNO0lBUUosWUFDVSxnQkFBMEMsRUFDMUMsR0FBMEI7UUFEMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEwQjtRQUMxQyxRQUFHLEdBQUgsR0FBRyxDQUF1Qjs0QkFURixJQUFJO0tBVWpDO0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN4QjtJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDeEI7SUFFRCxlQUFlO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQ3RELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUN0RSxDQUFDO1NBQ0g7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakQ7U0FDRjtLQUNGOzs7WUFwQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSw4QkFBOEI7YUFDekM7Ozs7WUFUWSx3QkFBd0I7WUFJNUIscUJBQXFCOzs7MkJBUTNCLEtBQUs7NEJBQ0wsS0FBSzswQkFDTCxLQUFLO2dDQUNMLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBDb21wb25lbnRSZWYsIElucHV0LFxuICBPbkNoYW5nZXMsIE9uSW5pdCwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzZWxlY3Qtd2lkZ2V0LXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgPGRpdiAjd2lkZ2V0Q29udGFpbmVyPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFdpZGdldENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0IHtcbiAgbmV3Q29tcG9uZW50OiBDb21wb25lbnRSZWY8YW55PiA9IG51bGw7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuICBAVmlld0NoaWxkKCd3aWRnZXRDb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSlcbiAgICB3aWRnZXRDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudCgpO1xuICB9XG5cbiAgdXBkYXRlQ29tcG9uZW50KCkge1xuICAgIGlmICghdGhpcy5uZXdDb21wb25lbnQgJiYgKHRoaXMubGF5b3V0Tm9kZSB8fCB7fSkud2lkZ2V0KSB7XG4gICAgICB0aGlzLm5ld0NvbXBvbmVudCA9IHRoaXMud2lkZ2V0Q29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5LnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHRoaXMubGF5b3V0Tm9kZS53aWRnZXQpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5uZXdDb21wb25lbnQpIHtcbiAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgWydsYXlvdXROb2RlJywgJ2xheW91dEluZGV4JywgJ2RhdGFJbmRleCddKSB7XG4gICAgICAgIHRoaXMubmV3Q29tcG9uZW50Lmluc3RhbmNlW2lucHV0XSA9IHRoaXNbaW5wdXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19