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
export class OrderableDirective {
    constructor(elementRef, jsf, ngZone) {
        this.elementRef = elementRef;
        this.jsf = jsf;
        this.ngZone = ngZone;
        this.overParentElement = false;
        this.overChildElement = false;
    }
    ngOnInit() {
        if (this.orderable && this.layoutNode && this.layoutIndex && this.dataIndex) {
            this.element = this.elementRef.nativeElement;
            this.element.draggable = true;
            this.arrayLayoutIndex = 'move:' + this.layoutIndex.slice(0, -1).toString();
            this.ngZone.runOutsideAngular(() => {
                // Listeners for movable element being dragged:
                this.element.addEventListener('dragstart', (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    // Hack to bypass stupid HTML drag-and-drop dataTransfer protection
                    // so drag source info will be available on dragenter
                    const sourceArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    sessionStorage.setItem(this.arrayLayoutIndex, sourceArrayIndex + '');
                });
                this.element.addEventListener('dragover', (event) => {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.dataTransfer.dropEffect = 'move';
                    return false;
                });
                // Listeners for stationary items being dragged over:
                this.element.addEventListener('dragenter', (event) => {
                    // Part 1 of a hack, inspired by Dragster, to simulate mouseover and mouseout
                    // behavior while dragging items - http://bensmithett.github.io/dragster/
                    if (this.overParentElement) {
                        return this.overChildElement = true;
                    }
                    else {
                        this.overParentElement = true;
                    }
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (sourceArrayIndex !== null) {
                        if (this.dataIndex[this.dataIndex.length - 1] < +sourceArrayIndex) {
                            this.element.classList.add('drag-target-top');
                        }
                        else if (this.dataIndex[this.dataIndex.length - 1] > +sourceArrayIndex) {
                            this.element.classList.add('drag-target-bottom');
                        }
                    }
                });
                this.element.addEventListener('dragleave', (event) => {
                    // Part 2 of the Dragster hack
                    if (this.overChildElement) {
                        this.overChildElement = false;
                    }
                    else if (this.overParentElement) {
                        this.overParentElement = false;
                    }
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    if (!this.overParentElement && !this.overChildElement && sourceArrayIndex !== null) {
                        this.element.classList.remove('drag-target-top');
                        this.element.classList.remove('drag-target-bottom');
                    }
                });
                this.element.addEventListener('drop', (event) => {
                    this.element.classList.remove('drag-target-top');
                    this.element.classList.remove('drag-target-bottom');
                    // Confirm that drop target is another item in the same array as source item
                    const sourceArrayIndex = sessionStorage.getItem(this.arrayLayoutIndex);
                    const destArrayIndex = this.dataIndex[this.dataIndex.length - 1];
                    if (sourceArrayIndex !== null && +sourceArrayIndex !== destArrayIndex) {
                        // Move array item
                        this.jsf.moveArrayItem(this, +sourceArrayIndex, destArrayIndex);
                    }
                    sessionStorage.removeItem(this.arrayLayoutIndex);
                    return false;
                });
            });
        }
    }
}
OrderableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[orderable]',
            },] },
];
/** @nocollapse */
OrderableDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: JsonSchemaFormService, },
    { type: NgZone, },
];
OrderableDirective.propDecorators = {
    "orderable": [{ type: Input },],
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb24tc2NoZW1hLWZvcm0vIiwic291cmNlcyI6WyJzcmMvc2hhcmVkL29yZGVyYWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWdCLEtBQUssRUFBRSxNQUFNLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFM0YsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQnBFLE1BQU07SUFVSixZQUNVLFVBQXNCLEVBQ3RCLEdBQTBCLEVBQzFCLE1BQWM7UUFGZCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLFFBQUcsR0FBSCxHQUFHLENBQXVCO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVE7aUNBVkosS0FBSztnQ0FDTixLQUFLO0tBVW5CO0lBRUwsUUFBUTtRQUNOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7O2dCQUlqQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUss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aXN0ZW5lciwgSW5wdXQsIE5nWm9uZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBKc29uUG9pbnRlciB9IGZyb20gJy4uL3NoYXJlZC9qc29ucG9pbnRlci5mdW5jdGlvbnMnO1xuXG4vKipcbiAqIE9yZGVyYWJsZURpcmVjdGl2ZVxuICpcbiAqIEVuYWJsZXMgYXJyYXkgZWxlbWVudHMgdG8gYmUgcmVvcmRlcmVkIGJ5IGRyYWdnaW5nIGFuZCBkcm9wcGluZy5cbiAqXG4gKiBPbmx5IHdvcmtzIGZvciBhcnJheXMgdGhhdCBoYXZlIGF0IGxlYXN0IHR3byBlbGVtZW50cy5cbiAqXG4gKiBBbHNvIGRldGVjdHMgYXJyYXlzLXdpdGhpbi1hcnJheXMsIGFuZCBjb3JyZWN0bHkgbW92ZXMgZWl0aGVyXG4gKiB0aGUgY2hpbGQgYXJyYXkgZWxlbWVudCBvciB0aGUgcGFyZW50IGFycmF5IGVsZW1lbnQsXG4gKiBkZXBlbmRpbmcgb24gdGhlIGRyb3AgdGFyZ2VydC5cbiAqXG4gKiBMaXN0ZW5lcnMgZm9yIG1vdmFibGUgZWxlbWVudCBiZWluZyBkcmFnZ2VkOlxuICogLSBkcmFnc3RhcnQ6IGFkZCAnZHJhZ2dpbmcnIGNsYXNzIHRvIGVsZW1lbnQsIHNldCBlZmZlY3RBbGxvd2VkID0gJ21vdmUnXG4gKiAtIGRyYWdvdmVyOiBzZXQgZHJvcEVmZmVjdCA9ICdtb3ZlJ1xuICogLSBkcmFnZW5kOiByZW1vdmUgJ2RyYWdnaW5nJyBjbGFzcyBmcm9tIGVsZW1lbnRcbiAqXG4gKiBMaXN0ZW5lcnMgZm9yIHN0YXRpb25hcnkgaXRlbXMgYmVpbmcgZHJhZ2dlZCBvdmVyOlxuICogLSBkcmFnZW50ZXI6IGFkZCAnZHJhZy10YXJnZXQtLi4uJyBjbGFzc2VzIHRvIGVsZW1lbnRcbiAqIC0gZHJhZ2xlYXZlOiByZW1vdmUgJ2RyYWctdGFyZ2V0LS4uLicgY2xhc3NlcyBmcm9tIGVsZW1lbnRcbiAqIC0gZHJvcDogcmVtb3ZlICdkcmFnLXRhcmdldC0uLi4nIGNsYXNzZXMgZnJvbSBlbGVtZW50LCBtb3ZlIGRyb3BwZWQgYXJyYXkgaXRlbVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb3JkZXJhYmxlXScsXG59KVxuZXhwb3J0IGNsYXNzIE9yZGVyYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGFycmF5TGF5b3V0SW5kZXg6IHN0cmluZztcbiAgZWxlbWVudDogYW55O1xuICBvdmVyUGFyZW50RWxlbWVudCA9IGZhbHNlO1xuICBvdmVyQ2hpbGRFbGVtZW50ID0gZmFsc2U7XG4gIEBJbnB1dCgpIG9yZGVyYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLm9yZGVyYWJsZSAmJiB0aGlzLmxheW91dE5vZGUgJiYgdGhpcy5sYXlvdXRJbmRleCAmJiB0aGlzLmRhdGFJbmRleCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLmVsZW1lbnQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuYXJyYXlMYXlvdXRJbmRleCA9ICdtb3ZlOicgKyB0aGlzLmxheW91dEluZGV4LnNsaWNlKDAsIC0xKS50b1N0cmluZygpO1xuXG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cbiAgICAgICAgLy8gTGlzdGVuZXJzIGZvciBtb3ZhYmxlIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZDpcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgICAgICAgLy8gSGFjayB0byBieXBhc3Mgc3R1cGlkIEhUTUwgZHJhZy1hbmQtZHJvcCBkYXRhVHJhbnNmZXIgcHJvdGVjdGlvblxuICAgICAgICAgIC8vIHNvIGRyYWcgc291cmNlIGluZm8gd2lsbCBiZSBhdmFpbGFibGUgb24gZHJhZ2VudGVyXG4gICAgICAgICAgY29uc3Qgc291cmNlQXJyYXlJbmRleCA9IHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5hcnJheUxheW91dEluZGV4LCBzb3VyY2VBcnJheUluZGV4ICsgJycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfVxuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGlzdGVuZXJzIGZvciBzdGF0aW9uYXJ5IGl0ZW1zIGJlaW5nIGRyYWdnZWQgb3ZlcjpcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gUGFydCAxIG9mIGEgaGFjaywgaW5zcGlyZWQgYnkgRHJhZ3N0ZXIsIHRvIHNpbXVsYXRlIG1vdXNlb3ZlciBhbmQgbW91c2VvdXRcbiAgICAgICAgICAvLyBiZWhhdmlvciB3aGlsZSBkcmFnZ2luZyBpdGVtcyAtIGh0dHA6Ly9iZW5zbWl0aGV0dC5naXRodWIuaW8vZHJhZ3N0ZXIvXG4gICAgICAgICAgaWYgKHRoaXMub3ZlclBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm92ZXJDaGlsZEVsZW1lbnQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJQYXJlbnRFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGlmIChzb3VyY2VBcnJheUluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSW5kZXhbdGhpcy5kYXRhSW5kZXgubGVuZ3RoIC0gMV0gPCArc291cmNlQXJyYXlJbmRleCkge1xuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJhZy10YXJnZXQtdG9wJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YUluZGV4W3RoaXMuZGF0YUluZGV4Lmxlbmd0aCAtIDFdID4gK3NvdXJjZUFycmF5SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgIC8vIFBhcnQgMiBvZiB0aGUgRHJhZ3N0ZXIgaGFja1xuICAgICAgICAgIGlmICh0aGlzLm92ZXJDaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlckNoaWxkRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vdmVyUGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vdmVyUGFyZW50RWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNvdXJjZUFycmF5SW5kZXggPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuYXJyYXlMYXlvdXRJbmRleCk7XG4gICAgICAgICAgaWYgKCF0aGlzLm92ZXJQYXJlbnRFbGVtZW50ICYmICF0aGlzLm92ZXJDaGlsZEVsZW1lbnQgJiYgc291cmNlQXJyYXlJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LXRvcCcpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZy10YXJnZXQtdG9wJyk7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWctdGFyZ2V0LWJvdHRvbScpO1xuICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCBkcm9wIHRhcmdldCBpcyBhbm90aGVyIGl0ZW0gaW4gdGhlIHNhbWUgYXJyYXkgYXMgc291cmNlIGl0ZW1cbiAgICAgICAgICBjb25zdCBzb3VyY2VBcnJheUluZGV4ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIGNvbnN0IGRlc3RBcnJheUluZGV4ID0gdGhpcy5kYXRhSW5kZXhbdGhpcy5kYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKHNvdXJjZUFycmF5SW5kZXggIT09IG51bGwgJiYgK3NvdXJjZUFycmF5SW5kZXggIT09IGRlc3RBcnJheUluZGV4KSB7XG4gICAgICAgICAgICAvLyBNb3ZlIGFycmF5IGl0ZW1cbiAgICAgICAgICAgIHRoaXMuanNmLm1vdmVBcnJheUl0ZW0odGhpcywgK3NvdXJjZUFycmF5SW5kZXgsIGRlc3RBcnJheUluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmFycmF5TGF5b3V0SW5kZXgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19