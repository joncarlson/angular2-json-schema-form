import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class TabsComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.itemCount = this.layoutNode.items.length - 1;
        this.updateControl();
    }
    select(index) {
        if (this.layoutNode.items[index].type === '$ref') {
            this.itemCount = this.layoutNode.items.length;
            this.jsf.addItem({
                layoutNode: this.layoutNode.items[index],
                layoutIndex: this.layoutIndex.concat(index),
                dataIndex: this.dataIndex.concat(index)
            });
            this.updateControl();
        }
        this.selectedItem = index;
    }
    updateControl() {
        const lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
        if (lastItem.type === '$ref' &&
            this.itemCount >= (lastItem.options.maxItems || 1000)) {
            this.showAddTab = false;
        }
    }
    setTabTitle(item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    }
}
TabsComponent.decorators = [
    { type: Component, args: [{
                selector: 'tabs-widget',
                template: `
    <ul
      [class]="options?.labelHtmlClass || ''">
      <li *ngFor="let item of layoutNode?.items; let i = index"
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
        role="presentation"
        data-tabs>
        <a *ngIf="showAddTab || item.type !== '$ref'"
           [class]="'nav-link' + (selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
            (' ' + options?.style?.unselected))"
          [innerHTML]="setTabTitle(item, i)"
          (click)="select(i)"></a>
      </li>
    </ul>

    <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
      [class]="options?.htmlClass || ''">

      <select-framework-widget *ngIf="selectedItem === i"
        [class]="(options?.fieldHtmlClass || '') +
          ' ' + (options?.activeClass || '') +
          ' ' + (options?.style?.selected || '')"
        [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"></select-framework-widget>

    </div>`,
                styles: [` a { cursor: pointer; } `],
            },] },
];
/** @nocollapse */
TabsComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
TabsComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3dpZGdldC1saWJyYXJ5L3RhYnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBbUNwRSxNQUFNO0lBU0osWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1Qjs0QkFQckIsQ0FBQzswQkFDSCxJQUFJO0tBT1o7SUFFTCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN0QjtJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDeEMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUN4QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUMzQjtJQUVELGFBQWE7UUFDWCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxNQUFNO1lBQzFCLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQ3RELENBQUMsQ0FBQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7S0FDRjtJQUVELFdBQVcsQ0FBQyxJQUFTLEVBQUUsS0FBYTtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3REOzs7WUE1RUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E0QkQ7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsMEJBQTBCLENBQUM7YUFDckM7Ozs7WUFsQ1EscUJBQXFCOzs7MkJBd0MzQixLQUFLOzRCQUNMLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0YWJzLXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIj5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBsYXlvdXROb2RlPy5pdGVtczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgIFtjbGFzc109XCIob3B0aW9ucz8uaXRlbUxhYmVsSHRtbENsYXNzIHx8ICcnKSArIChzZWxlY3RlZEl0ZW0gPT09IGkgP1xuICAgICAgICAgICgnICcgKyAob3B0aW9ucz8uYWN0aXZlQ2xhc3MgfHwgJycpICsgJyAnICsgKG9wdGlvbnM/LnN0eWxlPy5zZWxlY3RlZCB8fCAnJykpIDpcbiAgICAgICAgICAoJyAnICsgb3B0aW9ucz8uc3R5bGU/LnVuc2VsZWN0ZWQpKVwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBkYXRhLXRhYnM+XG4gICAgICAgIDxhICpuZ0lmPVwic2hvd0FkZFRhYiB8fCBpdGVtLnR5cGUgIT09ICckcmVmJ1wiXG4gICAgICAgICAgIFtjbGFzc109XCInbmF2LWxpbmsnICsgKHNlbGVjdGVkSXRlbSA9PT0gaSA/ICgnICcgKyBvcHRpb25zPy5hY3RpdmVDbGFzcyArICcgJyArIG9wdGlvbnM/LnN0eWxlPy5zZWxlY3RlZCkgOlxuICAgICAgICAgICAgKCcgJyArIG9wdGlvbnM/LnN0eWxlPy51bnNlbGVjdGVkKSlcIlxuICAgICAgICAgIFtpbm5lckhUTUxdPVwic2V0VGFiVGl0bGUoaXRlbSwgaSlcIlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3QoaSlcIj48L2E+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBsYXlvdXRJdGVtIG9mIGxheW91dE5vZGU/Lml0ZW1zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIj5cblxuICAgICAgPHNlbGVjdC1mcmFtZXdvcmstd2lkZ2V0ICpuZ0lmPVwic2VsZWN0ZWRJdGVtID09PSBpXCJcbiAgICAgICAgW2NsYXNzXT1cIihvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJykgK1xuICAgICAgICAgICcgJyArIChvcHRpb25zPy5hY3RpdmVDbGFzcyB8fCAnJykgK1xuICAgICAgICAgICcgJyArIChvcHRpb25zPy5zdHlsZT8uc2VsZWN0ZWQgfHwgJycpXCJcbiAgICAgICAgW2RhdGFJbmRleF09XCJsYXlvdXROb2RlPy5kYXRhVHlwZSA9PT0gJ2FycmF5JyA/IChkYXRhSW5kZXggfHwgW10pLmNvbmNhdChpKSA6IGRhdGFJbmRleFwiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgIFtsYXlvdXROb2RlXT1cImxheW91dEl0ZW1cIj48L3NlbGVjdC1mcmFtZXdvcmstd2lkZ2V0PlxuXG4gICAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbYCBhIHsgY3Vyc29yOiBwb2ludGVyOyB9IGBdLFxufSlcbmV4cG9ydCBjbGFzcyBUYWJzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgb3B0aW9uczogYW55O1xuICBpdGVtQ291bnQ6IG51bWJlcjtcbiAgc2VsZWN0ZWRJdGVtID0gMDtcbiAgc2hvd0FkZFRhYiA9IHRydWU7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLml0ZW1Db3VudCA9IHRoaXMubGF5b3V0Tm9kZS5pdGVtcy5sZW5ndGggLSAxO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICB9XG5cbiAgc2VsZWN0KGluZGV4KSB7XG4gICAgaWYgKHRoaXMubGF5b3V0Tm9kZS5pdGVtc1tpbmRleF0udHlwZSA9PT0gJyRyZWYnKSB7XG4gICAgICB0aGlzLml0ZW1Db3VudCA9IHRoaXMubGF5b3V0Tm9kZS5pdGVtcy5sZW5ndGg7XG4gICAgICB0aGlzLmpzZi5hZGRJdGVtKHtcbiAgICAgICAgbGF5b3V0Tm9kZTogdGhpcy5sYXlvdXROb2RlLml0ZW1zW2luZGV4XSxcbiAgICAgICAgbGF5b3V0SW5kZXg6IHRoaXMubGF5b3V0SW5kZXguY29uY2F0KGluZGV4KSxcbiAgICAgICAgZGF0YUluZGV4OiB0aGlzLmRhdGFJbmRleC5jb25jYXQoaW5kZXgpXG4gICAgICB9KTtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IGluZGV4O1xuICB9XG5cbiAgdXBkYXRlQ29udHJvbCgpIHtcbiAgICBjb25zdCBsYXN0SXRlbSA9IHRoaXMubGF5b3V0Tm9kZS5pdGVtc1t0aGlzLmxheW91dE5vZGUuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgaWYgKGxhc3RJdGVtLnR5cGUgPT09ICckcmVmJyAmJlxuICAgICAgdGhpcy5pdGVtQ291bnQgPj0gKGxhc3RJdGVtLm9wdGlvbnMubWF4SXRlbXMgfHwgMTAwMClcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0FkZFRhYiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHNldFRhYlRpdGxlKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuanNmLnNldEFycmF5SXRlbVRpdGxlKHRoaXMsIGl0ZW0sIGluZGV4KTtcbiAgfVxufVxuIl19