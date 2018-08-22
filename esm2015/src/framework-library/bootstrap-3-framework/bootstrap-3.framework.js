import { Injectable } from '@angular/core';
import { Framework } from '../framework';
import { Bootstrap3FrameworkComponent } from './bootstrap-3-framework.component';
export class Bootstrap3Framework extends Framework {
    constructor() {
        super(...arguments);
        this.name = 'bootstrap-3';
        this.framework = Bootstrap3FrameworkComponent;
        this.stylesheets = [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
        ];
        this.scripts = [
            '//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
            '//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        ];
    }
}
Bootstrap3Framework.decorators = [
    { type: Injectable },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLTMuZnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9ib290c3RyYXAtMy1mcmFtZXdvcmsvYm9vdHN0cmFwLTMuZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUl6QyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdqRixNQUFNLDBCQUEyQixTQUFRLFNBQVM7OztvQkFDekMsYUFBYTt5QkFFUiw0QkFBNEI7MkJBRTFCO1lBQ1osaUVBQWlFO1lBQ2pFLHVFQUF1RTtTQUN4RTt1QkFFUztZQUNSLDREQUE0RDtZQUM1RCxrRUFBa0U7WUFDbEUsK0RBQStEO1NBQ2hFOzs7O1lBZkYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRnJhbWV3b3JrIH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcblxuLy8gQm9vdHN0cmFwIDMgRnJhbWV3b3JrXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdmFsb3Itc29mdHdhcmUvbmcyLWJvb3RzdHJhcFxuaW1wb3J0IHsgQm9vdHN0cmFwM0ZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJy4vYm9vdHN0cmFwLTMtZnJhbWV3b3JrLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCb290c3RyYXAzRnJhbWV3b3JrIGV4dGVuZHMgRnJhbWV3b3JrIHtcbiAgbmFtZSA9ICdib290c3RyYXAtMyc7XG5cbiAgZnJhbWV3b3JrID0gQm9vdHN0cmFwM0ZyYW1ld29ya0NvbXBvbmVudDtcblxuICBzdHlsZXNoZWV0cyA9IFtcbiAgICAnLy9tYXhjZG4uYm9vdHN0cmFwY2RuLmNvbS9ib290c3RyYXAvMy4zLjcvY3NzL2Jvb3RzdHJhcC5taW4uY3NzJyxcbiAgICAnLy9tYXhjZG4uYm9vdHN0cmFwY2RuLmNvbS9ib290c3RyYXAvMy4zLjcvY3NzL2Jvb3RzdHJhcC10aGVtZS5taW4uY3NzJyxcbiAgXTtcblxuICBzY3JpcHRzID0gW1xuICAgICcvL2FqYXguZ29vZ2xlYXBpcy5jb20vYWpheC9saWJzL2pxdWVyeS8yLjIuNC9qcXVlcnkubWluLmpzJyxcbiAgICAnLy9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy9qcXVlcnl1aS8xLjEyLjEvanF1ZXJ5LXVpLm1pbi5qcycsXG4gICAgJy8vbWF4Y2RuLmJvb3RzdHJhcGNkbi5jb20vYm9vdHN0cmFwLzMuMy43L2pzL2Jvb3RzdHJhcC5taW4uanMnLFxuICBdO1xufVxuIl19