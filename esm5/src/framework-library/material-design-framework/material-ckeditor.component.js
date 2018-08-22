import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
var MaterialCkeditorComponent = /** @class */ (function () {
    function MaterialCkeditorComponent(jsf) {
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
    MaterialCkeditorComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    MaterialCkeditorComponent.prototype.commentsClick = function () {
        console.log(this.layoutNode.dataPointer);
    };
    MaterialCkeditorComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event);
    };
    MaterialCkeditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'material-ckeditor-widget',
                    template: "<div\n    [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <ck-editor (ngModelChange)=\"updateValue($event)\" [(ngModel)]=\"controlValue\" [name]=\"controlName\" [config]=\"config\">\n      </ck-editor>\n       <button mat-mini-fab *ngIf=\"options?.comments\" color=\"primary\" (click)=\"commentsClick()\"><mat-icon>comment</mat-icon></button>\n    </div>\n    "
                },] },
    ];
    /** @nocollapse */
    MaterialCkeditorComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    MaterialCkeditorComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return MaterialCkeditorComponent;
}());
export { MaterialCkeditorComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9mcmFtZXdvcmstbGlicmFyeS9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrL21hdGVyaWFsLWNrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUd6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7SUE4RHJFLG1DQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCOytCQXpDbEIsS0FBSzs0QkFDUixLQUFLO3NCQU1YO1lBQ1AsVUFBVSxFQUFFLHFGQUFxRjtZQUNqRyxhQUFhLEVBQUU7Z0JBQ2IsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFJLE1BQU0sRUFBRSxDQUFFLFdBQVcsRUFBRSxNQUFNLENBQUUsRUFBRTtnQkFDeEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFNLE1BQU0sRUFBRSxDQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFFLEVBQUU7Z0JBQ3hFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtnQkFDakIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVTtvQkFDZixNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBRSxFQUFFO2dCQUMvQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xCLEdBQUc7Z0JBQ0gsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFFLGFBQWEsRUFBRSxTQUFTLENBQUUsRUFBRTtnQkFDN0QsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFJLE1BQU0sRUFBRSxDQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUUsRUFBRTtnQkFDaEYsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTthQUNsQjs7O1lBSUQsYUFBYSxFQUFFLFdBQVc7O1lBRzFCLFdBQVcsRUFBRSxnQkFBZ0I7O1lBRzdCLGdCQUFnQixFQUFFLDhCQUE4QjtZQUNoRCxvQkFBb0IsRUFBRSxxQkFBcUI7WUFDM0Msb0JBQW9CLEVBQUUsc0JBQXNCO1NBQzdDO0tBSUk7SUFFTCw0Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3JEO0tBQ0Y7SUFFRCxpREFBYSxHQUFiO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsK0NBQVcsR0FBWCxVQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbkM7O2dCQTlFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUNOLGttQkFXQztpQkFDSjs7OztnQkFqQlEscUJBQXFCOzs7K0JBeUIzQixLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzs7b0NBOUJSOztTQXFCYSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtY2tlZGl0b3Itd2lkZ2V0JyxcbiAgdGVtcGxhdGU6ICAgICAgXG4gICAgYDxkaXZcbiAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICA8bGFiZWwgKm5nSWY9XCJvcHRpb25zPy50aXRsZVwiXG4gICAgICAgIFthdHRyLmZvcl09XCInY29udHJvbCcgKyBsYXlvdXROb2RlPy5faWRcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8ubGFiZWxIdG1sQ2xhc3MgfHwgJydcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJvcHRpb25zPy5ub3RpdGxlID8gJ25vbmUnIDogJydcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cIm9wdGlvbnM/LnRpdGxlXCI+PC9sYWJlbD5cbiAgICAgIDxjay1lZGl0b3IgKG5nTW9kZWxDaGFuZ2UpPVwidXBkYXRlVmFsdWUoJGV2ZW50KVwiIFsobmdNb2RlbCldPVwiY29udHJvbFZhbHVlXCIgW25hbWVdPVwiY29udHJvbE5hbWVcIiBbY29uZmlnXT1cImNvbmZpZ1wiPlxuICAgICAgPC9jay1lZGl0b3I+XG4gICAgICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgKm5nSWY9XCJvcHRpb25zPy5jb21tZW50c1wiIGNvbG9yPVwicHJpbWFyeVwiIChjbGljayk9XCJjb21tZW50c0NsaWNrKClcIj48bWF0LWljb24+Y29tbWVudDwvbWF0LWljb24+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbENrZWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25maWcgPSB7XG4gICAgbWF0aEpheExpYjogJ2h0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21hdGhqYXgvMi43LjQvTWF0aEpheC5qcz9jb25maWc9VGVYLUFNU19IVE1MJywgICAgXG4gICAgdG9vbGJhckdyb3VwczogW1xuICAgICAgeyBuYW1lOiAnY2xpcGJvYXJkJywgICBncm91cHM6IFsgJ2NsaXBib2FyZCcsICd1bmRvJyBdIH0sXG4gICAgICB7IG5hbWU6ICdlZGl0aW5nJywgICAgIGdyb3VwczogWyAnZmluZCcsICdzZWxlY3Rpb24nLCAnc3BlbGxjaGVja2VyJyBdIH0sXG4gICAgICB7IG5hbWU6ICdsaW5rcycgfSxcbiAgICAgIHsgbmFtZTogJ2luc2VydCcgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1zJyB9LFxuICAgICAgeyBuYW1lOiAndG9vbHMnIH0sXG4gICAgICB7IG5hbWU6ICdkb2N1bWVudCcsXG4gICAgICAgICBncm91cHM6IFsgJ21vZGUnLCAnZG9jdW1lbnQnLCAnZG9jdG9vbHMnIF0gfSxcbiAgICAgIHsgbmFtZTogJ290aGVycycgfSxcbiAgICAgICcvJyxcbiAgICAgIHsgbmFtZTogJ2Jhc2ljc3R5bGVzJywgZ3JvdXBzOiBbICdiYXNpY3N0eWxlcycsICdjbGVhbnVwJyBdIH0sXG4gICAgICB7IG5hbWU6ICdwYXJhZ3JhcGgnLCAgIGdyb3VwczogWyAnbGlzdCcsICdpbmRlbnQnLCAnYmxvY2tzJywgJ2FsaWduJywgJ2JpZGknIF0gfSxcbiAgICAgIHsgbmFtZTogJ3N0eWxlcycgfSxcbiAgICAgIHsgbmFtZTogJ2NvbG9ycycgfSxcbiAgICAgIHsgbmFtZTogJ2Fib3V0JyB9XG4gICAgXSxcblxuICAgIC8vIFJlbW92ZSBzb21lIGJ1dHRvbnMgcHJvdmlkZWQgYnkgdGhlIHN0YW5kYXJkIHBsdWdpbnMsIHdoaWNoIGFyZVxuICAgIC8vIG5vdCBuZWVkZWQgaW4gdGhlIFN0YW5kYXJkKHMpIHRvb2xiYXIuXG4gICAgcmVtb3ZlQnV0dG9uczogJ1VuZGVybGluZScsXG5cbiAgICAvLyBTZXQgdGhlIG1vc3QgY29tbW9uIGJsb2NrIGVsZW1lbnRzLlxuICAgIGZvcm1hdF90YWdzOiAncDtoMTtoMjtoMztwcmUnLFxuXG4gICAgLy8gU2ltcGxpZnkgdGhlIGRpYWxvZyB3aW5kb3dzLlxuICAgIHJlbW92ZURpYWxvZ1RhYnM6ICdpbWFnZTphZHZhbmNlZDtsaW5rOmFkdmFuY2VkJyxcbiAgICBmaWxlYnJvd3NlckJyb3dzZVVybDogJy9icm93c2VyL2Jyb3dzZS5waHAnLFxuICAgIGZpbGVicm93c2VyVXBsb2FkVXJsOiAnL3VwbG9hZGVyL3VwbG9hZC5waHAnXG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGpzZjogSnNvblNjaGVtYUZvcm1TZXJ2aWNlXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5sYXlvdXROb2RlLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5qc2YuaW5pdGlhbGl6ZUNvbnRyb2wodGhpcyk7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubm90aXRsZSAmJiAhdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uICYmIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfVxuXG4gIGNvbW1lbnRzQ2xpY2soKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5sYXlvdXROb2RlLmRhdGFQb2ludGVyKTtcbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdGhpcy5qc2YudXBkYXRlVmFsdWUodGhpcywgZXZlbnQpO1xuICB9XG59XG4iXX0=