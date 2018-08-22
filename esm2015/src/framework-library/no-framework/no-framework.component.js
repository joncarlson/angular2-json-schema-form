import { Component, Input } from '@angular/core';
export class NoFrameworkComponent {
}
NoFrameworkComponent.decorators = [
    { type: Component, args: [{
                selector: 'no-framework',
                template: `
    <select-widget-widget
      [dataIndex]="dataIndex"
      [layoutIndex]="layoutIndex"
      [layoutNode]="layoutNode"></select-widget-widget>`,
            },] },
];
/** @nocollapse */
NoFrameworkComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tZnJhbWV3b3JrLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbm8tZnJhbWV3b3JrL25vLWZyYW1ld29yay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFVakQsTUFBTTs7O1lBUkwsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUU7Ozs7d0RBSTRDO2FBQ3ZEOzs7OzJCQUVFLEtBQUs7NEJBQ0wsS0FBSzswQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduby1mcmFtZXdvcmsnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWxlY3Qtd2lkZ2V0LXdpZGdldFxuICAgICAgW2RhdGFJbmRleF09XCJkYXRhSW5kZXhcIlxuICAgICAgW2xheW91dEluZGV4XT1cImxheW91dEluZGV4XCJcbiAgICAgIFtsYXlvdXROb2RlXT1cImxheW91dE5vZGVcIj48L3NlbGVjdC13aWRnZXQtd2lkZ2V0PmAsXG59KVxuZXhwb3J0IGNsYXNzIE5vRnJhbWV3b3JrQ29tcG9uZW50IHtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG59XG4iXX0=