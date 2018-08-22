import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var SectionComponent = /** @class */ (function () {
    function SectionComponent(jsf) {
        this.jsf = jsf;
        this.expanded = true;
    }
    Object.defineProperty(SectionComponent.prototype, "sectionTitle", {
        get: function () {
            return this.options.notitle ? null : this.jsf.setItemTitle(this);
        },
        enumerable: true,
        configurable: true
    });
    SectionComponent.prototype.ngOnInit = function () {
        this.jsf.initializeControl(this);
        this.options = this.layoutNode.options || {};
        this.expanded = typeof this.options.expanded === 'boolean' ?
            this.options.expanded : !this.options.expandable;
        switch (this.layoutNode.type) {
            case 'fieldset':
            case 'array':
            case 'tab':
            case 'advancedfieldset':
            case 'authfieldset':
            case 'optionfieldset':
            case 'selectfieldset':
                this.containerType = 'fieldset';
                break;
            default:
                // 'div', 'flex', 'section', 'conditional', 'actions', 'tagsinput'
                this.containerType = 'div';
                break;
        }
    };
    SectionComponent.prototype.toggleExpanded = function () {
        if (this.options.expandable) {
            this.expanded = !this.expanded;
        }
    };
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    SectionComponent.prototype.getFlexAttribute = 
    // Set attributes for flexbox container
    // (child attributes are set in root.component)
    function (attribute) {
        var flexActive = this.layoutNode.type === 'flex' ||
            !!this.options.displayFlex ||
            this.options.display === 'flex';
        if (attribute !== 'flex' && !flexActive) {
            return null;
        }
        switch (attribute) {
            case 'is-flex':
                return flexActive;
            case 'display':
                return flexActive ? 'flex' : 'initial';
            case 'flex-direction':
            case 'flex-wrap':
                var index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
                return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
                    this.options[attribute] || ['column', 'nowrap'][index];
            case 'justify-content':
            case 'align-items':
            case 'align-content':
                return this.options[attribute];
        }
    };
    SectionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'section-widget',
                    template: "\n    <div *ngIf=\"containerType === 'div'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\">\n      <label *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></label>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n    </div>\n    <fieldset *ngIf=\"containerType === 'fieldset'\"\n      [class]=\"options?.htmlClass || ''\"\n      [class.expandable]=\"options?.expandable && !expanded\"\n      [class.expanded]=\"options?.expandable && expanded\"\n      [disabled]=\"options?.readonly\">\n      <legend *ngIf=\"sectionTitle\"\n        class=\"legend\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [innerHTML]=\"sectionTitle\"\n        (click)=\"toggleExpanded()\"></legend>\n      <div *ngIf=\"options?.messageLocation !== 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n      <root-widget *ngIf=\"expanded\"\n        [dataIndex]=\"dataIndex\"\n        [layout]=\"layoutNode.items\"\n        [layoutIndex]=\"layoutIndex\"\n        [isFlexItem]=\"getFlexAttribute('is-flex')\"\n        [isOrderable]=\"options?.orderable\"\n        [class.form-flex-column]=\"getFlexAttribute('flex-direction') === 'column'\"\n        [class.form-flex-row]=\"getFlexAttribute('flex-direction') === 'row'\"\n        [style.align-content]=\"getFlexAttribute('align-content')\"\n        [style.align-items]=\"getFlexAttribute('align-items')\"\n        [style.display]=\"getFlexAttribute('display')\"\n        [style.flex-direction]=\"getFlexAttribute('flex-direction')\"\n        [style.flex-wrap]=\"getFlexAttribute('flex-wrap')\"\n        [style.justify-content]=\"getFlexAttribute('justify-content')\"></root-widget>\n      <div *ngIf=\"options?.messageLocation === 'bottom'\">\n        <p *ngIf=\"options?.description\"\n        class=\"help-block\"\n        [class]=\"options?.labelHelpBlockClass || ''\"\n        [innerHTML]=\"options?.description\"></p>\n      </div>\n    </fieldset>",
                    styles: ["\n    .legend { font-weight: bold; }\n    .expandable > legend:before, .expandable > label:before  { content: '\u25B6'; padding-right: .3em; }\n    .expanded > legend:before, .expanded > label:before  { content: '\u25BC'; padding-right: .2em; }\n  "],
                },] },
    ];
    /** @nocollapse */
    SectionComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    SectionComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return SectionComponent;
}());
export { SectionComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3dpZGdldC1saWJyYXJ5L3NlY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBR3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOztJQWdGbEUsMEJBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7d0JBUHpCLElBQUk7S0FRVjtJQUVMLHNCQUFJLDBDQUFZO2FBQWhCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xFOzs7T0FBQTtJQUVELG1DQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxVQUFVLENBQUM7WUFBQyxLQUFLLE9BQU8sQ0FBQztZQUFDLEtBQUssS0FBSyxDQUFDO1lBQUMsS0FBSyxrQkFBa0IsQ0FBQztZQUNuRSxLQUFLLGNBQWMsQ0FBQztZQUFDLEtBQUssZ0JBQWdCLENBQUM7WUFBQyxLQUFLLGdCQUFnQjtnQkFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQztZQUNOOztnQkFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDN0IsS0FBSyxDQUFDO1NBQ1A7S0FDRjtJQUVELHlDQUFjLEdBQWQ7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUFFO0tBQ2pFO0lBRUQsdUNBQXVDO0lBQ3ZDLCtDQUErQzs7O0lBQy9DLDJDQUFnQjs7O0lBQWhCLFVBQWlCLFNBQWlCO1FBQ2hDLElBQU0sVUFBVSxHQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDL0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVztZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQUU7UUFDekQsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQixLQUFLLFNBQVM7Z0JBQ1osTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNwQixLQUFLLFNBQVM7Z0JBQ1osTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDekMsS0FBSyxnQkFBZ0IsQ0FBQztZQUFDLEtBQUssV0FBVztnQkFDckMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2pFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxLQUFLLGlCQUFpQixDQUFDO1lBQUMsS0FBSyxhQUFhLENBQUM7WUFBQyxLQUFLLGVBQWU7Z0JBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2xDO0tBQ0Y7O2dCQTlIRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLGlnR0E2REk7b0JBQ2QsTUFBTSxFQUFFLENBQUMsMFBBSVIsQ0FBQztpQkFDSDs7OztnQkF2RVEscUJBQXFCOzs7K0JBNEUzQixLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzs7MkJBakZSOztTQTJFYSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgdG9UaXRsZUNhc2UgfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2VjdGlvbi13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nSWY9XCJjb250YWluZXJUeXBlID09PSAnZGl2J1wiXG4gICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCJcbiAgICAgIFtjbGFzcy5leHBhbmRhYmxlXT1cIm9wdGlvbnM/LmV4cGFuZGFibGUgJiYgIWV4cGFuZGVkXCJcbiAgICAgIFtjbGFzcy5leHBhbmRlZF09XCJvcHRpb25zPy5leHBhbmRhYmxlICYmIGV4cGFuZGVkXCI+XG4gICAgICA8bGFiZWwgKm5nSWY9XCJzZWN0aW9uVGl0bGVcIlxuICAgICAgICBjbGFzcz1cImxlZ2VuZFwiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwic2VjdGlvblRpdGxlXCJcbiAgICAgICAgKGNsaWNrKT1cInRvZ2dsZUV4cGFuZGVkKClcIj48L2xhYmVsPlxuICAgICAgPHJvb3Qtd2lkZ2V0ICpuZ0lmPVwiZXhwYW5kZWRcIlxuICAgICAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiXG4gICAgICAgIFtsYXlvdXRdPVwibGF5b3V0Tm9kZS5pdGVtc1wiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCJsYXlvdXRJbmRleFwiXG4gICAgICAgIFtpc0ZsZXhJdGVtXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2lzLWZsZXgnKVwiXG4gICAgICAgIFtpc09yZGVyYWJsZV09XCJvcHRpb25zPy5vcmRlcmFibGVcIlxuICAgICAgICBbY2xhc3MuZm9ybS1mbGV4LWNvbHVtbl09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpID09PSAnY29sdW1uJ1wiXG4gICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtcm93XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdyb3cnXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24tY29udGVudCcpXCJcbiAgICAgICAgW3N0eWxlLmFsaWduLWl0ZW1zXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2FsaWduLWl0ZW1zJylcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJnZXRGbGV4QXR0cmlidXRlKCdkaXNwbGF5JylcIlxuICAgICAgICBbc3R5bGUuZmxleC1kaXJlY3Rpb25dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKVwiXG4gICAgICAgIFtzdHlsZS5mbGV4LXdyYXBdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC13cmFwJylcIlxuICAgICAgICBbc3R5bGUuanVzdGlmeS1jb250ZW50XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2p1c3RpZnktY29udGVudCcpXCI+PC9yb290LXdpZGdldD5cbiAgICA8L2Rpdj5cbiAgICA8ZmllbGRzZXQgKm5nSWY9XCJjb250YWluZXJUeXBlID09PSAnZmllbGRzZXQnXCJcbiAgICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIlxuICAgICAgW2NsYXNzLmV4cGFuZGFibGVdPVwib3B0aW9ucz8uZXhwYW5kYWJsZSAmJiAhZXhwYW5kZWRcIlxuICAgICAgW2NsYXNzLmV4cGFuZGVkXT1cIm9wdGlvbnM/LmV4cGFuZGFibGUgJiYgZXhwYW5kZWRcIlxuICAgICAgW2Rpc2FibGVkXT1cIm9wdGlvbnM/LnJlYWRvbmx5XCI+XG4gICAgICA8bGVnZW5kICpuZ0lmPVwic2VjdGlvblRpdGxlXCJcbiAgICAgICAgY2xhc3M9XCJsZWdlbmRcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cInNlY3Rpb25UaXRsZVwiXG4gICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmRlZCgpXCI+PC9sZWdlbmQ+XG4gICAgICA8ZGl2ICpuZ0lmPVwib3B0aW9ucz8ubWVzc2FnZUxvY2F0aW9uICE9PSAnYm90dG9tJ1wiPlxuICAgICAgICA8cCAqbmdJZj1cIm9wdGlvbnM/LmRlc2NyaXB0aW9uXCJcbiAgICAgICAgY2xhc3M9XCJoZWxwLWJsb2NrXCJcbiAgICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmxhYmVsSGVscEJsb2NrQ2xhc3MgfHwgJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LmRlc2NyaXB0aW9uXCI+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8cm9vdC13aWRnZXQgKm5nSWY9XCJleHBhbmRlZFwiXG4gICAgICAgIFtkYXRhSW5kZXhdPVwiZGF0YUluZGV4XCJcbiAgICAgICAgW2xheW91dF09XCJsYXlvdXROb2RlLml0ZW1zXCJcbiAgICAgICAgW2xheW91dEluZGV4XT1cImxheW91dEluZGV4XCJcbiAgICAgICAgW2lzRmxleEl0ZW1dPVwiZ2V0RmxleEF0dHJpYnV0ZSgnaXMtZmxleCcpXCJcbiAgICAgICAgW2lzT3JkZXJhYmxlXT1cIm9wdGlvbnM/Lm9yZGVyYWJsZVwiXG4gICAgICAgIFtjbGFzcy5mb3JtLWZsZXgtY29sdW1uXT1cImdldEZsZXhBdHRyaWJ1dGUoJ2ZsZXgtZGlyZWN0aW9uJykgPT09ICdjb2x1bW4nXCJcbiAgICAgICAgW2NsYXNzLmZvcm0tZmxleC1yb3ddPVwiZ2V0RmxleEF0dHJpYnV0ZSgnZmxleC1kaXJlY3Rpb24nKSA9PT0gJ3JvdydcIlxuICAgICAgICBbc3R5bGUuYWxpZ24tY29udGVudF09XCJnZXRGbGV4QXR0cmlidXRlKCdhbGlnbi1jb250ZW50JylcIlxuICAgICAgICBbc3R5bGUuYWxpZ24taXRlbXNdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnYWxpZ24taXRlbXMnKVwiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cImdldEZsZXhBdHRyaWJ1dGUoJ2Rpc3BsYXknKVwiXG4gICAgICAgIFtzdHlsZS5mbGV4LWRpcmVjdGlvbl09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LWRpcmVjdGlvbicpXCJcbiAgICAgICAgW3N0eWxlLmZsZXgtd3JhcF09XCJnZXRGbGV4QXR0cmlidXRlKCdmbGV4LXdyYXAnKVwiXG4gICAgICAgIFtzdHlsZS5qdXN0aWZ5LWNvbnRlbnRdPVwiZ2V0RmxleEF0dHJpYnV0ZSgnanVzdGlmeS1jb250ZW50JylcIj48L3Jvb3Qtd2lkZ2V0PlxuICAgICAgPGRpdiAqbmdJZj1cIm9wdGlvbnM/Lm1lc3NhZ2VMb2NhdGlvbiA9PT0gJ2JvdHRvbSdcIj5cbiAgICAgICAgPHAgKm5nSWY9XCJvcHRpb25zPy5kZXNjcmlwdGlvblwiXG4gICAgICAgIGNsYXNzPVwiaGVscC1ibG9ja1wiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEhlbHBCbG9ja0NsYXNzIHx8ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy5kZXNjcmlwdGlvblwiPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZmllbGRzZXQ+YCxcbiAgc3R5bGVzOiBbYFxuICAgIC5sZWdlbmQgeyBmb250LXdlaWdodDogYm9sZDsgfVxuICAgIC5leHBhbmRhYmxlID4gbGVnZW5kOmJlZm9yZSwgLmV4cGFuZGFibGUgPiBsYWJlbDpiZWZvcmUgIHsgY29udGVudDogJ+KWtic7IHBhZGRpbmctcmlnaHQ6IC4zZW07IH1cbiAgICAuZXhwYW5kZWQgPiBsZWdlbmQ6YmVmb3JlLCAuZXhwYW5kZWQgPiBsYWJlbDpiZWZvcmUgIHsgY29udGVudDogJ+KWvCc7IHBhZGRpbmctcmlnaHQ6IC4yZW07IH1cbiAgYF0sXG59KVxuZXhwb3J0IGNsYXNzIFNlY3Rpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIGV4cGFuZGVkID0gdHJ1ZTtcbiAgY29udGFpbmVyVHlwZTogc3RyaW5nO1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgZ2V0IHNlY3Rpb25UaXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLm5vdGl0bGUgPyBudWxsIDogdGhpcy5qc2Yuc2V0SXRlbVRpdGxlKHRoaXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcyk7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5leHBhbmRlZCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZXhwYW5kZWQgPT09ICdib29sZWFuJyA/XG4gICAgICB0aGlzLm9wdGlvbnMuZXhwYW5kZWQgOiAhdGhpcy5vcHRpb25zLmV4cGFuZGFibGU7XG4gICAgc3dpdGNoICh0aGlzLmxheW91dE5vZGUudHlwZSkge1xuICAgICAgY2FzZSAnZmllbGRzZXQnOiBjYXNlICdhcnJheSc6IGNhc2UgJ3RhYic6IGNhc2UgJ2FkdmFuY2VkZmllbGRzZXQnOlxuICAgICAgY2FzZSAnYXV0aGZpZWxkc2V0JzogY2FzZSAnb3B0aW9uZmllbGRzZXQnOiBjYXNlICdzZWxlY3RmaWVsZHNldCc6XG4gICAgICAgIHRoaXMuY29udGFpbmVyVHlwZSA9ICdmaWVsZHNldCc7XG4gICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IC8vICdkaXYnLCAnZmxleCcsICdzZWN0aW9uJywgJ2NvbmRpdGlvbmFsJywgJ2FjdGlvbnMnLCAndGFnc2lucHV0J1xuICAgICAgICB0aGlzLmNvbnRhaW5lclR5cGUgPSAnZGl2JztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUV4cGFuZGVkKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwYW5kYWJsZSkgeyB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7IH1cbiAgfVxuXG4gIC8vIFNldCBhdHRyaWJ1dGVzIGZvciBmbGV4Ym94IGNvbnRhaW5lclxuICAvLyAoY2hpbGQgYXR0cmlidXRlcyBhcmUgc2V0IGluIHJvb3QuY29tcG9uZW50KVxuICBnZXRGbGV4QXR0cmlidXRlKGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZmxleEFjdGl2ZTogYm9vbGVhbiA9XG4gICAgICB0aGlzLmxheW91dE5vZGUudHlwZSA9PT0gJ2ZsZXgnIHx8XG4gICAgICAhIXRoaXMub3B0aW9ucy5kaXNwbGF5RmxleCB8fFxuICAgICAgdGhpcy5vcHRpb25zLmRpc3BsYXkgPT09ICdmbGV4JztcbiAgICBpZiAoYXR0cmlidXRlICE9PSAnZmxleCcgJiYgIWZsZXhBY3RpdmUpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZSkge1xuICAgICAgY2FzZSAnaXMtZmxleCc6XG4gICAgICAgIHJldHVybiBmbGV4QWN0aXZlO1xuICAgICAgY2FzZSAnZGlzcGxheSc6XG4gICAgICAgIHJldHVybiBmbGV4QWN0aXZlID8gJ2ZsZXgnIDogJ2luaXRpYWwnO1xuICAgICAgY2FzZSAnZmxleC1kaXJlY3Rpb24nOiBjYXNlICdmbGV4LXdyYXAnOlxuICAgICAgICBjb25zdCBpbmRleCA9IFsnZmxleC1kaXJlY3Rpb24nLCAnZmxleC13cmFwJ10uaW5kZXhPZihhdHRyaWJ1dGUpO1xuICAgICAgICByZXR1cm4gKHRoaXMub3B0aW9uc1snZmxleC1mbG93J10gfHwgJycpLnNwbGl0KC9cXHMrLylbaW5kZXhdIHx8XG4gICAgICAgICAgdGhpcy5vcHRpb25zW2F0dHJpYnV0ZV0gfHwgWydjb2x1bW4nLCAnbm93cmFwJ11baW5kZXhdO1xuICAgICAgY2FzZSAnanVzdGlmeS1jb250ZW50JzogY2FzZSAnYWxpZ24taXRlbXMnOiBjYXNlICdhbGlnbi1jb250ZW50JzpcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1thdHRyaWJ1dGVdO1xuICAgIH1cbiAgfVxufVxuIl19