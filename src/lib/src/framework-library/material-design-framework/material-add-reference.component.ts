import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JsonSchemaFormService } from '../../json-schema-form.service';

@Component({
  selector: 'material-add-reference-widget',
  template: `
    <section [class]="options?.htmlClass || ''" align="start">
      <button mat-mini-fab *ngIf="showAddButton" 
        style="margin-bottom: 10px;"
        [color]="options?.color || 'accent'"
        [disabled]="options?.readonly"
        (click)="addItem($event)"
        matTooltip="{{options?.title}}">
        <mat-icon>add</mat-icon>
      </button>
    </section>`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MaterialAddReferenceComponent implements OnInit {
  options: any;
  itemCount: number;
  previousLayoutIndex: number[];
  previousDataIndex: number[];
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
  }

  get showAddButton(): boolean {
    return !this.layoutNode.arrayItem ||
      this.layoutIndex[this.layoutIndex.length - 1] < this.options.maxItems;
  }

  addItem(event) {
    event.preventDefault();
    this.jsf.addItem(this);
  }

  get buttonText(): string {
    const parent: any = {
      dataIndex: this.dataIndex.slice(0, -1),
      layoutIndex: this.layoutIndex.slice(0, -1),
      layoutNode: this.jsf.getParentNode(this),
    };
    return parent.layoutNode.add ||
      this.jsf.setArrayItemTitle(parent, this.layoutNode, this.itemCount);
  }
}
