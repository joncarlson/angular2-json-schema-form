import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export class MaterialCkeditorComponent {
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
MaterialCkeditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'material-ckeditor-widget',
                template: `<div
    [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <ck-editor (ngModelChange)="updateValue($event)" [(ngModel)]="controlValue" [name]="controlName" [config]="config">
      </ck-editor>
       <button mat-mini-fab *ngIf="options?.comments" color="primary" (click)="commentsClick()"><mat-icon>comment</mat-icon></button>
    </div>
    `
            },] },
];
/** @nocollapse */
MaterialCkeditorComponent.ctorParameters = () => [
    { type: JsonSchemaFormService, },
];
MaterialCkeditorComponent.propDecorators = {
    "layoutNode": [{ type: Input },],
    "layoutIndex": [{ type: Input },],
    "dataIndex": [{ type: Input },],
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWNrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQWtCdkUsTUFBTTtJQTRDSixZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQXpDbEIsS0FBSzs0QkFDUixLQUFLO3NCQU1YO1lBQ1AsVUFBVSxFQUFFLHFGQUFxRjtZQUNqRyxhQUFhLEVBQUU7Z0JBQ2IsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFJLE1BQU0sRUFBRSxDQUFFLFdBQVcsRUFBRSxNQUFNLENBQUUsRUFBRTtnQkFDeEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFNLE1BQU0sRUFBRSxDQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFFLEVBQUU7Z0JBQ3hFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtnQkFDakIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVTtvQkFDZixNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBRSxFQUFFO2dCQUMvQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xCLEdBQUc7Z0JBQ0gsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFFLGFBQWEsRUFBRSxTQUFTLENBQUUsRUFBRTtnQkFDN0QsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFJLE1BQU0sRUFBRSxDQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUUsRUFBRTtnQkFDaEYsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTthQUNsQjs7O1lBSUQsYUFBYSxFQUFFLFdBQVc7O1lBRzFCLFdBQVcsRUFBRSxnQkFBZ0I7O1lBRzdCLGdCQUFnQixFQUFFLDhCQUE4QjtZQUNoRCxvQkFBb0IsRUFBRSxxQkFBcUI7WUFDM0Msb0JBQW9CLEVBQUUsc0JBQXNCO1NBQzdDO0tBSUk7SUFFTCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3JEO0tBQ0Y7SUFFRCxhQUFhO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsV0FBVyxDQUFDLEtBQUs7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbkM7OztZQTlFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsUUFBUSxFQUNOOzs7Ozs7Ozs7OztLQVdDO2FBQ0o7Ozs7WUFqQlEscUJBQXFCOzs7MkJBeUIzQixLQUFLOzRCQUNMLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hRm9ybVNlcnZpY2UgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXRlcmlhbC1ja2VkaXRvci13aWRnZXQnLFxuICB0ZW1wbGF0ZTogICAgICBcbiAgICBgPGRpdlxuICAgIFtjbGFzc109XCJvcHRpb25zPy5odG1sQ2xhc3MgfHwgJydcIj5cbiAgICAgIDxsYWJlbCAqbmdJZj1cIm9wdGlvbnM/LnRpdGxlXCJcbiAgICAgICAgW2F0dHIuZm9yXT1cIidjb250cm9sJyArIGxheW91dE5vZGU/Ll9pZFwiXG4gICAgICAgIFtjbGFzc109XCJvcHRpb25zPy5sYWJlbEh0bWxDbGFzcyB8fCAnJ1wiXG4gICAgICAgIFtzdHlsZS5kaXNwbGF5XT1cIm9wdGlvbnM/Lm5vdGl0bGUgPyAnbm9uZScgOiAnJ1wiXG4gICAgICAgIFtpbm5lckhUTUxdPVwib3B0aW9ucz8udGl0bGVcIj48L2xhYmVsPlxuICAgICAgPGNrLWVkaXRvciAobmdNb2RlbENoYW5nZSk9XCJ1cGRhdGVWYWx1ZSgkZXZlbnQpXCIgWyhuZ01vZGVsKV09XCJjb250cm9sVmFsdWVcIiBbbmFtZV09XCJjb250cm9sTmFtZVwiIFtjb25maWddPVwiY29uZmlnXCI+XG4gICAgICA8L2NrLWVkaXRvcj5cbiAgICAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiAqbmdJZj1cIm9wdGlvbnM/LmNvbW1lbnRzXCIgY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cImNvbW1lbnRzQ2xpY2soKVwiPjxtYXQtaWNvbj5jb21tZW50PC9tYXQtaWNvbj48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsQ2tlZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtQ29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuICBjb250cm9sTmFtZTogc3RyaW5nO1xuICBjb250cm9sVmFsdWU6IGFueTtcbiAgY29udHJvbERpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kQ29udHJvbCA9IGZhbHNlO1xuICBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dE5vZGU6IGFueTtcbiAgQElucHV0KCkgbGF5b3V0SW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuXG4gIGNvbmZpZyA9IHtcbiAgICBtYXRoSmF4TGliOiAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbWF0aGpheC8yLjcuNC9NYXRoSmF4LmpzP2NvbmZpZz1UZVgtQU1TX0hUTUwnLCAgICBcbiAgICB0b29sYmFyR3JvdXBzOiBbXG4gICAgICB7IG5hbWU6ICdjbGlwYm9hcmQnLCAgIGdyb3VwczogWyAnY2xpcGJvYXJkJywgJ3VuZG8nIF0gfSxcbiAgICAgIHsgbmFtZTogJ2VkaXRpbmcnLCAgICAgZ3JvdXBzOiBbICdmaW5kJywgJ3NlbGVjdGlvbicsICdzcGVsbGNoZWNrZXInIF0gfSxcbiAgICAgIHsgbmFtZTogJ2xpbmtzJyB9LFxuICAgICAgeyBuYW1lOiAnaW5zZXJ0JyB9LFxuICAgICAgeyBuYW1lOiAnZm9ybXMnIH0sXG4gICAgICB7IG5hbWU6ICd0b29scycgfSxcbiAgICAgIHsgbmFtZTogJ2RvY3VtZW50JyxcbiAgICAgICAgIGdyb3VwczogWyAnbW9kZScsICdkb2N1bWVudCcsICdkb2N0b29scycgXSB9LFxuICAgICAgeyBuYW1lOiAnb3RoZXJzJyB9LFxuICAgICAgJy8nLFxuICAgICAgeyBuYW1lOiAnYmFzaWNzdHlsZXMnLCBncm91cHM6IFsgJ2Jhc2ljc3R5bGVzJywgJ2NsZWFudXAnIF0gfSxcbiAgICAgIHsgbmFtZTogJ3BhcmFncmFwaCcsICAgZ3JvdXBzOiBbICdsaXN0JywgJ2luZGVudCcsICdibG9ja3MnLCAnYWxpZ24nLCAnYmlkaScgXSB9LFxuICAgICAgeyBuYW1lOiAnc3R5bGVzJyB9LFxuICAgICAgeyBuYW1lOiAnY29sb3JzJyB9LFxuICAgICAgeyBuYW1lOiAnYWJvdXQnIH1cbiAgICBdLFxuXG4gICAgLy8gUmVtb3ZlIHNvbWUgYnV0dG9ucyBwcm92aWRlZCBieSB0aGUgc3RhbmRhcmQgcGx1Z2lucywgd2hpY2ggYXJlXG4gICAgLy8gbm90IG5lZWRlZCBpbiB0aGUgU3RhbmRhcmQocykgdG9vbGJhci5cbiAgICByZW1vdmVCdXR0b25zOiAnVW5kZXJsaW5lJyxcblxuICAgIC8vIFNldCB0aGUgbW9zdCBjb21tb24gYmxvY2sgZWxlbWVudHMuXG4gICAgZm9ybWF0X3RhZ3M6ICdwO2gxO2gyO2gzO3ByZScsXG5cbiAgICAvLyBTaW1wbGlmeSB0aGUgZGlhbG9nIHdpbmRvd3MuXG4gICAgcmVtb3ZlRGlhbG9nVGFiczogJ2ltYWdlOmFkdmFuY2VkO2xpbms6YWR2YW5jZWQnLFxuICAgIGZpbGVicm93c2VyQnJvd3NlVXJsOiAnL2Jyb3dzZXIvYnJvd3NlLnBocCcsXG4gICAgZmlsZWJyb3dzZXJVcGxvYWRVcmw6ICcvdXBsb2FkZXIvdXBsb2FkLnBocCdcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ub3RpdGxlICYmICF0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gJiYgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICB9XG5cbiAgY29tbWVudHNDbGljaygpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmxheW91dE5vZGUuZGF0YVBvaW50ZXIpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudCk7XG4gIH1cbn1cbiJdfQ==