import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLibraryModule } from '../../widget-library/widget-library.module';
import { Framework } from '../framework';
import { NoFrameworkComponent } from './no-framework.component';
import { NoFramework } from './no.framework';
var NoFrameworkModule = /** @class */ (function () {
    function NoFrameworkModule() {
    }
    NoFrameworkModule.forRoot = function () {
        return {
            ngModule: NoFrameworkModule,
            providers: [
                { provide: Framework, useClass: NoFramework, multi: true }
            ]
        };
    };
    NoFrameworkModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, WidgetLibraryModule],
                    declarations: [NoFrameworkComponent],
                    exports: [NoFrameworkComponent],
                    entryComponents: [NoFrameworkComponent]
                },] },
    ];
    return NoFrameworkModule;
}());
export { NoFrameworkModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tZnJhbWV3b3JrLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvbm8tZnJhbWV3b3JrL25vLWZyYW1ld29yay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0lBU3BDLHlCQUFPLEdBQWQ7UUFDRSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQzNEO1NBQ0YsQ0FBQztLQUNIOztnQkFkRixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFVLENBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFFO29CQUN0RCxZQUFZLEVBQUssQ0FBRSxvQkFBb0IsQ0FBRTtvQkFDekMsT0FBTyxFQUFVLENBQUUsb0JBQW9CLENBQUU7b0JBQ3pDLGVBQWUsRUFBRSxDQUFFLG9CQUFvQixDQUFFO2lCQUMxQzs7NEJBZkQ7O1NBZ0JhLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2lkZ2V0TGlicmFyeU1vZHVsZSB9IGZyb20gJy4uLy4uL3dpZGdldC1saWJyYXJ5L3dpZGdldC1saWJyYXJ5Lm1vZHVsZSc7XG5pbXBvcnQgeyBGcmFtZXdvcmsgfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xuLy8gTm8gZnJhbWV3b3JrIC0gcGxhaW4gSFRNTCBjb250cm9scyAoc3R5bGVzIGZyb20gZm9ybSBsYXlvdXQgb25seSlcbmltcG9ydCB7IE5vRnJhbWV3b3JrQ29tcG9uZW50IH0gZnJvbSAnLi9uby1mcmFtZXdvcmsuY29tcG9uZW50JztcbmltcG9ydCB7IE5vRnJhbWV3b3JrIH0gZnJvbSAnLi9uby5mcmFtZXdvcmsnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiAgICAgICAgIFsgQ29tbW9uTW9kdWxlLCBXaWRnZXRMaWJyYXJ5TW9kdWxlIF0sXG4gIGRlY2xhcmF0aW9uczogICAgWyBOb0ZyYW1ld29ya0NvbXBvbmVudCBdLFxuICBleHBvcnRzOiAgICAgICAgIFsgTm9GcmFtZXdvcmtDb21wb25lbnQgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbIE5vRnJhbWV3b3JrQ29tcG9uZW50IF1cbn0pXG5leHBvcnQgY2xhc3MgTm9GcmFtZXdvcmtNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5vRnJhbWV3b3JrTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogRnJhbWV3b3JrLCB1c2VDbGFzczogTm9GcmFtZXdvcmssIG11bHRpOiB0cnVlIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=