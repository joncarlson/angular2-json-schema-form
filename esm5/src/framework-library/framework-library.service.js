import { Inject, Injectable } from '@angular/core';
import { WidgetLibraryService } from '../widget-library/widget-library.service';
import { hasOwn } from '../shared/utility.functions';
import { Framework } from './framework';
// Possible future frameworks:
// - Foundation 6:
//   http://justindavis.co/2017/06/15/using-foundation-6-in-angular-4/
//   https://github.com/zurb/foundation-sites
// - Semantic UI:
//   https://github.com/edcarroll/ng2-semantic-ui
//   https://github.com/vladotesanovic/ngSemantic
var FrameworkLibraryService = /** @class */ (function () {
    function FrameworkLibraryService(frameworks, widgetLibrary) {
        var _this = this;
        this.frameworks = frameworks;
        this.widgetLibrary = widgetLibrary;
        this.activeFramework = null;
        this.loadExternalAssets = false;
        this.frameworkLibrary = {};
        this.frameworks.forEach(function (framework) {
            return _this.frameworkLibrary[framework.name] = framework;
        });
        this.defaultFramework = this.frameworks[0].name;
        this.setFramework(this.defaultFramework);
    }
    FrameworkLibraryService.prototype.setLoadExternalAssets = function (loadExternalAssets) {
        if (loadExternalAssets === void 0) { loadExternalAssets = true; }
        this.loadExternalAssets = !!loadExternalAssets;
    };
    FrameworkLibraryService.prototype.setFramework = function (framework, loadExternalAssets) {
        if (framework === void 0) { framework = this.defaultFramework; }
        if (loadExternalAssets === void 0) { loadExternalAssets = this.loadExternalAssets; }
        this.activeFramework =
            typeof framework === 'string' && this.hasFramework(framework) ?
                this.frameworkLibrary[framework] :
                typeof framework === 'object' && hasOwn(framework, 'framework') ?
                    framework :
                    this.frameworkLibrary[this.defaultFramework];
        return this.registerFrameworkWidgets(this.activeFramework);
    };
    FrameworkLibraryService.prototype.registerFrameworkWidgets = function (framework) {
        return hasOwn(framework, 'widgets') ?
            this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
            this.widgetLibrary.unRegisterFrameworkWidgets();
    };
    FrameworkLibraryService.prototype.hasFramework = function (type) {
        return hasOwn(this.frameworkLibrary, type);
    };
    FrameworkLibraryService.prototype.getFramework = function () {
        if (!this.activeFramework) {
            this.setFramework('default', true);
        }
        return this.activeFramework.framework;
    };
    FrameworkLibraryService.prototype.getFrameworkWidgets = function () {
        return this.activeFramework.widgets || {};
    };
    FrameworkLibraryService.prototype.getFrameworkStylesheets = function (load) {
        if (load === void 0) { load = this.loadExternalAssets; }
        return (load && this.activeFramework.stylesheets) || [];
    };
    FrameworkLibraryService.prototype.getFrameworkScripts = function (load) {
        if (load === void 0) { load = this.loadExternalAssets; }
        return (load && this.activeFramework.scripts) || [];
    };
    FrameworkLibraryService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FrameworkLibraryService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Inject, args: [Framework,] },] },
        { type: WidgetLibraryService, decorators: [{ type: Inject, args: [WidgetLibraryService,] },] },
    ]; };
    return FrameworkLibraryService;
}());
export { FrameworkLibraryService };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvZnJhbWV3b3JrLWxpYnJhcnkvZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNoRixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7Ozs7O0lBbUJ0QyxpQ0FDNkIsWUFDVztRQUZ4QyxpQkFTQztRQVI0QixlQUFVLEdBQVYsVUFBVTtRQUNDLGtCQUFhLEdBQWIsYUFBYTsrQkFUeEIsSUFBSTtrQ0FHWixLQUFLO2dDQUV3QixFQUFFO1FBTWxELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUztZQUMvQixPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUztRQUFqRCxDQUFpRCxDQUNsRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDMUM7SUFFTSx1REFBcUIsR0FBNUIsVUFBNkIsa0JBQXlCO1FBQXpCLG1DQUFBLEVBQUEseUJBQXlCO1FBQ3BELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUM7S0FDaEQ7SUFFTSw4Q0FBWSxHQUFuQixVQUNFLFNBQW1ELEVBQ25ELGtCQUE0QztRQUQ1QywwQkFBQSxFQUFBLFlBQThCLElBQUksQ0FBQyxnQkFBZ0I7UUFDbkQsbUNBQUEsRUFBQSxxQkFBcUIsSUFBSSxDQUFDLGtCQUFrQjtRQUU1QyxJQUFJLENBQUMsZUFBZTtZQUNsQixPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxTQUFTLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsU0FBUyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzVEO0lBRUQsMERBQXdCLEdBQXhCLFVBQXlCLFNBQW9CO1FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsYUFBYSxDQUFDLDBCQUEwQixFQUFFLENBQUM7S0FDbkQ7SUFFTSw4Q0FBWSxHQUFuQixVQUFvQixJQUFZO1FBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVDO0lBRU0sOENBQVksR0FBbkI7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FBRTtRQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7S0FDdkM7SUFFTSxxREFBbUIsR0FBMUI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQzNDO0lBRU0seURBQXVCLEdBQTlCLFVBQStCLElBQXVDO1FBQXZDLHFCQUFBLEVBQUEsT0FBZ0IsSUFBSSxDQUFDLGtCQUFrQjtRQUNwRSxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekQ7SUFFTSxxREFBbUIsR0FBMUIsVUFBMkIsSUFBdUM7UUFBdkMscUJBQUEsRUFBQSxPQUFnQixJQUFJLENBQUMsa0JBQWtCO1FBQ2hFLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNyRDs7Z0JBOURGLFVBQVU7Ozs7NENBVU4sTUFBTSxTQUFDLFNBQVM7Z0JBdkJaLG9CQUFvQix1QkF3QnhCLE1BQU0sU0FBQyxvQkFBb0I7O2tDQTFCaEM7O1NBZ0JhLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBXaWRnZXRMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4uL3dpZGdldC1saWJyYXJ5L3dpZGdldC1saWJyYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHsgaGFzT3duIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxpdHkuZnVuY3Rpb25zJztcblxuaW1wb3J0IHsgRnJhbWV3b3JrIH0gZnJvbSAnLi9mcmFtZXdvcmsnO1xuXG4vLyBQb3NzaWJsZSBmdXR1cmUgZnJhbWV3b3Jrczpcbi8vIC0gRm91bmRhdGlvbiA2OlxuLy8gICBodHRwOi8vanVzdGluZGF2aXMuY28vMjAxNy8wNi8xNS91c2luZy1mb3VuZGF0aW9uLTYtaW4tYW5ndWxhci00L1xuLy8gICBodHRwczovL2dpdGh1Yi5jb20venVyYi9mb3VuZGF0aW9uLXNpdGVzXG4vLyAtIFNlbWFudGljIFVJOlxuLy8gICBodHRwczovL2dpdGh1Yi5jb20vZWRjYXJyb2xsL25nMi1zZW1hbnRpYy11aVxuLy8gICBodHRwczovL2dpdGh1Yi5jb20vdmxhZG90ZXNhbm92aWMvbmdTZW1hbnRpY1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRnJhbWV3b3JrTGlicmFyeVNlcnZpY2Uge1xuICBhY3RpdmVGcmFtZXdvcms6IEZyYW1ld29yayA9IG51bGw7XG4gIHN0eWxlc2hlZXRzOiAoSFRNTFN0eWxlRWxlbWVudHxIVE1MTGlua0VsZW1lbnQpW107XG4gIHNjcmlwdHM6IEhUTUxTY3JpcHRFbGVtZW50W107XG4gIGxvYWRFeHRlcm5hbEFzc2V0cyA9IGZhbHNlO1xuICBkZWZhdWx0RnJhbWV3b3JrOiBzdHJpbmc7XG4gIGZyYW1ld29ya0xpYnJhcnk6IHsgW25hbWU6IHN0cmluZ106IEZyYW1ld29yayB9ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChGcmFtZXdvcmspIHByaXZhdGUgZnJhbWV3b3JrczogYW55W10sXG4gICAgQEluamVjdChXaWRnZXRMaWJyYXJ5U2VydmljZSkgcHJpdmF0ZSB3aWRnZXRMaWJyYXJ5OiBXaWRnZXRMaWJyYXJ5U2VydmljZVxuICApIHtcbiAgICB0aGlzLmZyYW1ld29ya3MuZm9yRWFjaChmcmFtZXdvcmsgPT5cbiAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVtmcmFtZXdvcmsubmFtZV0gPSBmcmFtZXdvcmtcbiAgICApO1xuICAgIHRoaXMuZGVmYXVsdEZyYW1ld29yayA9IHRoaXMuZnJhbWV3b3Jrc1swXS5uYW1lO1xuICAgIHRoaXMuc2V0RnJhbWV3b3JrKHRoaXMuZGVmYXVsdEZyYW1ld29yayk7XG4gIH1cblxuICBwdWJsaWMgc2V0TG9hZEV4dGVybmFsQXNzZXRzKGxvYWRFeHRlcm5hbEFzc2V0cyA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyA9ICEhbG9hZEV4dGVybmFsQXNzZXRzO1xuICB9XG5cbiAgcHVibGljIHNldEZyYW1ld29yayhcbiAgICBmcmFtZXdvcms6IHN0cmluZ3xGcmFtZXdvcmsgPSB0aGlzLmRlZmF1bHRGcmFtZXdvcmssXG4gICAgbG9hZEV4dGVybmFsQXNzZXRzID0gdGhpcy5sb2FkRXh0ZXJuYWxBc3NldHNcbiAgKTogYm9vbGVhbiB7XG4gICAgdGhpcy5hY3RpdmVGcmFtZXdvcmsgPVxuICAgICAgdHlwZW9mIGZyYW1ld29yayA9PT0gJ3N0cmluZycgJiYgdGhpcy5oYXNGcmFtZXdvcmsoZnJhbWV3b3JrKSA/XG4gICAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVtmcmFtZXdvcmtdIDpcbiAgICAgIHR5cGVvZiBmcmFtZXdvcmsgPT09ICdvYmplY3QnICYmIGhhc093bihmcmFtZXdvcmssICdmcmFtZXdvcmsnKSA/XG4gICAgICAgIGZyYW1ld29yayA6XG4gICAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVt0aGlzLmRlZmF1bHRGcmFtZXdvcmtdO1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cyh0aGlzLmFjdGl2ZUZyYW1ld29yayk7XG4gIH1cblxuICByZWdpc3RlckZyYW1ld29ya1dpZGdldHMoZnJhbWV3b3JrOiBGcmFtZXdvcmspOiBib29sZWFuIHtcbiAgICByZXR1cm4gaGFzT3duKGZyYW1ld29yaywgJ3dpZGdldHMnKSA/XG4gICAgICB0aGlzLndpZGdldExpYnJhcnkucmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKGZyYW1ld29yay53aWRnZXRzKSA6XG4gICAgICB0aGlzLndpZGdldExpYnJhcnkudW5SZWdpc3RlckZyYW1ld29ya1dpZGdldHMoKTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNGcmFtZXdvcmsodHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc093bih0aGlzLmZyYW1ld29ya0xpYnJhcnksIHR5cGUpO1xuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29yaygpOiBhbnkge1xuICAgIGlmICghdGhpcy5hY3RpdmVGcmFtZXdvcmspIHsgdGhpcy5zZXRGcmFtZXdvcmsoJ2RlZmF1bHQnLCB0cnVlKTsgfVxuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZyYW1ld29yay5mcmFtZXdvcms7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrV2lkZ2V0cygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZyYW1ld29yay53aWRnZXRzIHx8IHt9O1xuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29ya1N0eWxlc2hlZXRzKGxvYWQ6IGJvb2xlYW4gPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gKGxvYWQgJiYgdGhpcy5hY3RpdmVGcmFtZXdvcmsuc3R5bGVzaGVldHMpIHx8IFtdO1xuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29ya1NjcmlwdHMobG9hZDogYm9vbGVhbiA9IHRoaXMubG9hZEV4dGVybmFsQXNzZXRzKTogc3RyaW5nW10ge1xuICAgIHJldHVybiAobG9hZCAmJiB0aGlzLmFjdGl2ZUZyYW1ld29yay5zY3JpcHRzKSB8fCBbXTtcbiAgfVxufVxuIl19