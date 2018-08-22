import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
export class CkeditorComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.controlDisabled = false;
        this.boundControl = false;
        this.config = {
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            toolbarGroups: [
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'forms' },
                { name: 'tools' },
                { name: 'document',
                    groups: ['mode', 'document', 'doctools'] },
                { name: 'others' },
                '/',
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
                { name: 'styles' },
                { name: 'colors' },
                { name: 'about' }
            ],
            // Remove some buttons provided by the standard plugins, which are
            // not needed in the Standard(s) toolbar.
            removeButtons: 'Underline',
            // Set the most common block elements.
            format_tags: 'p;h1;h2;h3;pre',
            // Simplify the dialog windows.
            removeDialogTabs: 'image:advanced;link:advanced',
            filebrowserBrowseUrl: '/browser/browse.php',
            filebrowserUploadUrl: '/uploader/upload.php'
        };
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    }
    commentsClick() {
        console.log(this.layoutNode.dataPointer);
    }
    updateValue(event) {
        this.jsf.updateValue(this, event);
    }
}
CkeditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ckeditor-widget',
                template: `<div
    [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <ck-editor (ngModelChange)="updateValue($event)" [(ngModel)]="controlValue" [name]="controlName" [config]="config">
      </ck-editor>
       <button *ngIf="options?.comments" color="primary" (click)="commentsClick()"></button>
    </div>
    `
            },] },
];
/** @nocollapse */
CkeditorComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
CkeditorComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS9ja2VkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFrQnBFLE1BQU07SUE0Q0osWUFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjsrQkF6Q2xCLEtBQUs7NEJBQ1IsS0FBSztzQkFNWDtZQUNQLFVBQVUsRUFBRSxxRkFBcUY7WUFDakcsYUFBYSxFQUFFO2dCQUNiLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBSSxNQUFNLEVBQUUsQ0FBRSxXQUFXLEVBQUUsTUFBTSxDQUFFLEVBQUU7Z0JBQ3hELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBTSxNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBRSxFQUFFO2dCQUN4RSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDbEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2dCQUNqQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVU7b0JBQ2YsTUFBTSxFQUFFLENBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUUsRUFBRTtnQkFDL0MsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixHQUFHO2dCQUNILEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBRSxhQUFhLEVBQUUsU0FBUyxDQUFFLEVBQUU7Z0JBQzdELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBSSxNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFFLEVBQUU7Z0JBQ2hGLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDbEIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDbEI7OztZQUlELGFBQWEsRUFBRSxXQUFXOztZQUcxQixXQUFXLEVBQUUsZ0JBQWdCOztZQUc3QixnQkFBZ0IsRUFBRSw4QkFBOEI7WUFDaEQsb0JBQW9CLEVBQUUscUJBQXFCO1lBQzNDLG9CQUFvQixFQUFFLHNCQUFzQjtTQUM3QztLQUlJO0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUNyRDtLQUNGO0lBRUQsYUFBYTtRQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMxQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ25DOzs7WUE5RUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFDTjs7Ozs7Ozs7Ozs7S0FXQzthQUNKOzs7O1lBakJRLHFCQUFxQjs7OzJCQXlCM0IsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2tlZGl0b3Itd2lkZ2V0JyxcbiAgdGVtcGxhdGU6XG4gICAgYDxkaXZcbiAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8bGFiZWwgKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIFthdHRyLmZvcl09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9sYWJlbD5cbiAgICAgIDxjay1lZGl0b3IgKG5nTW9kZWxDaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiIFsobmdNb2RlbCldPVwiY29udHJvbFZhbHVlXCIgW25hbWVdPVwiY29udHJvbE5hbWVcIiBbY29uZmlnXT1cImNvbmZpZ1wiPlxuICAgICAgPC9jay1lZGl0b3I+XG4gICAgICAgPGJ1dHRvbiAqbmdJZj1cIm9wdGlvbnM/LmNvbW1lbnRzXCIgY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cImNvbW1lbnRzQ2xpY2soKVwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgQ2tlZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbmZpZyA9IHtcbiAgICBtYXRoSmF4TGliOiAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbWF0aGpheC8yLjcuNC9NYXRoSmF4LmpzP2NvbmZpZz1UZVgtQU1TX0hUTUwnLFxuICAgIHRvb2xiYXJHcm91cHM6IFtcbiAgICAgIHsgbmFtZTogJ2NsaXBib2FyZCcsICAgZ3JvdXBzOiBbICdjbGlwYm9hcmQnLCAndW5kbycgXSB9LFxuICAgICAgeyBuYW1lOiAnZWRpdGluZycsICAgICBncm91cHM6IFsgJ2ZpbmQnLCAnc2VsZWN0aW9uJywgJ3NwZWxsY2hlY2tlcicgXSB9LFxuICAgICAgeyBuYW1lOiAnbGlua3MnIH0sXG4gICAgICB7IG5hbWU6ICdpbnNlcnQnIH0sXG4gICAgICB7IG5hbWU6ICdmb3JtcycgfSxcbiAgICAgIHsgbmFtZTogJ3Rvb2xzJyB9LFxuICAgICAgeyBuYW1lOiAnZG9jdW1lbnQnLFxuICAgICAgICAgZ3JvdXBzOiBbICdtb2RlJywgJ2RvY3VtZW50JywgJ2RvY3Rvb2xzJyBdIH0sXG4gICAgICB7IG5hbWU6ICdvdGhlcnMnIH0sXG4gICAgICAnLycsXG4gICAgICB7IG5hbWU6ICdiYXNpY3N0eWxlcycsIGdyb3VwczogWyAnYmFzaWNzdHlsZXMnLCAnY2xlYW51cCcgXSB9LFxuICAgICAgeyBuYW1lOiAncGFyYWdyYXBoJywgICBncm91cHM6IFsgJ2xpc3QnLCAnaW5kZW50JywgJ2Jsb2NrcycsICdhbGlnbicsICdiaWRpJyBdIH0sXG4gICAgICB7IG5hbWU6ICdzdHlsZXMnIH0sXG4gICAgICB7IG5hbWU6ICdjb2xvcnMnIH0sXG4gICAgICB7IG5hbWU6ICdhYm91dCcgfVxuICAgIF0sXG5cbiAgICAvLyBSZW1vdmUgc29tZSBidXR0b25zIHByb3ZpZGVkIGJ5IHRoZSBzdGFuZGFyZCBwbHVnaW5zLCB3aGljaCBhcmVcbiAgICAvLyBub3QgbmVlZGVkIGluIHRoZSBTdGFuZGFyZChzKSB0b29sYmFyLlxuICAgIHJlbW92ZUJ1dHRvbnM6ICdVbmRlcmxpbmUnLFxuXG4gICAgLy8gU2V0IHRoZSBtb3N0IGNvbW1vbiBibG9jayBlbGVtZW50cy5cbiAgICBmb3JtYXRfdGFnczogJ3A7aDE7aDI7aDM7cHJlJyxcblxuICAgIC8vIFNpbXBsaWZ5IHRoZSBkaWFsb2cgd2luZG93cy5cbiAgICByZW1vdmVEaWFsb2dUYWJzOiAnaW1hZ2U6YWR2YW5jZWQ7bGluazphZHZhbmNlZCcsXG4gICAgZmlsZWJyb3dzZXJCcm93c2VVcmw6ICcvYnJvd3Nlci9icm93c2UucGhwJyxcbiAgICBmaWxlYnJvd3NlclVwbG9hZFVybDogJy91cGxvYWRlci91cGxvYWQucGhwJ1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuanNmLmluaXRpYWxpemVDb250cm9sKHRoaXMpO1xuICAgIGlmICghdGhpcy5vcHRpb25zLm5vdGl0bGUgJiYgIXRoaXMub3B0aW9ucy5kZXNjcmlwdGlvbiAmJiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgICB9XG4gIH1cblxuICBjb21tZW50c0NsaWNrKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcik7XG4gIH1cblxuICB1cGRhdGVWYWx1ZShldmVudCkge1xuICAgIHRoaXMuanNmLnVwZGF0ZVZhbHVlKHRoaXMsIGV2ZW50KTtcbiAgfVxufVxuIl19