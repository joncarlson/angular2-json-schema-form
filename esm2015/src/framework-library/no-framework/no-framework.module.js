import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLibraryModule } from '../../widget-library/widget-library.module';
import { Framework } from '../framework';
import { NoFrameworkComponent } from './no-framework.component';
import { NoFramework } from './no.framework';
export class NoFrameworkModule {
    static forRoot() {
        return {
            ngModule: NoFrameworkModule,
            providers: [
                { provide: Framework, useClass: NoFramework, multi: true }
            ]
        };
    }
}
NoFrameworkModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, WidgetLibraryModule],
                declarations: [NoFrameworkComponent],
                exports: [NoFrameworkComponent],
                entryComponents: [NoFrameworkComponent]
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tZnJhbWV3b3JrLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbm8tZnJhbWV3b3JrL25vLWZyYW1ld29yay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBUTdDLE1BQU07SUFDSixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7YUFDM0Q7U0FDRixDQUFDO0tBQ0g7OztZQWRGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQVUsQ0FBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUU7Z0JBQ3RELFlBQVksRUFBSyxDQUFFLG9CQUFvQixDQUFFO2dCQUN6QyxPQUFPLEVBQVUsQ0FBRSxvQkFBb0IsQ0FBRTtnQkFDekMsZUFBZSxFQUFFLENBQUUsb0JBQW9CLENBQUU7YUFDMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcbmltcG9ydCB7IFdpZGdldExpYnJhcnlNb2R1bGUgfSBmcm9tICcuLi8uLi93aWRnZXQtbGlicmFyeS93aWRnZXQtbGlicmFyeS5tb2R1bGUnO1xuaW1wb3J0IHsgRnJhbWV3b3JrIH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcbi8vIE5vIGZyYW1ld29yayAtIHBsYWluIEhUTUwgY29udHJvbHMgKHN0eWxlcyBmcm9tIGZvcm0gbGF5b3V0IG9ubHkpXG5pbXBvcnQgeyBOb0ZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJy4vbm8tZnJhbWV3b3JrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb0ZyYW1ld29yayB9IGZyb20gJy4vbm8uZnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogICAgICAgICBbIENvbW1vbk1vZHVsZSwgV2lkZ2V0TGlicmFyeU1vZHVsZSBdLFxuICBkZWNsYXJhdGlvbnM6ICAgIFsgTm9GcmFtZXdvcmtDb21wb25lbnQgXSxcbiAgZXhwb3J0czogICAgICAgICBbIE5vRnJhbWV3b3JrQ29tcG9uZW50IF0sXG4gIGVudHJ5Q29tcG9uZW50czogWyBOb0ZyYW1ld29ya0NvbXBvbmVudCBdXG59KVxuZXhwb3J0IGNsYXNzIE5vRnJhbWV3b3JrTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOb0ZyYW1ld29ya01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IEZyYW1ld29yaywgdXNlQ2xhc3M6IE5vRnJhbWV3b3JrLCBtdWx0aTogdHJ1ZSB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19