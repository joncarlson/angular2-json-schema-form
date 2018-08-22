import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
/**
 * OrderableDirective
 *
 * Enables array elements to be reordered by dragging and dropping.
 *
 * Only works for arrays that have at least two elements.
 *
 * Also detects arrays-within-arrays, and correctly moves either
 * the child array element or the parent array element,
 * depending on the drop targert.
 *
 * Listeners for movable element being dragged:
 * - dragstart: add 'dragging' class to element, set effectAllowed = 'move'
 * - dragover: set dropEffect = 'move'
 * - dragend: remove 'dragging' class from element
 *
 * Listeners for stationary items being dragged over:
 * - dragenter: add 'drag-target-...' classes to element
 * - dragleave: remove 'drag-target-...' classes from element
 * - drop: remove 'drag-target-...' classes from element, move dropped array item
 */
var OrderableDirective = /** @class */ (function () {
    function OrderableDirective(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    OrderableDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular(function () {
                // Listeners for movable element being dragged:
                // Listeners for movable element being dragged:
                _this.element.addEventListener('dragstart', function (event) {
                    event.dataTransfer.effectAllowed = 'move';
                    // Hack to bypass stupid HTML drag-and-drop dataTransfer protection
                    // so drag source info will be available on dragenter
                    var sourceArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    sessionStorage.setItem(_this.arrayLayoutIndex, sourceArrayIndex + '');
                });
                _this.element.addEventListener('dragover', function (event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                });
                // Listeners for stationary items being dragged over:
                // Listeners for stationary items being dragged over:
                _this.element.addEventListener('dragenter', function (event) {
                    // Part 1 of a hack, inspired by Dragster, to simulate mouseover and mouseout
                    // behavior while dragging items - http://bensmithett.github.io/dragster/
                    if (_this.overParentElement) {
                        return _this.overChildElement = true;
                    }
                    else {
                        _this.overParentElement = true;
                    }
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (_this.dataIndex[_this.dataIndex.length - 1] < +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-top');
                        }
                        else if (_this.dataIndex[_this.dataIndex.length - 1] > +sourceArrayIndex) {
                            _this.element.classList.add('drag-target-bottom');
                        }
                    }
                });
                _this.element.addEventListener('dragleave', function (event) {
                    // Part 2 of the Dragster hack
                    if (_this.overChildElement) {
                        _this.overChildElement = false;
                    }
                    else if (_this.overParentElement) {
                        _this.overParentElement = false;
                    }
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    if (!_this.overParentElement && !_this.overChildElement && sourceArrayIndex !== null) {
                        _this.element.classList.remove('drag-target-top');
                        _this.element.classList.remove('drag-target-bottom');
                    }
                });
                _this.element.addEventListener('drop', function (event) {
                    _this.element.classList.remove('drag-target-top');
                    _this.element.classList.remove('drag-target-bottom');
                    // Confirm that drop target is another item in the same array as source item
                    var sourceArrayIndex = sessionStorage.getItem(_this.arrayLayoutIndex);
                    var destArrayIndex = _this.dataIndex[_this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        // Move array item
                        // Move array item
                        _this.jsf.moveArrayItem(_this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(_this.arrayLayoutIndex);
                    return false;
                });
            });
        }
    };
    OrderableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[orderable]',
                },] },
    ];
    /** @nocollapse */
    OrderableDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: JsonSchemaFormService, },
        { type: NgZone, },
    ]; };
    OrderableDirective.propDecorators = {
        "orderable": [{ type: Input },],
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return OrderableDirective;
}());
export { OrderableDirective };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvc2hhcmVkL29yZGVyYWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWdCLEtBQUssRUFBRSxNQUFNLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFM0YsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUNsRSw0QkFDVSxVQUFzQixFQUN0QixHQUEwQixFQUMxQixNQUFjO1FBRmQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixRQUFHLEdBQUgsR0FBRyxDQUF1QjtRQUMxQixXQUFNLEdBQU4sTUFBTSxDQUFRO2lDQVZKLEtBQUs7Z0NBQ04sS0FBSztLQVVuQjtJQUVMLHFDQUFRLEdBQVI7UUFBQSxpQkE0RUM7UUEzRUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUUzRSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDOztnQkFJNUIsQUFGQSwrQ0FBK0M7Z0JBRS9DLEtBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMs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b3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIgfSBmcm9tICcuLi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcblxuLyoqXG4gKiBPcmRlcmFibGVEaXJlY3RpdmVcbiAqXG4gKiBFbmFibGVzIGFycmF5IGVsZW1lbnRzIHRvIGJlIHJlb3JkZXJlZCBieSBkcmFnZ2luZyBhbmQgZHJvcHBpbmcuXG4gKlxuICogT25seSB3b3JrcyBmb3IgYXJyYXlzIHRoYXQgaGF2ZSBhdCBsZWFzdCB0d28gZWxlbWVudHMuXG4gKlxuICogQWxzbyBkZXRlY3RzIGFycmF5cy13aXRoaW4tYXJyYXlzLCBhbmQgY29ycmVjdGx5IG1vdmVzIGVpdGhlclxuICogdGhlIGNoaWxkIGFycmF5IGVsZW1lbnQgb3IgdGhlIHBhcmVudCBhcnJheSBlbGVtZW50LFxuICogZGVwZW5kaW5nIG9uIHRoZSBkcm9wIHRhcmdlcnQuXG4gKlxuICogTGlzdGVuZXJzIGZvciBtb3ZhYmxlIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZDpcbiAqIC0gZHJhZ3N0YXJ0OiBhZGQgJ2RyYWdnaW5nJyBjbGFzcyB0byBlbGVtZW50LCBzZXQgZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJ1xuICogLSBkcmFnb3Zlcjogc2V0IGRyb3BFZmZlY3QgPSAnbW92ZSdcbiAqIC0gZHJhZ2VuZDogcmVtb3ZlICdkcmFnZ2luZycgY2xhc3MgZnJvbSBlbGVtZW50XG4gKlxuICogTGlzdGVuZXJzIGZvciBzdGF0aW9uYXJ5IGl0ZW1zIGJlaW5nIGRyYWdnZWQgb3ZlcjpcbiAqIC0gZHJhZ2VudGVyOiBhZGQgJ2RyYWctdGFyZ2V0LS4uLicgY2xhc3NlcyB0byBlbGVtZW50XG4gKiAtIGRyYWdsZWF2ZTogcmVtb3ZlICdkcmFnLXRhcmdldC0uLi4nIGNsYXNzZXMgZnJvbSBlbGVtZW50XG4gKiAtIGRyb3A6IHJlbW92ZSAnZHJhZy10YXJnZXQtLi4uJyBjbGFzc2VzIGZyb20gZWxlbWVudCwgbW92ZSBkcm9wcGVkIGFycmF5IGl0ZW1cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29yZGVyYWJsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBPcmRlcmFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBhcnJheUxheW91dEluZGV4OiBzdHJpbmc7XG4gIGVsZW1lbnQ6IGFueTtcbiAgb3ZlclBhcmVudEVsZW1lbnQgPSBmYWxzZTtcbiAgb3ZlckNoaWxkRWxlbWVudCA9IGZhbHNlO1xuICBASW5wdXQoKSBvcmRlcmFibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmVcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5vcmRlcmFibGUgJiYgdGhpcy5sYXlvdXROb2RlICYmIHRoaXMubGF5b3V0SW5kZXggJiYgdGhpcy5kYXRhSW5kZXgpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5lbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICB0aGlzLmFycmF5TGF5b3V0SW5kZXggPSAnbW92ZTonICsgdGhpcy5sYXlvdXRJbmRleC5zbGljZSgwLCAtMSkudG9TdHJpbmcoKTtcblxuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG4gICAgICAgIC8vIExpc3RlbmVycyBmb3IgbW92YWJsZSBlbGVtZW50IGJlaW5nIGRyYWdnZWQ6XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgIC8vIEhhY2sgdG8gYnlwYXNzIHN0dXBpZCBIVE1MIGRyYWctYW5kLWRyb3AgZGF0YVRyYW5zZmVyIHByb3RlY3Rpb25cbiAgICAgICAgICAvLyBzbyBkcmFnIHNvdXJjZSBpbmZvIHdpbGwgYmUgYXZhaWxhYmxlIG9uIGRyYWdlbnRlclxuICAgICAgICAgIGNvbnN0IHNvdXJjZUFycmF5SW5kZXggPSB0aGlzLmRhdGFJbmRleFt0aGlzLmRhdGFJbmRleC5sZW5ndGggLSAxXTtcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuYXJyYXlMYXlvdXRJbmRleCwgc291cmNlQXJyYXlJbmRleCArICcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExpc3RlbmVycyBmb3Igc3RhdGlvbmFyeSBpdGVtcyBiZWluZyBkcmFnZ2VkIG92ZXI6XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgIC8vIFBhcnQgMSBvZiBhIGhhY2ssIGluc3BpcmVkIGJ5IERyYWdzdGVyLCB0byBzaW11bGF0ZSBtb3VzZW92ZXIgYW5kIG1vdXNlb3V0XG4gICAgICAgICAgLy8gYmVoYXZpb3Igd2hpbGUgZHJhZ2dpbmcgaXRlbXMgLSBodHRwOi8vYmVuc21pdGhldHQuZ2l0aHViLmlvL2RyYWdzdGVyL1xuICAgICAgICAgIGlmICh0aGlzLm92ZXJQYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vdmVyQ2hpbGRFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vdmVyUGFyZW50RWxlbWVudCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICBpZiAoc291cmNlQXJyYXlJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdIDwgK3NvdXJjZUFycmF5SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFJbmRleFt0aGlzLmRhdGFJbmRleC5sZW5ndGggLSAxXSA+ICtzb3VyY2VBcnJheUluZGV4KSB7XG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAvLyBQYXJ0IDIgb2YgdGhlIERyYWdzdGVyIGhhY2tcbiAgICAgICAgICBpZiAodGhpcy5vdmVyQ2hpbGRFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJDaGlsZEVsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3ZlclBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlclBhcmVudEVsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGlmICghdGhpcy5vdmVyUGFyZW50RWxlbWVudCAmJiAhdGhpcy5vdmVyQ2hpbGRFbGVtZW50ICYmIHNvdXJjZUFycmF5SW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC10b3AnKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnLXRhcmdldC1ib3R0b20nKTtcbiAgICAgICAgICAvLyBDb25maXJtIHRoYXQgZHJvcCB0YXJnZXQgaXMgYW5vdGhlciBpdGVtIGluIHRoZSBzYW1lIGFycmF5IGFzIHNvdXJjZSBpdGVtXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICBjb25zdCBkZXN0QXJyYXlJbmRleCA9IHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmIChzb3VyY2VBcnJheUluZGV4ICE9PSBudWxsICYmICtzb3VyY2VBcnJheUluZGV4ICE9PSBkZXN0QXJyYXlJbmRleCkge1xuICAgICAgICAgICAgLy8gTW92ZSBhcnJheSBpdGVtXG4gICAgICAgICAgICB0aGlzLmpzZi5tb3ZlQXJyYXlJdGVtKHRoaXMsICtzb3VyY2VBcnJheUluZGV4LCBkZXN0QXJyYXlJbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==