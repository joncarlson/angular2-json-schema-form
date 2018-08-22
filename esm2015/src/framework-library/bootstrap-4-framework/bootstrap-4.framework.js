import { Injectable } from '@angular/core';
import { Framework } from '../framework';
import { Bootstrap4FrameworkComponent } from './bootstrap-4-framework.component';
export class Bootstrap4Framework extends Framework {
    constructor() {
        super(...arguments);
        this.name = 'bootstrap-4';
        this.framework = Bootstrap4FrameworkComponent;
        this.stylesheets = [
            '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css'
        ];
        this.scripts = [
            '//code.jquery.com/jquery-3.2.1.slim.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js',
        ];
    }
}
Bootstrap4Framework.decorators = [
    { type: Injectable },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLTQuZnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9ib290c3RyYXAtNC1mcmFtZXdvcmsvYm9vdHN0cmFwLTQuZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUl6QyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUlqRixNQUFNLDBCQUEyQixTQUFRLFNBQVM7OztvQkFDekMsYUFBYTt5QkFFUiw0QkFBNEI7MkJBRTFCO1lBQ1osd0VBQXdFO1NBQ3pFO3VCQUVTO1lBQ1IsNENBQTRDO1lBQzVDLHFFQUFxRTtZQUNyRSxzRUFBc0U7U0FDdkU7Ozs7WUFkRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGcmFtZXdvcmsgfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xuXG4vLyBCb290c3RyYXAgNCBGcmFtZXdvcmtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG5pbXBvcnQgeyBCb290c3RyYXA0RnJhbWV3b3JrQ29tcG9uZW50IH0gZnJvbSAnLi9ib290c3RyYXAtNC1mcmFtZXdvcmsuY29tcG9uZW50JztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwNEZyYW1ld29yayBleHRlbmRzIEZyYW1ld29yayB7XG4gIG5hbWUgPSAnYm9vdHN0cmFwLTQnO1xuXG4gIGZyYW1ld29yayA9IEJvb3RzdHJhcDRGcmFtZXdvcmtDb21wb25lbnQ7XG5cbiAgc3R5bGVzaGVldHMgPSBbXG4gICAgJy8vbWF4Y2RuLmJvb3RzdHJhcGNkbi5jb20vYm9vdHN0cmFwLzQuMC4wLWJldGEuMi9jc3MvYm9vdHN0cmFwLm1pbi5jc3MnXG4gIF07XG5cbiAgc2NyaXB0cyA9IFtcbiAgICAnLy9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTMuMi4xLnNsaW0ubWluLmpzJyxcbiAgICAnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvcG9wcGVyLmpzLzEuMTIuMy91bWQvcG9wcGVyLm1pbi5qcycsXG4gICAgJy8vbWF4Y2RuLmJvb3RzdHJhcGNkbi5jb20vYm9vdHN0cmFwLzQuMC4wLWJldGEuMi9qcy9ib290c3RyYXAubWluLmpzJyxcbiAgXTtcbn1cbiJdfQ==