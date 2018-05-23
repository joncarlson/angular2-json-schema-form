import { OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../../json-schema-form.service';
export declare class MaterialCkeditorComponent implements OnInit {
    private jsf;
    formControl: AbstractControl;
    controlName: string;
    controlValue: any;
    controlDisabled: boolean;
    boundControl: boolean;
    options: any;
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    config: {
        mathJaxLib: string;
        toolbarGroups: (string | {
            name: string;
            groups: string[];
        } | {
            name: string;
            groups?: undefined;
        })[];
        removeButtons: string;
        format_tags: string;
        removeDialogTabs: string;
        filebrowserBrowseUrl: string;
        filebrowserUploadUrl: string;
    };
    constructor(jsf: JsonSchemaFormService);
    ngOnInit(): void;
    commentsClick(): void;
    updateValue(event: any): void;
}
