import { OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { isArray } from '../../shared';
export declare class MaterialSelectIconComponent implements OnInit {
    private jsf;
    formControl: AbstractControl;
    controlName: string;
    controlValue: any;
    controlDisabled: boolean;
    boundControl: boolean;
    options: any;
    selectList: any[];
    isArray: typeof isArray;
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    defaultIcons: string[];
    selected: string;
    constructor(jsf: JsonSchemaFormService);
    ngOnInit(): void;
    updateValue(event: any): void;
}
