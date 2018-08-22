import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLibraryModule } from '../../widget-library/widget-library.module';
import { Framework } from '../framework';
import { Bootstrap4FrameworkComponent } from './bootstrap-4-framework.component';
import { Bootstrap4Framework } from './bootstrap-4.framework';
var Bootstrap4FrameworkModule = /** @class */ (function () {
    function Bootstrap4FrameworkModule() {
    }
    Bootstrap4FrameworkModule.forRoot = function () {
        return {
            ngModule: Bootstrap4FrameworkModule,
            providers: [
                { provide: Framework, useClass: Bootstrap4Framework, multi: true }
            ]
        };
    };
    Bootstrap4FrameworkModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, WidgetLibraryModule],
                    declarations: [Bootstrap4FrameworkComponent],
                    exports: [Bootstrap4FrameworkComponent],
                    entryComponents: [Bootstrap4FrameworkComponent]
                },] },
    ];
    return Bootstrap4FrameworkModule;
}());
export { Bootstrap4FrameworkModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLTQtZnJhbWV3b3JrLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvYm9vdHN0cmFwLTQtZnJhbWV3b3JrL2Jvb3RzdHJhcC00LWZyYW1ld29yay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7SUFTckQsaUNBQU8sR0FBZDtRQUNFLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTthQUNuRTtTQUNGLENBQUM7S0FDSDs7Z0JBZEYsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBVSxDQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBRTtvQkFDdEQsWUFBWSxFQUFLLENBQUUsNEJBQTRCLENBQUU7b0JBQ2pELE9BQU8sRUFBVSxDQUFFLDRCQUE0QixDQUFFO29CQUNqRCxlQUFlLEVBQUUsQ0FBRSw0QkFBNEIsQ0FBRTtpQkFDbEQ7O29DQWREOztTQWVhLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2lkZ2V0TGlicmFyeU1vZHVsZSB9IGZyb20gJy4uLy4uL3dpZGdldC1saWJyYXJ5L3dpZGdldC1saWJyYXJ5Lm1vZHVsZSc7XG5pbXBvcnQgeyBGcmFtZXdvcmsgfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xuaW1wb3J0IHsgQm9vdHN0cmFwNEZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJy4vYm9vdHN0cmFwLTQtZnJhbWV3b3JrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCb290c3RyYXA0RnJhbWV3b3JrIH0gZnJvbSAnLi9ib290c3RyYXAtNC5mcmFtZXdvcmsnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiAgICAgICAgIFsgQ29tbW9uTW9kdWxlLCBXaWRnZXRMaWJyYXJ5TW9kdWxlIF0sXG4gIGRlY2xhcmF0aW9uczogICAgWyBCb290c3RyYXA0RnJhbWV3b3JrQ29tcG9uZW50IF0sXG4gIGV4cG9ydHM6ICAgICAgICAgWyBCb290c3RyYXA0RnJhbWV3b3JrQ29tcG9uZW50IF0sXG4gIGVudHJ5Q29tcG9uZW50czogWyBCb290c3RyYXA0RnJhbWV3b3JrQ29tcG9uZW50IF1cbn0pXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwNEZyYW1ld29ya01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQm9vdHN0cmFwNEZyYW1ld29ya01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IEZyYW1ld29yaywgdXNlQ2xhc3M6IEJvb3RzdHJhcDRGcmFtZXdvcmssIG11bHRpOiB0cnVlIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=