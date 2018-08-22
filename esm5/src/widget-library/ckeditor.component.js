import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
var CkeditorComponent = /** @class */ (function () {
    function CkeditorComponent(jsf) {
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
    CkeditorComponent.prototype.ngOnInit = function () {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (!this.options.notitle && !this.options.description && this.options.placeholder) {
            this.options.description = this.options.placeholder;
        }
    };
    CkeditorComponent.prototype.commentsClick = function () {
        console.log(this.layoutNode.dataPointer);
    };
    CkeditorComponent.prototype.updateValue = function (event) {
        this.jsf.updateValue(this, event);
    };
    CkeditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ckeditor-widget',
                    template: "<div\n    [class]=\"options?.htmlClass || ''\">\n      <label *ngIf=\"options?.title\"\n        [attr.for]=\"'control' + layoutNode?._id\"\n        [class]=\"options?.labelHtmlClass || ''\"\n        [style.display]=\"options?.notitle ? 'none' : ''\"\n        [innerHTML]=\"options?.title\"></label>\n      <ck-editor (ngModelChange)=\"updateValue($event)\" [(ngModel)]=\"controlValue\" [name]=\"controlName\" [config]=\"config\">\n      </ck-editor>\n       <button *ngIf=\"options?.comments\" color=\"primary\" (click)=\"commentsClick()\"></button>\n    </div>\n    "
                },] },
    ];
    /** @nocollapse */
    CkeditorComponent.ctorParameters = function () { return [
        { type: JsonSchemaFormService, },
    ]; };
    CkeditorComponent.propDecorators = {
        "layoutNode": [{ type: Input },],
        "layoutIndex": [{ type: Input },],
        "dataIndex": [{ type: Input },],
    };
    return CkeditorComponent;
}());
export { CkeditorComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy93aWRnZXQtbGlicmFyeS9ja2VkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHekQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0lBOERsRSwyQkFDVSxHQUEwQjtRQUExQixRQUFHLEdBQUgsR0FBRyxDQUF1QjsrQkF6Q2xCLEtBQUs7NEJBQ1IsS0FBSztzQkFNWDtZQUNQLFVBQVUsRUFBRSxxRkFBcUY7WUFDakcsYUFBYSxFQUFFO2dCQUNiLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBSSxNQUFNLEVBQUUsQ0FBRSxXQUFXLEVBQUUsTUFBTSxDQUFFLEVBQUU7Z0JBQ3hELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBTSxNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBRSxFQUFFO2dCQUN4RSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDbEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2dCQUNqQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVU7b0JBQ2YsTUFBTSxFQUFFLENBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUUsRUFBRTtnQkFDL0MsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixHQUFHO2dCQUNILEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBRSxhQUFhLEVBQUUsU0FBUyxDQUFFLEVBQUU7Z0JBQzdELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBSSxNQUFNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFFLEVBQUU7Z0JBQ2hGLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtnQkFDbEIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO2dCQUNsQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDbEI7OztZQUlELGFBQWEsRUFBRSxXQUFXOztZQUcxQixXQUFXLEVBQUUsZ0JBQWdCOztZQUc3QixnQkFBZ0IsRUFBRSw4QkFBOEI7WUFDaEQsb0JBQW9CLEVBQUUscUJBQXFCO1lBQzNDLG9CQUFvQixFQUFFLHNCQUFzQjtTQUM3QztLQUlJO0lBRUwsb0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUNyRDtLQUNGO0lBRUQseUNBQWEsR0FBYjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMxQztJQUVELHVDQUFXLEdBQVgsVUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ25DOztnQkE5RUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFDTix5akJBV0M7aUJBQ0o7Ozs7Z0JBakJRLHFCQUFxQjs7OytCQXlCM0IsS0FBSztnQ0FDTCxLQUFLOzhCQUNMLEtBQUs7OzRCQTlCUjs7U0FxQmEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NrZWRpdG9yLXdpZGdldCcsXG4gIHRlbXBsYXRlOlxuICAgIGA8ZGl2XG4gICAgW2NsYXNzXT1cIm9wdGlvbnM/Lmh0bWxDbGFzcyB8fCAnJ1wiPlxuICAgICAgPGxhYmVsICpuZ0lmPVwib3B0aW9ucz8udGl0bGVcIlxuICAgICAgICBbYXR0ci5mb3JdPVwiJ2NvbnRyb2wnICsgbGF5b3V0Tm9kZT8uX2lkXCJcbiAgICAgICAgW2NsYXNzXT1cIm9wdGlvbnM/LmxhYmVsSHRtbENsYXNzIHx8ICcnXCJcbiAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwib3B0aW9ucz8ubm90aXRsZSA/ICdub25lJyA6ICcnXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJvcHRpb25zPy50aXRsZVwiPjwvbGFiZWw+XG4gICAgICA8Y2stZWRpdG9yIChuZ01vZGVsQ2hhbmdlKT1cInVwZGF0ZVZhbHVlKCRldmVudClcIiBbKG5nTW9kZWwpXT1cImNvbnRyb2xWYWx1ZVwiIFtuYW1lXT1cImNvbnRyb2xOYW1lXCIgW2NvbmZpZ109XCJjb25maWdcIj5cbiAgICAgIDwvY2stZWRpdG9yPlxuICAgICAgIDxidXR0b24gKm5nSWY9XCJvcHRpb25zPy5jb21tZW50c1wiIGNvbG9yPVwicHJpbWFyeVwiIChjbGljayk9XCJjb21tZW50c0NsaWNrKClcIj48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIENrZWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcbiAgY29udHJvbE5hbWU6IHN0cmluZztcbiAgY29udHJvbFZhbHVlOiBhbnk7XG4gIGNvbnRyb2xEaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZENvbnRyb2wgPSBmYWxzZTtcbiAgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBsYXlvdXROb2RlOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dEluZGV4OiBudW1iZXJbXTtcbiAgQElucHV0KCkgZGF0YUluZGV4OiBudW1iZXJbXTtcblxuICBjb25maWcgPSB7XG4gICAgbWF0aEpheExpYjogJ2h0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21hdGhqYXgvMi43LjQvTWF0aEpheC5qcz9jb25maWc9VGVYLUFNU19IVE1MJyxcbiAgICB0b29sYmFyR3JvdXBzOiBbXG4gICAgICB7IG5hbWU6ICdjbGlwYm9hcmQnLCAgIGdyb3VwczogWyAnY2xpcGJvYXJkJywgJ3VuZG8nIF0gfSxcbiAgICAgIHsgbmFtZTogJ2VkaXRpbmcnLCAgICAgZ3JvdXBzOiBbICdmaW5kJywgJ3NlbGVjdGlvbicsICdzcGVsbGNoZWNrZXInIF0gfSxcbiAgICAgIHsgbmFtZTogJ2xpbmtzJyB9LFxuICAgICAgeyBuYW1lOiAnaW5zZXJ0JyB9LFxuICAgICAgeyBuYW1lOiAnZm9ybXMnIH0sXG4gICAgICB7IG5hbWU6ICd0b29scycgfSxcbiAgICAgIHsgbmFtZTogJ2RvY3VtZW50JyxcbiAgICAgICAgIGdyb3VwczogWyAnbW9kZScsICdkb2N1bWVudCcsICdkb2N0b29scycgXSB9LFxuICAgICAgeyBuYW1lOiAnb3RoZXJzJyB9LFxuICAgICAgJy8nLFxuICAgICAgeyBuYW1lOiAnYmFzaWNzdHlsZXMnLCBncm91cHM6IFsgJ2Jhc2ljc3R5bGVzJywgJ2NsZWFudXAnIF0gfSxcbiAgICAgIHsgbmFtZTogJ3BhcmFncmFwaCcsICAgZ3JvdXBzOiBbICdsaXN0JywgJ2luZGVudCcsICdibG9ja3MnLCAnYWxpZ24nLCAnYmlkaScgXSB9LFxuICAgICAgeyBuYW1lOiAnc3R5bGVzJyB9LFxuICAgICAgeyBuYW1lOiAnY29sb3JzJyB9LFxuICAgICAgeyBuYW1lOiAnYWJvdXQnIH1cbiAgICBdLFxuXG4gICAgLy8gUmVtb3ZlIHNvbWUgYnV0dG9ucyBwcm92aWRlZCBieSB0aGUgc3RhbmRhcmQgcGx1Z2lucywgd2hpY2ggYXJlXG4gICAgLy8gbm90IG5lZWRlZCBpbiB0aGUgU3RhbmRhcmQocykgdG9vbGJhci5cbiAgICByZW1vdmVCdXR0b25zOiAnVW5kZXJsaW5lJyxcblxuICAgIC8vIFNldCB0aGUgbW9zdCBjb21tb24gYmxvY2sgZWxlbWVudHMuXG4gICAgZm9ybWF0X3RhZ3M6ICdwO2gxO2gyO2gzO3ByZScsXG5cbiAgICAvLyBTaW1wbGlmeSB0aGUgZGlhbG9nIHdpbmRvd3MuXG4gICAgcmVtb3ZlRGlhbG9nVGFiczogJ2ltYWdlOmFkdmFuY2VkO2xpbms6YWR2YW5jZWQnLFxuICAgIGZpbGVicm93c2VyQnJvd3NlVXJsOiAnL2Jyb3dzZXIvYnJvd3NlLnBocCcsXG4gICAgZmlsZWJyb3dzZXJVcGxvYWRVcmw6ICcvdXBsb2FkZXIvdXBsb2FkLnBocCdcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmxheW91dE5vZGUub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmpzZi5pbml0aWFsaXplQ29udHJvbCh0aGlzKTtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ub3RpdGxlICYmICF0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gJiYgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XG4gICAgfVxuICB9XG5cbiAgY29tbWVudHNDbGljaygpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmxheW91dE5vZGUuZGF0YVBvaW50ZXIpO1xuICB9XG5cbiAgdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICB0aGlzLmpzZi51cGRhdGVWYWx1ZSh0aGlzLCBldmVudCk7XG4gIH1cbn1cbiJdfQ==