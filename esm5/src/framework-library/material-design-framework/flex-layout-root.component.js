import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var FlexLayoutRootComponent = /** @class */ (function () {
    function FlexLayoutRootComponent(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    FlexLayoutRootComponent.prototype.removeItem = function (item) {
        this.jsf.removeItem(item);
    };
    // Set attributes for flexbox child
    // (container attributes are set in flex-layout-section.component)
    // Set attributes for flexbox child
    // (container attributes are set in flex-layout-section.component)
    FlexLayoutRootComponent.prototype.getFlexAttribute = 
    // Set attributes for flexbox child
    // (container attributes are set in flex-layout-section.component)
    function (node, attribute) {
        var index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    };
    FlexLayoutRootComponent.prototype.showWidget = function (layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    };
    FlexLayoutRootComponent.decorators = [
        { type: Component, args: [{
                    selector: 'flex-layout-root-widget',
                    template: "\n    <div *ngFor=\"let layoutNode of layout; let i = index\"\n      [class.form-flex-item]=\"isFlexItem\"\n      [style.flex-grow]=\"getFlexAttribute(layoutNode, 'flex-grow')\"\n      [style.flex-shrink]=\"getFlexAttribute(layoutNode, 'flex-shrink')\"\n      [style.flex-basis]=\"getFlexAttribute(layoutNode, 'flex-basis')\"\n      [style.align-self]=\"(layoutNode?.options || {})['align-self']\"\n      [style.order]=\"layoutNode?.options?.order\"\n      [fxFlex]=\"layoutNode?.options?.fxFlex\"\n      [fxFlexOrder]=\"layoutNode?.options?.fxFlexOrder\"\n      [fxFlexOffset]=\"layoutNode?.options?.fxFlexOffset\"\n      [fxFlexAlign]=\"layoutNode?.options?.fxFlexAlign\">\n      <select-framework-widget *ngIf=\"showWidget(layoutNode)\"\n        [dataIndex]=\"layoutNode?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])\"\n        [layoutIndex]=\"(layoutIndex || []).concat(i)\"\n        [layoutNode]=\"layoutNode\"></select-framework-widget>\n    <div>",
                    changeDetection: ChangeDetectionStrategy.Default,
                },] },
    ];
    /** @nocollapse */
    FlexLayoutRootComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    FlexLayoutRootComponent.propDecorators = {
        "dataIndex": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "layout": [{ type: Input },],
        "isFlexItem": [{ type: Input },],
    };
    return FlexLayoutRootComponent;
}());
export { FlexLayoutRootComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1sYXlvdXQtcm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvZmxleC1sYXlvdXQtcm9vdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0lBOEJyRSxpQ0FDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjswQkFIZCxLQUFLO0tBSXRCO0lBRUwsNENBQVUsR0FBVixVQUFXLElBQUk7UUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjtJQUVELG1DQUFtQztJQUNuQyxrRUFBa0U7OztJQUNsRSxrREFBZ0I7OztJQUFoQixVQUFpQixJQUFTLEVBQUUsU0FBaUI7UUFDM0MsSUFBTSxLQUFLLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUQsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRTtJQUVELDRDQUFVLEdBQVYsVUFBVyxVQUFlO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0Q7O2dCQTdDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLDA4QkFnQkY7b0JBQ1IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87aUJBQ2pEOzs7O2dCQXZCUSxxQkFBcUI7Ozs4QkF5QjNCLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLOytCQUNMLEtBQUs7O2tDQTlCUjs7U0EwQmEsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IGhhc1ZhbHVlLCBKc29uUG9pbnRlciB9IGZyb20gJy4uLy4uL3NoYXJlZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZsZXgtbGF5b3V0LXJvb3Qtd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBsYXlvdXROb2RlIG9mIGxheW91dDsgbGV0IGkgPSBpbmRleFwiXG4gICAgICBbY2xhc3MuZm9ybS1mbGV4LWl0ZW1dPVwiaXNGbGV4SXRlbVwiXG4gICAgICBbc3R5bGUuZmxleC1ncm93XT1cImdldEZsZXhBdHRyaWJ1dGUobGF5b3V0Tm9kZSwgJ2ZsZXgtZ3JvdycpXCJcbiAgICAgIFtzdHlsZS5mbGV4LXNocmlua109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dE5vZGUsICdmbGV4LXNocmluaycpXCJcbiAgICAgIFtzdHlsZS5mbGV4LWJhc2lzXT1cImdldEZsZXhBdHRyaWJ1dGUobGF5b3V0Tm9kZSwgJ2ZsZXgtYmFzaXMnKVwiXG4gICAgICBbc3R5bGUuYWxpZ24tc2VsZl09XCIobGF5b3V0Tm9kZT8ub3B0aW9ucyB8fCB7fSlbJ2FsaWduLXNlbGYnXVwiXG4gICAgICBbc3R5bGUub3JkZXJdPVwibGF5b3V0Tm9kZT8ub3B0aW9ucz8ub3JkZXJcIlxuICAgICAgW2Z4RmxleF09XCJsYXlvdXROb2RlPy5vcHRpb25zPy5meEZsZXhcIlxuICAgICAgW2Z4RmxleE9yZGVyXT1cImxheW91dE5vZGU/Lm9wdGlvbnM/LmZ4RmxleE9yZGVyXCJcbiAgICAgIFtmeEZsZXhPZmZzZXRdPVwibGF5b3V0Tm9kZT8ub3B0aW9ucz8uZnhGbGV4T2Zmc2V0XCJcbiAgICAgIFtmeEZsZXhBbGlnbl09XCJsYXlvdXROb2RlPy5vcHRpb25zPy5meEZsZXhBbGlnblwiPlxuICAgICAgPHNlbGVjdC1mcmFtZXdvcmstd2lkZ2V0ICpuZ0lmPVwic2hvd1dpZGdldChsYXlvdXROb2RlKVwiXG4gICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0Tm9kZT8uYXJyYXlJdGVtID8gKGRhdGFJbmRleCB8fCBbXSkuY29uY2F0KGkpIDogKGRhdGFJbmRleCB8fCBbXSlcIlxuICAgICAgICBbbGF5b3V0SW5kZXhdPVwiKGxheW91dEluZGV4IHx8IFtdKS5jb25jYXQoaSlcIlxuICAgICAgICBbbGF5b3V0Tm9kZV09XCJsYXlvdXROb2RlXCI+PC9zZWxlY3QtZnJhbWV3b3JrLXdpZGdldD5cbiAgICA8ZGl2PmAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgRmxleExheW91dFJvb3RDb21wb25lbnQge1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGxheW91dDogYW55W107XG4gIEBJbnB1dCgpIGlzRmxleEl0ZW0gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgcmVtb3ZlSXRlbShpdGVtKSB7XG4gICAgdGhpcy5qc2YucmVtb3ZlSXRlbShpdGVtKTtcbiAgfVxuXG4gIC8vIFNldCBhdHRyaWJ1dGVzIGZvciBmbGV4Ym94IGNoaWxkXG4gIC8vIChjb250YWluZXIgYXR0cmlidXRlcyBhcmUgc2V0IGluIGZsZXgtbGF5b3V0LXNlY3Rpb24uY29tcG9uZW50KVxuICBnZXRGbGV4QXR0cmlidXRlKG5vZGU6IGFueSwgYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbmRleCA9IFsnZmxleC1ncm93JywgJ2ZsZXgtc2hyaW5rJywgJ2ZsZXgtYmFzaXMnXS5pbmRleE9mKGF0dHJpYnV0ZSk7XG4gICAgcmV0dXJuICgobm9kZS5vcHRpb25zIHx8IHt9KS5mbGV4IHx8ICcnKS5zcGxpdCgvXFxzKy8pW2luZGV4XSB8fFxuICAgICAgKG5vZGUub3B0aW9ucyB8fCB7fSlbYXR0cmlidXRlXSB8fCBbJzEnLCAnMScsICdhdXRvJ11baW5kZXhdO1xuICB9XG5cbiAgc2hvd1dpZGdldChsYXlvdXROb2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5qc2YuZXZhbHVhdGVDb25kaXRpb24obGF5b3V0Tm9kZSwgdGhpcy5kYXRhSW5kZXgpO1xuICB9XG59XG4iXX0=