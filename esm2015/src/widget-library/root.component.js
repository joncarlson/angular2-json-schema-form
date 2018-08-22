import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class RootComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    isDraggable(node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    }
    // Set attributes for flexbox child
    // (container attributes are set in section.component)
    getFlexAttribute(node, attribute) {
        const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    }
    showWidget(layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    }
}
RootComponent.decorators = [
    { type: Component, args: [{
                selector: 'root-widget',
                template: `
    <div *ngFor="let layoutItem of layout; let i = index" class="layout-root-widget"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`,
                styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
  `],
            },] },
];
/** @nocollapse */
RootComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
RootComponent.propDecorators = {
    "dataIndex": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "layout": [{ type: Input },],
    "isOrderable": [{ type: Input },],
    "isFlexItem": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3dpZGdldC1saWJyYXJ5L3Jvb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBK0NwRSxNQUFNO0lBUUosWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjswQkFIZCxLQUFLO0tBSXRCO0lBRUwsV0FBVyxDQUFDLElBQVM7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNO1lBQzNDLElBQUksQ0FBQyxhQUFhLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDO0tBQy9EOzs7SUFJRCxnQkFBZ0IsQ0FBQyxJQUFTLEVBQUUsU0FBaUI7UUFDM0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUQsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRTtJQUVELFVBQVUsQ0FBQyxVQUFlO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0Q7OztZQXZFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBa0JEO2dCQUNULE1BQU0sRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQlIsQ0FBQzthQUNIOzs7O1lBOUNRLHFCQUFxQjs7OzBCQWlEM0IsS0FBSzs0QkFDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgSG9zdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgaGFzVmFsdWUsIEpzb25Qb2ludGVyIH0gZnJvbSAnLi4vc2hhcmVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncm9vdC13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nRm9yPVwibGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0OyBsZXQgaSA9IGluZGV4XCIgY2xhc3M9XCJsYXlvdXQtcm9vdC13aWRnZXRcIlxuICAgICAgW2NsYXNzLmZvcm0tZmxleC1pdGVtXT1cImlzRmxleEl0ZW1cIlxuICAgICAgW3N0eWxlLmFsaWduLXNlbGZdPVwiKGxheW91dEl0ZW0ub3B0aW9ucyB8fCB7fSlbJ2FsaWduLXNlbGYnXVwiXG4gICAgICBbc3R5bGUuZmxleC1iYXNpc109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dEl0ZW0sICdmbGV4LWJhc2lzJylcIlxuICAgICAgW3N0eWxlLmZsZXgtZ3Jvd109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dEl0ZW0sICdmbGV4LWdyb3cnKVwiXG4gICAgICBbc3R5bGUuZmxleC1zaHJpbmtdPVwiZ2V0RmxleEF0dHJpYnV0ZShsYXlvdXRJdGVtLCAnZmxleC1zaHJpbmsnKVwiXG4gICAgICBbc3R5bGUub3JkZXJdPVwiKGxheW91dEl0ZW0ub3B0aW9ucyB8fCB7fSkub3JkZXJcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgW2RhdGFJbmRleF09XCJsYXlvdXRJdGVtPy5hcnJheUl0ZW0gPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiAoZGF0YUluZGV4IHx8IFtdKVwiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgIFtsYXlvdXROb2RlXT1cImxheW91dEl0ZW1cIlxuICAgICAgICBbb3JkZXJhYmxlXT1cImlzRHJhZ2dhYmxlKGxheW91dEl0ZW0pXCI+XG4gICAgICAgIDxzZWxlY3QtZnJhbWV3b3JrLXdpZGdldCAqbmdJZj1cInNob3dXaWRnZXQobGF5b3V0SXRlbSlcIlxuICAgICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0SXRlbT8uYXJyYXlJdGVtID8gKGRhdGFJbmRleCB8fCBbXSkuY29uY2F0KGkpIDogKGRhdGFJbmRleCB8fCBbXSlcIlxuICAgICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgICAgW2xheW91dE5vZGVdPVwibGF5b3V0SXRlbVwiPjwvc2VsZWN0LWZyYW1ld29yay13aWRnZXQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gLFxuICBzdHlsZXM6IFtgXG4gICAgW2RyYWdnYWJsZT10cnVlXSB7XG4gICAgICB0cmFuc2l0aW9uOiBhbGwgMTUwbXMgY3ViaWMtYmV6aWVyKC40LCAwLCAuMiwgMSk7XG4gICAgfVxuICAgIFtkcmFnZ2FibGU9dHJ1ZV06aG92ZXIge1xuICAgICAgY3Vyc29yOiBtb3ZlO1xuICAgICAgYm94LXNoYWRvdzogMnB4IDJweCA0cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAxMDtcbiAgICAgIG1hcmdpbi10b3A6IC0xcHg7XG4gICAgICBtYXJnaW4tbGVmdDogLTFweDtcbiAgICAgIG1hcmdpbi1yaWdodDogMXB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMXB4O1xuICAgIH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdLmRyYWctdGFyZ2V0LXRvcCB7XG4gICAgICBib3gtc2hhZG93OiAwIC0ycHggMCAjMDAwO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAyMDtcbiAgICB9XG4gICAgW2RyYWdnYWJsZT10cnVlXS5kcmFnLXRhcmdldC1ib3R0b20ge1xuICAgICAgYm94LXNoYWRvdzogMCAycHggMCAjMDAwO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAyMDtcbiAgICB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBSb290Q29tcG9uZW50IHtcbiAgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGxheW91dDogYW55W107XG4gIEBJbnB1dCgpIGlzT3JkZXJhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBpc0ZsZXhJdGVtID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIGlzRHJhZ2dhYmxlKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBub2RlLmFycmF5SXRlbSAmJiBub2RlLnR5cGUgIT09ICckcmVmJyAmJlxuICAgICAgbm9kZS5hcnJheUl0ZW1UeXBlID09PSAnbGlzdCcgJiYgdGhpcy5pc09yZGVyYWJsZSAhPT0gZmFsc2U7XG4gIH1cblxuICAvLyBTZXQgYXR0cmlidXRlcyBmb3IgZmxleGJveCBjaGlsZFxuICAvLyAoY29udGFpbmVyIGF0dHJpYnV0ZXMgYXJlIHNldCBpbiBzZWN0aW9uLmNvbXBvbmVudClcbiAgZ2V0RmxleEF0dHJpYnV0ZShub2RlOiBhbnksIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgaW5kZXggPSBbJ2ZsZXgtZ3JvdycsICdmbGV4LXNocmluaycsICdmbGV4LWJhc2lzJ10uaW5kZXhPZihhdHRyaWJ1dGUpO1xuICAgIHJldHVybiAoKG5vZGUub3B0aW9ucyB8fCB7fSkuZmxleCB8fCAnJykuc3BsaXQoL1xccysvKVtpbmRleF0gfHxcbiAgICAgIChub2RlLm9wdGlvbnMgfHwge30pW2F0dHJpYnV0ZV0gfHwgWycxJywgJzEnLCAnYXV0byddW2luZGV4XTtcbiAgfVxuXG4gIHNob3dXaWRnZXQobGF5b3V0Tm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuanNmLmV2YWx1YXRlQ29uZGl0aW9uKGxheW91dE5vZGUsIHRoaXMuZGF0YUluZGV4KTtcbiAgfVxufVxuIl19