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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL2ZyYW1ld29yay1saWJyYXJ5L21hdGVyaWFsLWRlc2lnbi1mcmFtZXdvcmsvbWF0ZXJpYWwtYWRkLXJlZmVyZW5jZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFpQnZFLE1BQU07SUFTSixZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCO0tBQy9CO0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQzlDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7S0FDekU7SUFFRCxPQUFPLENBQUMsS0FBSztRQUNYLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtJQUVELElBQUksVUFBVTtRQUNaLE1BQU0sTUFBTSxHQUFRO1lBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1NBQ3pDLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3ZFOzs7WUFsREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwrQkFBK0I7Z0JBQ3pDLFFBQVEsRUFBRTs7Ozs7Ozs7OztlQVVHO2dCQUNiLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2FBQ2pEOzs7O1lBaEJRLHFCQUFxQjs7OzJCQXNCM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdGVyaWFsLWFkZC1yZWZlcmVuY2Utd2lkZ2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c2VjdGlvbiBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCIgYWxpZ249XCJzdGFydFwiPlxuICAgICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgKm5nSWY9XCJzaG93QWRkQnV0dG9uXCIgXG4gICAgICAgIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICBbY29sb3JdPVwib3B0aW9ucz8uY29sb3IgfHwgJ2FjY2VudCdcIlxuICAgICAgICBbZGlzYWJsZWRdPVwib3B0aW9ucz8ucmVhZG9ubHlcIlxuICAgICAgICAoY2xpY2spPVwiYWRkSXRlbSgkZXZlbnQpXCJcbiAgICAgICAgbWF0VG9vbHRpcD1cInt7b3B0aW9ucz8udGl0bGV9fVwiPlxuICAgICAgICA8bWF0LWljb24+YWRkPC9tYXQtaWNvbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvc2VjdGlvbj5gLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsQWRkUmVmZXJlbmNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgb3B0aW9uczogYW55O1xuICBpdGVtQ291bnQ6IG51bWJlcjtcbiAgcHJldmlvdXNMYXlvdXRJbmRleDogbnVtYmVyW107XG4gIHByZXZpb3VzRGF0YUluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICB9XG5cbiAgZ2V0IHNob3dBZGRCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmxheW91dE5vZGUuYXJyYXlJdGVtIHx8XG4gICAgICB0aGlzLmxheW91dEluZGV4W3RoaXMubGF5b3V0SW5kZXgubGVuZ3RoIC0gMV0gPCB0aGlzLm9wdGlvbnMubWF4SXRlbXM7XG4gIH1cblxuICBhZGRJdGVtKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmpzZi5hZGRJdGVtKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGJ1dHRvblRleHQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJlbnQ6IGFueSA9IHtcbiAgICAgIGRhdGFJbmRleDogdGhpcy5kYXRhSW5kZXguc2xpY2UoMCwgLTEpLFxuICAgICAgbGF5b3V0SW5kZXg6IHRoaXMubGF5b3V0SW5kZXguc2xpY2UoMCwgLTEpLFxuICAgICAgbGF5b3V0Tm9kZTogdGhpcy5qc2YuZ2V0UGFyZW50Tm9kZSh0aGlzKSxcbiAgICB9O1xuICAgIHJldHVybiBwYXJlbnQubGF5b3V0Tm9kZS5hZGQgfHxcbiAgICAgIHRoaXMuanNmLnNldEFycmF5SXRlbVRpdGxlKHBhcmVudCwgdGhpcy5sYXlvdXROb2RlLCB0aGlzLml0ZW1Db3VudCk7XG4gIH1cbn1cbiJdfQ==