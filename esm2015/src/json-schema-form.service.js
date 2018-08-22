import { Injectable } from '@angular/core';
import { Subject } from 'rxjs-compat/Subject';
import * as Ajv from 'ajv';
import * as _ from 'lodash';
import { hasValue, isArray, isDefined, isEmpty, isObject } from './shared/validator.functions';
import { fixTitle, forEach, hasOwn, toTitleCase } from './shared/utility.functions';
import { JsonPointer } from './shared/jsonpointer.functions';
import { buildSchemaFromData, buildSchemaFromLayout, removeRecursiveReferences } from './shared/json-schema.functions';
import { buildFormGroup, buildFormGroupTemplate, formatFormData, getControl } from './shared/form-group.functions';
import { buildLayout, getLayoutNode } from './shared/layout.functions';
import { enValidationMessages } from './locale/en-validation-messages';
import { frValidationMessages } from './locale/fr-validation-messages';
export class JsonSchemaFormService {
    constructor() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.ajvOptions = { allErrors: true, jsonPointers: true, unknownFormats: 'ignore' };
        this.ajv = new Ajv(this.ajvOptions);
        this.validateFormData = null;
        this.formValues = {};
        this.data = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.validData = null;
        this.isValid = null;
        this.ajvErrors = null;
        this.validationErrors = null;
        this.dataErrors = new Map();
        this.formValueSubscription = null;
        this.dataChanges = new Subject();
        this.isValidChanges = new Subject();
        this.validationErrorChanges = new Subject();
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.schemaRefLibrary = {};
        this.layoutRefLibrary = { '': null };
        this.templateRefLibrary = {};
        this.hasRootReference = false;
        this.language = 'en-US';
        this.defaultLayoutOptions = {};
        // Default global form options
        this.defaultFormOptions = {
            addSubmit: 'auto',
            // Add a submit button if layout does not have one?
            // for addSubmit: true = always, false = never,
            // 'auto' = only if layout is undefined (form is built from schema alone)
            debug: false,
            // Show debugging output?
            disableInvalidSubmit: true,
            // Disable submit if form invalid?
            formDisabled: false,
            // Set entire form as disabled? (not editable, and disables outputs)
            formReadonly: false,
            // Set entire form as read only? (not editable, but outputs still enabled)
            fieldsRequired: false,
            // (set automatically) Are there any required fields in the form?
            framework: 'no-framework',
            // The framework to load
            loadExternalAssets: false,
            // Load external css and JavaScript for framework?
            pristine: { errors: true, success: true },
            supressPropertyTitles: false,
            setSchemaDefaults: 'auto',
            // Set fefault values from schema?
            // true = always set (unless overridden by layout default or formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            setLayoutDefaults: 'auto',
            // Set fefault values from layout?
            // true = always set (unless overridden by formValues)
            // false = never set
            // 'auto' = set in addable components, and everywhere if formValues not set
            validateOnRender: 'auto',
            // Validate fields immediately, before they are touched?
            // true = validate all fields immediately
            // false = only validate fields after they are touched by user
            // 'auto' = validate fields with values immediately, empty fields after they are touched
            widgets: {},
            // Any custom widgets to load
            defautWidgetOptions: {
                // Default options for form control widgets
                listItems: 1,
                // Number of list items to initially add to arrays with no default value
                addable: true,
                // Allow adding items to an array or $ref point?
                orderable: false,
                // Allow reordering items within an array?
                removable: true,
                // Allow removing items from an array or $ref point?
                enableErrorState: true,
                // Apply 'has-error' class when field fails validation?
                // disableErrorState: false, // Don't apply 'has-error' class when field fails validation?
                enableSuccessState: true,
                // Apply 'has-success' class when field validates?
                // disableSuccessState: false, // Don't apply 'has-success' class when field validates?
                feedback: false,
                // Show inline feedback icons?
                feedbackOnRender: false,
                // Show errorMessage on Render?
                notitle: false,
                // Hide title?
                disabled: false,
                // Set control as disabled? (not editable, and excluded from output)
                readonly: false,
                // Set control as read only? (not editable, but included in output)
                returnEmptyFields: true,
                // return values for fields that contain no data?
                validationMessages: {} // set by setLanguage()
            },
        };
        this.setLanguage(this.language);
    }
    setLanguage(language = 'en-US') {
        this.language = language;
        const validationMessages = language.slice(0, 2) === 'fr' ?
            frValidationMessages : enValidationMessages;
        this.defaultFormOptions.defautWidgetOptions.validationMessages =
            _.cloneDeep(validationMessages);
    }
    getData() { return this.data; }
    getSchema() { return this.schema; }
    getLayout() { return this.layout; }
    resetAllValues() {
        this.JsonFormCompatibility = false;
        this.ReactJsonSchemaFormCompatibility = false;
        this.AngularSchemaFormCompatibility = false;
        this.tpldata = {};
        this.validateFormData = null;
        this.formValues = {};
        this.schema = {};
        this.layout = [];
        this.formGroupTemplate = {};
        this.formGroup = null;
        this.framework = null;
        this.data = {};
        this.validData = null;
        this.isValid = null;
        this.validationErrors = null;
        this.arrayMap = new Map();
        this.dataMap = new Map();
        this.dataRecursiveRefMap = new Map();
        this.schemaRecursiveRefMap = new Map();
        this.layoutRefLibrary = {};
        this.schemaRefLibrary = {};
        this.templateRefLibrary = {};
        this.formOptions = _.cloneDeep(this.defaultFormOptions);
    }
    /**
       * 'buildRemoteError' function
       *
       * Example errors:
       * {
       *   last_name: [ {
       *     message: 'Last name must by start with capital letter.',
       *     code: 'capital_letter'
       *   } ],
       *   email: [ {
       *     message: 'Email must be from example.com domain.',
       *     code: 'special_domain'
       *   }, {
       *     message: 'Email must contain an @ symbol.',
       *     code: 'at_symbol'
       *   } ]
       * }
       * @param {ErrorMessages} errors
       */
    buildRemoteError(errors) {
        forEach(errors, (value, key) => {
            if (key in this.formGroup.controls) {
                for (const error of value) {
                    const err = {};
                    err[error['code']] = error['message'];
                    this.formGroup.get(key).setErrors(err, { emitEvent: true });
                }
            }
        });
    }
    validateData(newValue, updateSubscriptions = true) {
        // Format raw form data to correct data types
        this.data = formatFormData(newValue, this.dataMap, this.dataRecursiveRefMap, this.arrayMap, this.formOptions.returnEmptyFields);
        this.isValid = this.validateFormData(this.data);
        this.validData = this.isValid ? this.data : null;
        const compileErrors = errors => {
            const compiledErrors = {};
            (errors || []).forEach(error => {
                if (!compiledErrors[error.dataPath]) {
                    compiledErrors[error.dataPath] = [];
                }
                compiledErrors[error.dataPath].push(error.message);
            });
            return compiledErrors;
        };
        this.ajvErrors = this.validateFormData.errors;
        this.validationErrors = compileErrors(this.validateFormData.errors);
        if (updateSubscriptions) {
            this.dataChanges.next(this.data);
            this.isValidChanges.next(this.isValid);
            this.validationErrorChanges.next(this.ajvErrors);
        }
    }
    buildFormGroupTemplate(formValues = null, setValues = true) {
        this.formGroupTemplate = buildFormGroupTemplate(this, formValues, setValues);
    }
    buildFormGroup() {
        this.formGroup = buildFormGroup(this.formGroupTemplate);
        if (this.formGroup) {
            this.compileAjvSchema();
            this.validateData(this.formGroup.value);
            // Set up observables to emit data and validation info when form data changes
            if (this.formValueSubscription) {
                this.formValueSubscription.unsubscribe();
            }
            this.formValueSubscription = this.formGroup.valueChanges
                .subscribe(formValue => this.validateData(formValue));
        }
    }
    buildLayout(widgetLibrary) {
        this.layout = buildLayout(this, widgetLibrary);
    }
    setOptions(newOptions) {
        if (isObject(newOptions)) {
            const addOptions = _.cloneDeep(newOptions);
            // Backward compatibility for 'defaultOptions' (renamed 'defautWidgetOptions')
            if (isObject(addOptions.defaultOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defaultOptions);
                delete addOptions.defaultOptions;
            }
            if (isObject(addOptions.defautWidgetOptions)) {
                Object.assign(this.formOptions.defautWidgetOptions, addOptions.defautWidgetOptions);
                delete addOptions.defautWidgetOptions;
            }
            Object.assign(this.formOptions, addOptions);
            // convert disableErrorState / disableSuccessState to enable...
            const globalDefaults = this.formOptions.defautWidgetOptions;
            ['ErrorState', 'SuccessState']
                .filter(suffix => hasOwn(globalDefaults, 'disable' + suffix))
                .forEach(suffix => {
                globalDefaults['enable' + suffix] = !globalDefaults['disable' + suffix];
                delete globalDefaults['disable' + suffix];
            });
        }
    }
    compileAjvSchema() {
        if (!this.validateFormData) {
            // if 'ui:order' exists in properties, move it to root before compiling with ajv
            if (Array.isArray(this.schema.properties['ui:order'])) {
                this.schema['ui:order'] = this.schema.properties['ui:order'];
                delete this.schema.properties['ui:order'];
            }
            this.ajv.removeSchema(this.schema);
            this.validateFormData = this.ajv.compile(this.schema);
        }
    }
    buildSchemaFromData(data, requireAllFields = false) {
        if (data) {
            return buildSchemaFromData(data, requireAllFields);
        }
        this.schema = buildSchemaFromData(this.formValues, requireAllFields);
    }
    buildSchemaFromLayout(layout) {
        if (layout) {
            return buildSchemaFromLayout(layout);
        }
        this.schema = buildSchemaFromLayout(this.layout);
    }
    setTpldata(newTpldata = {}) {
        this.tpldata = newTpldata;
    }
    parseText(text = '', value = {}, values = {}, key = null) {
        if (!text || !/{{.+?}}/.test(text)) {
            return text;
        }
        return text.replace(/{{(.+?)}}/g, (...a) => this.parseExpression(a[1], value, values, key, this.tpldata));
    }
    parseExpression(expression = '', value = {}, values = {}, key = null, tpldata = null) {
        if (typeof expression !== 'string') {
            return '';
        }
        const index = typeof key === 'number' ? (key + 1) + '' : (key || '');
        expression = expression.trim();
        if ((expression[0] === '\'' || expression[0] === '"') &&
            expression[0] === expression[expression.length - 1] &&
            expression.slice(1, expression.length - 1).indexOf(expression[0]) === -1) {
            return expression.slice(1, expression.length - 1);
        }
        if (expression === 'idx' || expression === '$index') {
            return index;
        }
        if (expression === 'value' && !hasOwn(values, 'value')) {
            return value;
        }
        if (['"', '\'', ' ', '||', '&&', '+'].every(delim => expression.indexOf(delim) === -1)) {
            const pointer = JsonPointer.parseObjectPath(expression);
            return pointer[0] === 'value' && JsonPointer.has(value, pointer.slice(1)) ?
                JsonPointer.get(value, pointer.slice(1)) :
                pointer[0] === 'values' && JsonPointer.has(values, pointer.slice(1)) ?
                    JsonPointer.get(values, pointer.slice(1)) :
                    pointer[0] === 'tpldata' && JsonPointer.has(tpldata, pointer.slice(1)) ?
                        JsonPointer.get(tpldata, pointer.slice(1)) :
                        JsonPointer.has(values, pointer) ? JsonPointer.get(values, pointer) : '';
        }
        if (expression.indexOf('[idx]') > -1) {
            expression = expression.replace(/\[idx\]/g, index);
        }
        if (expression.indexOf('[$index]') > -1) {
            expression = expression.replace(/\[$index\]/g, index);
        }
        // TODO: Improve expression evaluation by parsing quoted strings first
        // let expressionArray = expression.match(/([^"']+|"[^"]+"|'[^']+')/g);
        if (expression.indexOf('||') > -1) {
            return expression.split('||').reduce((all, term) => all || this.parseExpression(term, value, values, key, tpldata), '');
        }
        if (expression.indexOf('&&') > -1) {
            return expression.split('&&').reduce((all, term) => all && this.parseExpression(term, value, values, key, tpldata), ' ').trim();
        }
        if (expression.indexOf('+') > -1) {
            return expression.split('+')
                .map(term => this.parseExpression(term, value, values, key, tpldata))
                .join('');
        }
        return '';
    }
    setArrayItemTitle(parentCtx = {}, childNode = null, index = null) {
        const parentNode = parentCtx.layoutNode;
        const parentValues = this.getFormControlValue(parentCtx);
        const isArrayItem = (parentNode.type || '').slice(-5) === 'array' && isArray(parentValues);
        const text = JsonPointer.getFirst(isArrayItem && childNode.type !== '$ref' ? [
            [childNode, '/options/legend'],
            [childNode, '/options/title'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend'],
        ] : [
            [childNode, '/options/title'],
            [childNode, '/options/legend'],
            [parentNode, '/options/title'],
            [parentNode, '/options/legend']
        ]);
        if (!text) {
            return text;
        }
        const childValue = isArray(parentValues) && index < parentValues.length ?
            parentValues[index] : parentValues;
        return this.parseText(text, childValue, parentValues, index);
    }
    setItemTitle(ctx) {
        return !ctx.options.title && /^(\d+|-)$/.test(ctx.layoutNode.name) ?
            null :
            this.parseText(ctx.options.title || toTitleCase(ctx.layoutNode.name), this.getFormControlValue(this), (this.getFormControlGroup(this) || {}).value, ctx.dataIndex[ctx.dataIndex.length - 1]);
    }
    evaluateCondition(layoutNode, dataIndex) {
        const arrayIndex = dataIndex && dataIndex[dataIndex.length - 1];
        let result = true;
        if (hasValue((layoutNode.options || {}).condition)) {
            if (typeof layoutNode.options.condition === 'string') {
                let pointer = layoutNode.options.condition;
                if (hasValue(arrayIndex)) {
                    pointer = pointer.replace('[arrayIndex]', `[${arrayIndex}]`);
                }
                pointer = JsonPointer.parseObjectPath(pointer);
                result = !!JsonPointer.get(this.data, pointer);
                if (!result && pointer[0] === 'model') {
                    result = !!JsonPointer.get({ model: this.data }, pointer);
                }
            }
            else if (typeof layoutNode.options.condition === 'function') {
                result = layoutNode.options.condition(this.data);
            }
            else if (typeof layoutNode.options.condition.functionBody === 'string') {
                try {
                    const dynFn = new Function('model', 'arrayIndices', layoutNode.options.condition.functionBody);
                    result = dynFn(this.data, dataIndex);
                }
                catch (e) {
                    result = true;
                    console.error('condition functionBody errored out on evaluation: ' + layoutNode.options.condition.functionBody);
                }
            }
        }
        return result;
    }
    initializeControl(ctx, bind = true) {
        if (!isObject(ctx)) {
            return false;
        }
        if (isEmpty(ctx.options)) {
            ctx.options = !isEmpty((ctx.layoutNode || {}).options) ?
                ctx.layoutNode.options : _.cloneDeep(this.formOptions);
        }
        ctx.formControl = this.getFormControl(ctx);
        ctx.boundControl = bind && !!ctx.formControl;
        if (ctx.formControl) {
            ctx.controlName = this.getFormControlName(ctx);
            ctx.controlValue = ctx.formControl.value;
            ctx.controlDisabled = ctx.formControl.disabled;
            ctx.options.errorMessage = ctx.formControl.status === 'VALID' ? null :
                this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages);
            ctx.options.showErrors = this.formOptions.validateOnRender === true ||
                (this.formOptions.validateOnRender === 'auto' && hasValue(ctx.controlValue));
            ctx.formControl.statusChanges.subscribe(status => ctx.options.errorMessage = status === 'VALID' ? null :
                this.formatErrors(ctx.formControl.errors, ctx.options.validationMessages));
            ctx.formControl.valueChanges.subscribe(value => {
                if (!_.isEqual(ctx.controlValue, value)) {
                    ctx.controlValue = value;
                }
            });
        }
        else {
            ctx.controlName = ctx.layoutNode.name;
            ctx.controlValue = ctx.layoutNode.value || null;
            const dataPointer = this.getDataPointer(ctx);
            if (bind && dataPointer) {
                console.error(`warning: control "${dataPointer}" is not bound to the Angular FormGroup.`);
            }
        }
        return ctx.boundControl;
    }
    formatErrors(errors, validationMessages = {}) {
        if (isEmpty(errors)) {
            return null;
        }
        if (!isObject(validationMessages)) {
            validationMessages = {};
        }
        const addSpaces = string => string[0].toUpperCase() + (string.slice(1) || '')
            .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
        const formatError = (error) => typeof error === 'object' ?
            Object.keys(error).map(key => error[key] === true ? addSpaces(key) :
                error[key] === false ? 'Not ' + addSpaces(key) :
                    addSpaces(key) + ': ' + formatError(error[key])).join(', ') :
            addSpaces(error.toString());
        const messages = [];
        return Object.keys(errors)
            .filter(errorKey => errorKey !== 'required' || Object.keys(errors).length === 1)
            .map(errorKey => 
        // If validationMessages is a string, return it
        typeof validationMessages === 'string' ? validationMessages :
            // If custom error message is a function, return function result
            typeof validationMessages[errorKey] === 'function' ?
                validationMessages[errorKey](errors[errorKey]) :
                // If custom error message is a string, replace placeholders and return
                typeof validationMessages[errorKey] === 'string' ?
                    // Does error message have any {{property}} placeholders?
                    !/{{.+?}}/.test(validationMessages[errorKey]) ?
                        validationMessages[errorKey] :
                        // Replace {{property}} placeholders with values
                        Object.keys(errors[errorKey])
                            .reduce((errorMessage, errorProperty) => errorMessage.replace(new RegExp('{{' + errorProperty + '}}', 'g'), errors[errorKey][errorProperty]), validationMessages[errorKey]) :
                    // If no custom error message, return formatted error data instead
                    addSpaces(errorKey) + ' Error: ' + formatError(errors[errorKey])).join('<br>');
    }
    updateValue(ctx, value) {
        // Set value of current control
        ctx.controlValue = value;
        if (ctx.boundControl) {
            ctx.formControl.setValue(value);
            ctx.formControl.markAsDirty();
        }
        ctx.layoutNode.value = value;
        // Set values of any related controls in copyValueTo array
        if (isArray(ctx.options.copyValueTo)) {
            for (const item of ctx.options.copyValueTo) {
                const targetControl = getControl(this.formGroup, item);
                if (isObject(targetControl) && typeof targetControl.setValue === 'function') {
                    targetControl.setValue(value);
                    targetControl.markAsDirty();
                }
            }
        }
    }
    updateArrayCheckboxList(ctx, checkboxList) {
        const formArray = this.getFormControl(ctx);
        // Remove all existing items
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        // Re-add an item for each checked box
        const refPointer = removeRecursiveReferences(ctx.layoutNode.dataPointer + '/-', this.dataRecursiveRefMap, this.arrayMap);
        for (const checkboxItem of checkboxList) {
            if (checkboxItem.checked) {
                const newFormControl = buildFormGroup(this.templateRefLibrary[refPointer]);
                newFormControl.setValue(checkboxItem.value);
                formArray.push(newFormControl);
            }
        }
        formArray.markAsDirty();
    }
    getFormControl(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx));
    }
    getFormControlValue(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            ctx.layoutNode.type === '$ref') {
            return null;
        }
        const control = getControl(this.formGroup, this.getDataPointer(ctx));
        return control ? control.value : null;
    }
    getFormControlGroup(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer)) {
            return null;
        }
        return getControl(this.formGroup, this.getDataPointer(ctx), true);
    }
    getFormControlName(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toKey(this.getDataPointer(ctx));
    }
    getLayoutArray(ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -1);
    }
    getParentNode(ctx) {
        return JsonPointer.get(this.layout, this.getLayoutPointer(ctx), 0, -2);
    }
    getDataPointer(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return null;
        }
        return JsonPointer.toIndexedPointer(ctx.layoutNode.dataPointer, ctx.dataIndex, this.arrayMap);
    }
    getLayoutPointer(ctx) {
        if (!hasValue(ctx.layoutIndex)) {
            return null;
        }
        return '/' + ctx.layoutIndex.join('/items/');
    }
    isControlBound(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) || !hasValue(ctx.dataIndex)) {
            return false;
        }
        const controlGroup = this.getFormControlGroup(ctx);
        const name = this.getFormControlName(ctx);
        return controlGroup ? hasOwn(controlGroup.controls, name) : false;
    }
    addItem(ctx, name) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.$ref) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Create a new Angular form control from a template in templateRefLibrary
        const newFormGroup = buildFormGroup(this.templateRefLibrary[ctx.layoutNode.$ref]);
        // Add the new form control to the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Add new array item to formArray
            // const formArray = <FormArray>this.getFormControlGroup(ctx);
            // formArray.insert(0, newFormGroup);
            // formArray.updateValueAndValidity();
            // (<FormArray>this.getFormControlGroup(ctx)).controls[name].unshift(newFormGroup);
            // console.log(this.getFormControlGroup(ctx));
            // const formArray = <FormArray>this.getFormControlGroup(ctx);
            // formArray.insert(0, newFormGroup); 
            // formArray.updateValueAndValidity();      
            // (<FormArray>this.getFormControlGroup(ctx)).controls[name].unshift(newFormGroup);
            // console.log(this.getFormControlGroup(ctx));
            this.getFormControlGroup(ctx).push(newFormGroup);
        }
        else {
            // Add new $ref item to formGroup
            this.getFormControlGroup(ctx)
                .addControl(name || this.getFormControlName(ctx), newFormGroup);
        }
        // Copy a new layoutNode from layoutRefLibrary
        const newLayoutNode = getLayoutNode(ctx.layoutNode, this);
        newLayoutNode.arrayItem = ctx.layoutNode.arrayItem;
        if (ctx.layoutNode.arrayItemType) {
            newLayoutNode.arrayItemType = ctx.layoutNode.arrayItemType;
        }
        else {
            delete newLayoutNode.arrayItemType;
        }
        if (name) {
            newLayoutNode.name = name;
            newLayoutNode.dataPointer += '/' + JsonPointer.escape(name);
            newLayoutNode.options.title = fixTitle(name);
        }
        // Add the new layoutNode to the form layout
        JsonPointer.insert(this.layout, this.getLayoutPointer(ctx), newLayoutNode);
        return true;
    }
    moveArrayItem(ctx, oldIndex, newIndex) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex) ||
            !isDefined(oldIndex) || !isDefined(newIndex) || oldIndex === newIndex) {
            return false;
        }
        // Move item in the formArray
        const formArray = this.getFormControlGroup(ctx);
        const arrayItem = formArray.at(oldIndex);
        formArray.removeAt(oldIndex);
        formArray.insert(newIndex, arrayItem);
        formArray.updateValueAndValidity();
        // Move layout item
        const layoutArray = this.getLayoutArray(ctx);
        layoutArray.splice(newIndex, 0, layoutArray.splice(oldIndex, 1)[0]);
        return true;
    }
    removeItem(ctx) {
        if (!ctx.layoutNode || !isDefined(ctx.layoutNode.dataPointer) ||
            !hasValue(ctx.dataIndex) || !hasValue(ctx.layoutIndex)) {
            return false;
        }
        // Remove the Angular form control from the parent formArray or formGroup
        if (ctx.layoutNode.arrayItem) {
            // Remove array item from formArray
            this.getFormControlGroup(ctx)
                .removeAt(ctx.dataIndex[ctx.dataIndex.length - 1]);
        }
        else {
            // Remove $ref item from formGroup
            this.getFormControlGroup(ctx)
                .removeControl(this.getFormControlName(ctx));
        }
        // Remove layoutNode from layout
        JsonPointer.remove(this.layout, this.getLayoutPointer(ctx));
        return true;
    }
}
JsonSchemaFormService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
JsonSchemaFormService.ctorParameters = () => [];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9qc29uLXNjaGVtYS1mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFOUMsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDM0IsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUIsT0FBTyxFQUNMLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQ2hELE1BQU0sOEJBQThCLENBQUM7QUFDdEMsT0FBTyxFQUNMLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFDdkMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUNMLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLHlCQUF5QixFQUV0RSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFDbkUsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBV3ZFLE1BQU07SUF3Rko7cUNBdkZ3QixLQUFLO2dEQUNNLEtBQUs7OENBQ1AsS0FBSzt1QkFDdkIsRUFBRTswQkFFQyxFQUFFLFNBQVMsRUFBRSxJQUFJ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LENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2I7OztZQXRvQkYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUFycmF5LCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzLWNvbXBhdC9vcGVyYXRvcnMvZmlsdGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzLWNvbXBhdC9TdWJqZWN0JztcblxuaW1wb3J0ICogYXMgQWp2IGZyb20gJ2Fqdic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGhhc1ZhbHVlLCBpc0FycmF5LCBpc0RlZmluZWQsIGlzRW1wdHksIGlzT2JqZWN0LCBpc1N0cmluZ1xufSBmcm9tICcuL3NoYXJlZC92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7XG4gIGZpeFRpdGxlLCBmb3JFYWNoLCBoYXNPd24sIHRvVGl0bGVDYXNlXG59IGZyb20gJy4vc2hhcmVkL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7IEpzb25Qb2ludGVyIH0gZnJvbSAnLi9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcbmltcG9ydCB7XG4gIGJ1aWxkU2NoZW1hRnJvbURhdGEsIGJ1aWxkU2NoZW1hRnJvbUxheW91dCwgcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyxcbiAgcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXNcbn0gZnJvbSAnLi9zaGFyZWQvanNvbi1zY2hlbWEuZnVuY3Rpb25zJztcbmltcG9ydCB7XG4gIGJ1aWxkRm9ybUdyb3VwLCBidWlsZEZvcm1Hcm91cFRlbXBsYXRlLCBmb3JtYXRGb3JtRGF0YSwgZ2V0Q29udHJvbFxufSBmcm9tICcuL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBidWlsZExheW91dCwgZ2V0TGF5b3V0Tm9kZSB9IGZyb20gJy4vc2hhcmVkL2xheW91dC5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgZW5WYWxpZGF0aW9uTWVzc2FnZXMgfSBmcm9tICcuL2xvY2FsZS9lbi12YWxpZGF0aW9uLW1lc3NhZ2VzJztcbmltcG9ydCB7IGZyVmFsaWRhdGlvbk1lc3NhZ2VzIH0gZnJvbSAnLi9sb2NhbGUvZnItdmFsaWRhdGlvbi1tZXNzYWdlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGl0bGVNYXBJdGVtIHtcbiAgbmFtZT86IHN0cmluZzsgdmFsdWU/OiBhbnk7IGNoZWNrZWQ/OiBib29sZWFuOyBncm91cD86IHN0cmluZzsgaXRlbXM/OiBUaXRsZU1hcEl0ZW1bXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlcyB7XG4gIFtjb250cm9sX25hbWU6IHN0cmluZ106IHsgbWVzc2FnZTogc3RyaW5nfEZ1bmN0aW9ufE9iamVjdCwgY29kZTogc3RyaW5nIH1bXTtcbn1cblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIHtcbiAgSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIFJlYWN0SnNvblNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gIEFuZ3VsYXJTY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICB0cGxkYXRhOiBhbnkgPSB7fTtcblxuICBhanZPcHRpb25zOiBhbnkgPSB7IGFsbEVycm9yczogdHJ1ZSwganNvblBvaW50ZXJzOiB0cnVlLCB1bmtub3duRm9ybWF0czogJ2lnbm9yZScgfTtcbiAgYWp2OiBhbnkgPSBuZXcgQWp2KHRoaXMuYWp2T3B0aW9ucyk7IC8vIEFKVjogQW5vdGhlciBKU09OIFNjaGVtYSBWYWxpZGF0b3JcbiAgdmFsaWRhdGVGb3JtRGF0YTogYW55ID0gbnVsbDsgLy8gQ29tcGlsZWQgQUpWIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIGFjdGl2ZSBmb3JtJ3Mgc2NoZW1hXG5cbiAgZm9ybVZhbHVlczogYW55ID0ge307IC8vIEludGVybmFsIGZvcm0gZGF0YSAobWF5IG5vdCBoYXZlIGNvcnJlY3QgdHlwZXMpXG4gIGRhdGE6IGFueSA9IHt9OyAvLyBPdXRwdXQgZm9ybSBkYXRhIChmb3JtVmFsdWVzLCBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGRhdGEgdHlwZXMpXG4gIHNjaGVtYTogYW55ID0ge307IC8vIEludGVybmFsIEpTT04gU2NoZW1hXG4gIGxheW91dDogYW55W10gPSBbXTsgLy8gSW50ZXJuYWwgZm9ybSBsYXlvdXRcbiAgZm9ybUdyb3VwVGVtcGxhdGU6IGFueSA9IHt9OyAvLyBUZW1wbGF0ZSB1c2VkIHRvIGNyZWF0ZSBmb3JtR3JvdXBcbiAgZm9ybUdyb3VwOiBhbnkgPSBudWxsOyAvLyBBbmd1bGFyIGZvcm1Hcm91cCwgd2hpY2ggcG93ZXJzIHRoZSByZWFjdGl2ZSBmb3JtXG4gIGZyYW1ld29yazogYW55ID0gbnVsbDsgLy8gQWN0aXZlIGZyYW1ld29yayBjb21wb25lbnRcbiAgZm9ybU9wdGlvbnM6IGFueTsgLy8gQWN0aXZlIG9wdGlvbnMsIHVzZWQgdG8gY29uZmlndXJlIHRoZSBmb3JtXG5cbiAgdmFsaWREYXRhOiBhbnkgPSBudWxsOyAvLyBWYWxpZCBmb3JtIGRhdGEgKG9yIG51bGwpICg9PT0gaXNWYWxpZCA/IGRhdGEgOiBudWxsKVxuICBpc1ZhbGlkOiBib29sZWFuID0gbnVsbDsgLy8gSXMgY3VycmVudCBmb3JtIGRhdGEgdmFsaWQ/XG4gIGFqdkVycm9yczogYW55ID0gbnVsbDsgLy8gQWp2IGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIHZhbGlkYXRpb25FcnJvcnM6IGFueSA9IG51bGw7IC8vIEFueSB2YWxpZGF0aW9uIGVycm9ycyBmb3IgY3VycmVudCBkYXRhXG4gIGRhdGFFcnJvcnM6IGFueSA9IG5ldyBNYXAoKTsgLy9cbiAgZm9ybVZhbHVlU3Vic2NyaXB0aW9uOiBhbnkgPSBudWxsOyAvLyBTdWJzY3JpcHRpb24gdG8gZm9ybUdyb3VwLnZhbHVlQ2hhbmdlcyBvYnNlcnZhYmxlIChmb3IgdW4tIGFuZCByZS1zdWJzY3JpYmluZylcbiAgZGF0YUNoYW5nZXM6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7IC8vIEZvcm0gZGF0YSBvYnNlcnZhYmxlXG4gIGlzVmFsaWRDaGFuZ2VzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpOyAvLyBpc1ZhbGlkIG9ic2VydmFibGVcbiAgdmFsaWRhdGlvbkVycm9yQ2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTsgLy8gdmFsaWRhdGlvbkVycm9ycyBvYnNlcnZhYmxlXG5cbiAgYXJyYXlNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgYXJyYXlzIGluIGRhdGEgb2JqZWN0IGFuZCBudW1iZXIgb2YgdHVwbGUgdmFsdWVzXG4gIGRhdGFNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcGF0aHMgaW4gZm9ybSBkYXRhIHRvIHNjaGVtYSBhbmQgZm9ybUdyb3VwIHBhdGhzXG4gIGRhdGFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7IC8vIE1hcHMgcmVjdXJzaXZlIHJlZmVyZW5jZSBwb2ludHMgaW4gZm9ybSBkYXRhXG4gIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTsgLy8gTWFwcyByZWN1cnNpdmUgcmVmZXJlbmNlIHBvaW50cyBpbiBzY2hlbWFcbiAgc2NoZW1hUmVmTGlicmFyeTogYW55ID0ge307IC8vIExpYnJhcnkgb2Ygc2NoZW1hcyBmb3IgcmVzb2x2aW5nIHNjaGVtYSAkcmVmc1xuICBsYXlvdXRSZWZMaWJyYXJ5OiBhbnkgPSB7ICcnOiBudWxsIH07IC8vIExpYnJhcnkgb2YgbGF5b3V0IG5vZGVzIGZvciBhZGRpbmcgdG8gZm9ybVxuICB0ZW1wbGF0ZVJlZkxpYnJhcnk6IGFueSA9IHt9OyAvLyBMaWJyYXJ5IG9mIGZvcm1Hcm91cCB0ZW1wbGF0ZXMgZm9yIGFkZGluZyB0byBmb3JtXG4gIGhhc1Jvb3RSZWZlcmVuY2UgPSBmYWxzZTsgLy8gRG9lcyB0aGUgZm9ybSBpbmNsdWRlIGEgcmVjdXJzaXZlIHJlZmVyZW5jZSB0byBpdHNlbGY/XG5cbiAgbGFuZ3VhZ2UgPSAnZW4tVVMnOyAvLyBEb2VzIHRoZSBmb3JtIGluY2x1ZGUgYSByZWN1cnNpdmUgcmVmZXJlbmNlIHRvIGl0c2VsZj9cblxuICBkZWZhdWx0TGF5b3V0T3B0aW9uczogYW55ID0ge307XG5cbiAgLy8gRGVmYXVsdCBnbG9iYWwgZm9ybSBvcHRpb25zXG4gIGRlZmF1bHRGb3JtT3B0aW9uczogYW55ID0ge1xuICAgIGFkZFN1Ym1pdDogJ2F1dG8nLCAvLyBBZGQgYSBzdWJtaXQgYnV0dG9uIGlmIGxheW91dCBkb2VzIG5vdCBoYXZlIG9uZT9cbiAgICAgIC8vIGZvciBhZGRTdWJtaXQ6IHRydWUgPSBhbHdheXMsIGZhbHNlID0gbmV2ZXIsXG4gICAgICAvLyAnYXV0bycgPSBvbmx5IGlmIGxheW91dCBpcyB1bmRlZmluZWQgKGZvcm0gaXMgYnVpbHQgZnJvbSBzY2hlbWEgYWxvbmUpXG4gICAgZGVidWc6IGZhbHNlLCAvLyBTaG93IGRlYnVnZ2luZyBvdXRwdXQ/XG4gICAgZGlzYWJsZUludmFsaWRTdWJtaXQ6IHRydWUsIC8vIERpc2FibGUgc3VibWl0IGlmIGZvcm0gaW52YWxpZD9cbiAgICBmb3JtRGlzYWJsZWQ6IGZhbHNlLCAvLyBTZXQgZW50aXJlIGZvcm0gYXMgZGlzYWJsZWQ/IChub3QgZWRpdGFibGUsIGFuZCBkaXNhYmxlcyBvdXRwdXRzKVxuICAgIGZvcm1SZWFkb25seTogZmFsc2UsIC8vIFNldCBlbnRpcmUgZm9ybSBhcyByZWFkIG9ubHk/IChub3QgZWRpdGFibGUsIGJ1dCBvdXRwdXRzIHN0aWxsIGVuYWJsZWQpXG4gICAgZmllbGRzUmVxdWlyZWQ6IGZhbHNlLCAvLyAoc2V0IGF1dG9tYXRpY2FsbHkpIEFyZSB0aGVyZSBhbnkgcmVxdWlyZWQgZmllbGRzIGluIHRoZSBmb3JtP1xuICAgIGZyYW1ld29yazogJ25vLWZyYW1ld29yaycsIC8vIFRoZSBmcmFtZXdvcmsgdG8gbG9hZFxuICAgIGxvYWRFeHRlcm5hbEFzc2V0czogZmFsc2UsIC8vIExvYWQgZXh0ZXJuYWwgY3NzIGFuZCBKYXZhU2NyaXB0IGZvciBmcmFtZXdvcms/XG4gICAgcHJpc3RpbmU6IHsgZXJyb3JzOiB0cnVlLCBzdWNjZXNzOiB0cnVlIH0sXG4gICAgc3VwcmVzc1Byb3BlcnR5VGl0bGVzOiBmYWxzZSxcbiAgICBzZXRTY2hlbWFEZWZhdWx0czogJ2F1dG8nLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBzY2hlbWE/XG4gICAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgbGF5b3V0IGRlZmF1bHQgb3IgZm9ybVZhbHVlcylcbiAgICAgIC8vIGZhbHNlID0gbmV2ZXIgc2V0XG4gICAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICBzZXRMYXlvdXREZWZhdWx0czogJ2F1dG8nLCAvLyBTZXQgZmVmYXVsdCB2YWx1ZXMgZnJvbSBsYXlvdXQ/XG4gICAgICAvLyB0cnVlID0gYWx3YXlzIHNldCAodW5sZXNzIG92ZXJyaWRkZW4gYnkgZm9ybVZhbHVlcylcbiAgICAgIC8vIGZhbHNlID0gbmV2ZXIgc2V0XG4gICAgICAvLyAnYXV0bycgPSBzZXQgaW4gYWRkYWJsZSBjb21wb25lbnRzLCBhbmQgZXZlcnl3aGVyZSBpZiBmb3JtVmFsdWVzIG5vdCBzZXRcbiAgICB2YWxpZGF0ZU9uUmVuZGVyOiAnYXV0bycsIC8vIFZhbGlkYXRlIGZpZWxkcyBpbW1lZGlhdGVseSwgYmVmb3JlIHRoZXkgYXJlIHRvdWNoZWQ/XG4gICAgICAvLyB0cnVlID0gdmFsaWRhdGUgYWxsIGZpZWxkcyBpbW1lZGlhdGVseVxuICAgICAgLy8gZmFsc2UgPSBvbmx5IHZhbGlkYXRlIGZpZWxkcyBhZnRlciB0aGV5IGFyZSB0b3VjaGVkIGJ5IHVzZXJcbiAgICAgIC8vICdhdXRvJyA9IHZhbGlkYXRlIGZpZWxkcyB3aXRoIHZhbHVlcyBpbW1lZGlhdGVseSwgZW1wdHkgZmllbGRzIGFmdGVyIHRoZXkgYXJlIHRvdWNoZWRcbiAgICB3aWRnZXRzOiB7fSwgLy8gQW55IGN1c3RvbSB3aWRnZXRzIHRvIGxvYWRcbiAgICBkZWZhdXRXaWRnZXRPcHRpb25zOiB7IC8vIERlZmF1bHQgb3B0aW9ucyBmb3IgZm9ybSBjb250cm9sIHdpZGdldHNcbiAgICAgIGxpc3RJdGVtczogMSwgLy8gTnVtYmVyIG9mIGxpc3QgaXRlbXMgdG8gaW5pdGlhbGx5IGFkZCB0byBhcnJheXMgd2l0aCBubyBkZWZhdWx0IHZhbHVlXG4gICAgICBhZGRhYmxlOiB0cnVlLCAvLyBBbGxvdyBhZGRpbmcgaXRlbXMgdG8gYW4gYXJyYXkgb3IgJHJlZiBwb2ludD9cbiAgICAgIG9yZGVyYWJsZTogZmFsc2UsIC8vIEFsbG93IHJlb3JkZXJpbmcgaXRlbXMgd2l0aGluIGFuIGFycmF5P1xuICAgICAgcmVtb3ZhYmxlOiB0cnVlLCAvLyBBbGxvdyByZW1vdmluZyBpdGVtcyBmcm9tIGFuIGFycmF5IG9yICRyZWYgcG9pbnQ/XG4gICAgICBlbmFibGVFcnJvclN0YXRlOiB0cnVlLCAvLyBBcHBseSAnaGFzLWVycm9yJyBjbGFzcyB3aGVuIGZpZWxkIGZhaWxzIHZhbGlkYXRpb24/XG4gICAgICAvLyBkaXNhYmxlRXJyb3JTdGF0ZTogZmFsc2UsIC8vIERvbid0IGFwcGx5ICdoYXMtZXJyb3InIGNsYXNzIHdoZW4gZmllbGQgZmFpbHMgdmFsaWRhdGlvbj9cbiAgICAgIGVuYWJsZVN1Y2Nlc3NTdGF0ZTogdHJ1ZSwgLy8gQXBwbHkgJ2hhcy1zdWNjZXNzJyBjbGFzcyB3aGVuIGZpZWxkIHZhbGlkYXRlcz9cbiAgICAgIC8vIGRpc2FibGVTdWNjZXNzU3RhdGU6IGZhbHNlLCAvLyBEb24ndCBhcHBseSAnaGFzLXN1Y2Nlc3MnIGNsYXNzIHdoZW4gZmllbGQgdmFsaWRhdGVzP1xuICAgICAgZmVlZGJhY2s6IGZhbHNlLCAvLyBTaG93IGlubGluZSBmZWVkYmFjayBpY29ucz9cbiAgICAgIGZlZWRiYWNrT25SZW5kZXI6IGZhbHNlLCAvLyBTaG93IGVycm9yTWVzc2FnZSBvbiBSZW5kZXI/XG4gICAgICBub3RpdGxlOiBmYWxzZSwgLy8gSGlkZSB0aXRsZT9cbiAgICAgIGRpc2FibGVkOiBmYWxzZSwgLy8gU2V0IGNvbnRyb2wgYXMgZGlzYWJsZWQ/IChub3QgZWRpdGFibGUsIGFuZCBleGNsdWRlZCBmcm9tIG91dHB1dClcbiAgICAgIHJlYWRvbmx5OiBmYWxzZSwgLy8gU2V0IGNvbnRyb2wgYXMgcmVhZCBvbmx5PyAobm90IGVkaXRhYmxlLCBidXQgaW5jbHVkZWQgaW4gb3V0cHV0KVxuICAgICAgcmV0dXJuRW1wdHlGaWVsZHM6IHRydWUsIC8vIHJldHVybiB2YWx1ZXMgZm9yIGZpZWxkcyB0aGF0IGNvbnRhaW4gbm8gZGF0YT9cbiAgICAgIHZhbGlkYXRpb25NZXNzYWdlczoge30gLy8gc2V0IGJ5IHNldExhbmd1YWdlKClcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2V0TGFuZ3VhZ2UodGhpcy5sYW5ndWFnZSk7XG4gIH1cblxuICBzZXRMYW5ndWFnZShsYW5ndWFnZTogc3RyaW5nID0gJ2VuLVVTJykge1xuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICBjb25zdCB2YWxpZGF0aW9uTWVzc2FnZXMgPSBsYW5ndWFnZS5zbGljZSgwLCAyKSA9PT0gJ2ZyJyA/XG4gICAgICBmclZhbGlkYXRpb25NZXNzYWdlcyA6IGVuVmFsaWRhdGlvbk1lc3NhZ2VzO1xuICAgIHRoaXMuZGVmYXVsdEZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzID1cbiAgICAgIF8uY2xvbmVEZWVwKHZhbGlkYXRpb25NZXNzYWdlcyk7XG4gIH1cblxuICBnZXREYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhOyB9XG5cbiAgZ2V0U2NoZW1hKCkgeyByZXR1cm4gdGhpcy5zY2hlbWE7IH1cblxuICBnZXRMYXlvdXQoKSB7IHJldHVybiB0aGlzLmxheW91dDsgfVxuXG4gIHJlc2V0QWxsVmFsdWVzKCkge1xuICAgIHRoaXMuSnNvbkZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gICAgdGhpcy5SZWFjdEpzb25TY2hlbWFGb3JtQ29tcGF0aWJpbGl0eSA9IGZhbHNlO1xuICAgIHRoaXMuQW5ndWxhclNjaGVtYUZvcm1Db21wYXRpYmlsaXR5ID0gZmFsc2U7XG4gICAgdGhpcy50cGxkYXRhID0ge307XG4gICAgdGhpcy52YWxpZGF0ZUZvcm1EYXRhID0gbnVsbDtcbiAgICB0aGlzLmZvcm1WYWx1ZXMgPSB7fTtcbiAgICB0aGlzLnNjaGVtYSA9IHt9O1xuICAgIHRoaXMubGF5b3V0ID0gW107XG4gICAgdGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSA9IHt9O1xuICAgIHRoaXMuZm9ybUdyb3VwID0gbnVsbDtcbiAgICB0aGlzLmZyYW1ld29yayA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0ge307XG4gICAgdGhpcy52YWxpZERhdGEgPSBudWxsO1xuICAgIHRoaXMuaXNWYWxpZCA9IG51bGw7XG4gICAgdGhpcy52YWxpZGF0aW9uRXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLmFycmF5TWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGF0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmRhdGFSZWN1cnNpdmVSZWZNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5zY2hlbWFSZWN1cnNpdmVSZWZNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5sYXlvdXRSZWZMaWJyYXJ5ID0ge307XG4gICAgdGhpcy5zY2hlbWFSZWZMaWJyYXJ5ID0ge307XG4gICAgdGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnkgPSB7fTtcbiAgICB0aGlzLmZvcm1PcHRpb25zID0gXy5jbG9uZURlZXAodGhpcy5kZWZhdWx0Rm9ybU9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqICdidWlsZFJlbW90ZUVycm9yJyBmdW5jdGlvblxuICAgKlxuICAgKiBFeGFtcGxlIGVycm9yczpcbiAgICoge1xuICAgKiAgIGxhc3RfbmFtZTogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnTGFzdCBuYW1lIG11c3QgYnkgc3RhcnQgd2l0aCBjYXBpdGFsIGxldHRlci4nLFxuICAgKiAgICAgY29kZTogJ2NhcGl0YWxfbGV0dGVyJ1xuICAgKiAgIH0gXSxcbiAgICogICBlbWFpbDogWyB7XG4gICAqICAgICBtZXNzYWdlOiAnRW1haWwgbXVzdCBiZSBmcm9tIGV4YW1wbGUuY29tIGRvbWFpbi4nLFxuICAgKiAgICAgY29kZTogJ3NwZWNpYWxfZG9tYWluJ1xuICAgKiAgIH0sIHtcbiAgICogICAgIG1lc3NhZ2U6ICdFbWFpbCBtdXN0IGNvbnRhaW4gYW4gQCBzeW1ib2wuJyxcbiAgICogICAgIGNvZGU6ICdhdF9zeW1ib2wnXG4gICAqICAgfSBdXG4gICAqIH1cbiAgICogQHBhcmFtIHtFcnJvck1lc3NhZ2VzfSBlcnJvcnNcbiAgICovXG4gIGJ1aWxkUmVtb3RlRXJyb3IoZXJyb3JzOiBFcnJvck1lc3NhZ2VzKSB7XG4gICAgZm9yRWFjaChlcnJvcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBpZiAoa2V5IGluIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSB7fTtcbiAgICAgICAgICBlcnJbZXJyb3JbJ2NvZGUnXV0gPSBlcnJvclsnbWVzc2FnZSddO1xuICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmdldChrZXkpLnNldEVycm9ycyhlcnIsIHsgZW1pdEV2ZW50OiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0ZURhdGEobmV3VmFsdWU6IGFueSwgdXBkYXRlU3Vic2NyaXB0aW9ucyA9IHRydWUpOiB2b2lkIHtcblxuICAgIC8vIEZvcm1hdCByYXcgZm9ybSBkYXRhIHRvIGNvcnJlY3QgZGF0YSB0eXBlc1xuICAgIHRoaXMuZGF0YSA9IGZvcm1hdEZvcm1EYXRhKFxuICAgICAgbmV3VmFsdWUsIHRoaXMuZGF0YU1hcCwgdGhpcy5kYXRhUmVjdXJzaXZlUmVmTWFwLFxuICAgICAgdGhpcy5hcnJheU1hcCwgdGhpcy5mb3JtT3B0aW9ucy5yZXR1cm5FbXB0eUZpZWxkc1xuICAgICk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm1EYXRhKHRoaXMuZGF0YSk7XG4gICAgdGhpcy52YWxpZERhdGEgPSB0aGlzLmlzVmFsaWQgPyB0aGlzLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGNvbXBpbGVFcnJvcnMgPSBlcnJvcnMgPT4ge1xuICAgICAgY29uc3QgY29tcGlsZWRFcnJvcnMgPSB7fTtcbiAgICAgIChlcnJvcnMgfHwgW10pLmZvckVhY2goZXJyb3IgPT4ge1xuICAgICAgICBpZiAoIWNvbXBpbGVkRXJyb3JzW2Vycm9yLmRhdGFQYXRoXSkgeyBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0gPSBbXTsgfVxuICAgICAgICBjb21waWxlZEVycm9yc1tlcnJvci5kYXRhUGF0aF0ucHVzaChlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbXBpbGVkRXJyb3JzO1xuICAgIH07XG4gICAgdGhpcy5hanZFcnJvcnMgPSB0aGlzLnZhbGlkYXRlRm9ybURhdGEuZXJyb3JzO1xuICAgIHRoaXMudmFsaWRhdGlvbkVycm9ycyA9IGNvbXBpbGVFcnJvcnModGhpcy52YWxpZGF0ZUZvcm1EYXRhLmVycm9ycyk7XG4gICAgaWYgKHVwZGF0ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGF0YUNoYW5nZXMubmV4dCh0aGlzLmRhdGEpO1xuICAgICAgdGhpcy5pc1ZhbGlkQ2hhbmdlcy5uZXh0KHRoaXMuaXNWYWxpZCk7XG4gICAgICB0aGlzLnZhbGlkYXRpb25FcnJvckNoYW5nZXMubmV4dCh0aGlzLmFqdkVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShmb3JtVmFsdWVzOiBhbnkgPSBudWxsLCBzZXRWYWx1ZXMgPSB0cnVlKSB7XG4gICAgdGhpcy5mb3JtR3JvdXBUZW1wbGF0ZSA9IGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGUodGhpcywgZm9ybVZhbHVlcywgc2V0VmFsdWVzKTtcbiAgfVxuXG4gIGJ1aWxkRm9ybUdyb3VwKCkge1xuICAgIHRoaXMuZm9ybUdyb3VwID0gPEZvcm1Hcm91cD5idWlsZEZvcm1Hcm91cCh0aGlzLmZvcm1Hcm91cFRlbXBsYXRlKTtcbiAgICBpZiAodGhpcy5mb3JtR3JvdXApIHtcbiAgICAgIHRoaXMuY29tcGlsZUFqdlNjaGVtYSgpO1xuICAgICAgdGhpcy52YWxpZGF0ZURhdGEodGhpcy5mb3JtR3JvdXAudmFsdWUpO1xuXG4gICAgICAvLyBTZXQgdXAgb2JzZXJ2YWJsZXMgdG8gZW1pdCBkYXRhIGFuZCB2YWxpZGF0aW9uIGluZm8gd2hlbiBmb3JtIGRhdGEgY2hhbmdlc1xuICAgICAgaWYgKHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uKSB7IHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7IH1cbiAgICAgIHRoaXMuZm9ybVZhbHVlU3Vic2NyaXB0aW9uID0gdGhpcy5mb3JtR3JvdXAudmFsdWVDaGFuZ2VzXG4gICAgICAgIC5zdWJzY3JpYmUoZm9ybVZhbHVlID0+IHRoaXMudmFsaWRhdGVEYXRhKGZvcm1WYWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkTGF5b3V0KHdpZGdldExpYnJhcnk6IGFueSkge1xuICAgIHRoaXMubGF5b3V0ID0gYnVpbGRMYXlvdXQodGhpcywgd2lkZ2V0TGlicmFyeSk7XG4gIH1cblxuICBzZXRPcHRpb25zKG5ld09wdGlvbnM6IGFueSkge1xuICAgIGlmIChpc09iamVjdChuZXdPcHRpb25zKSkge1xuICAgICAgY29uc3QgYWRkT3B0aW9ucyA9IF8uY2xvbmVEZWVwKG5ld09wdGlvbnMpO1xuICAgICAgLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3IgJ2RlZmF1bHRPcHRpb25zJyAocmVuYW1lZCAnZGVmYXV0V2lkZ2V0T3B0aW9ucycpXG4gICAgICBpZiAoaXNPYmplY3QoYWRkT3B0aW9ucy5kZWZhdWx0T3B0aW9ucykpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMsIGFkZE9wdGlvbnMuZGVmYXVsdE9wdGlvbnMpO1xuICAgICAgICBkZWxldGUgYWRkT3B0aW9ucy5kZWZhdWx0T3B0aW9ucztcbiAgICAgIH1cbiAgICAgIGlmIChpc09iamVjdChhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMpKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5mb3JtT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zLCBhZGRPcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMpO1xuICAgICAgICBkZWxldGUgYWRkT3B0aW9ucy5kZWZhdXRXaWRnZXRPcHRpb25zO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmZvcm1PcHRpb25zLCBhZGRPcHRpb25zKTtcblxuICAgICAgLy8gY29udmVydCBkaXNhYmxlRXJyb3JTdGF0ZSAvIGRpc2FibGVTdWNjZXNzU3RhdGUgdG8gZW5hYmxlLi4uXG4gICAgICBjb25zdCBnbG9iYWxEZWZhdWx0cyA9IHRoaXMuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucztcbiAgICAgIFsnRXJyb3JTdGF0ZScsICdTdWNjZXNzU3RhdGUnXVxuICAgICAgICAuZmlsdGVyKHN1ZmZpeCA9PiBoYXNPd24oZ2xvYmFsRGVmYXVsdHMsICdkaXNhYmxlJyArIHN1ZmZpeCkpXG4gICAgICAgIC5mb3JFYWNoKHN1ZmZpeCA9PiB7XG4gICAgICAgICAgZ2xvYmFsRGVmYXVsdHNbJ2VuYWJsZScgKyBzdWZmaXhdID0gIWdsb2JhbERlZmF1bHRzWydkaXNhYmxlJyArIHN1ZmZpeF07XG4gICAgICAgICAgZGVsZXRlIGdsb2JhbERlZmF1bHRzWydkaXNhYmxlJyArIHN1ZmZpeF07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVBanZTY2hlbWEoKSB7XG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybURhdGEpIHtcblxuICAgICAgLy8gaWYgJ3VpOm9yZGVyJyBleGlzdHMgaW4gcHJvcGVydGllcywgbW92ZSBpdCB0byByb290IGJlZm9yZSBjb21waWxpbmcgd2l0aCBhanZcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc2NoZW1hLnByb3BlcnRpZXNbJ3VpOm9yZGVyJ10pKSB7XG4gICAgICAgIHRoaXMuc2NoZW1hWyd1aTpvcmRlciddID0gdGhpcy5zY2hlbWEucHJvcGVydGllc1sndWk6b3JkZXInXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuc2NoZW1hLnByb3BlcnRpZXNbJ3VpOm9yZGVyJ107XG4gICAgICB9XG4gICAgICB0aGlzLmFqdi5yZW1vdmVTY2hlbWEodGhpcy5zY2hlbWEpO1xuICAgICAgdGhpcy52YWxpZGF0ZUZvcm1EYXRhID0gdGhpcy5hanYuY29tcGlsZSh0aGlzLnNjaGVtYSk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRTY2hlbWFGcm9tRGF0YShkYXRhPzogYW55LCByZXF1aXJlQWxsRmllbGRzID0gZmFsc2UpOiBhbnkge1xuICAgIGlmIChkYXRhKSB7IHJldHVybiBidWlsZFNjaGVtYUZyb21EYXRhKGRhdGEsIHJlcXVpcmVBbGxGaWVsZHMpOyB9XG4gICAgdGhpcy5zY2hlbWEgPSBidWlsZFNjaGVtYUZyb21EYXRhKHRoaXMuZm9ybVZhbHVlcywgcmVxdWlyZUFsbEZpZWxkcyk7XG4gIH1cblxuICBidWlsZFNjaGVtYUZyb21MYXlvdXQobGF5b3V0PzogYW55KTogYW55IHtcbiAgICBpZiAobGF5b3V0KSB7IHJldHVybiBidWlsZFNjaGVtYUZyb21MYXlvdXQobGF5b3V0KTsgfVxuICAgIHRoaXMuc2NoZW1hID0gYnVpbGRTY2hlbWFGcm9tTGF5b3V0KHRoaXMubGF5b3V0KTtcbiAgfVxuXG5cbiAgc2V0VHBsZGF0YShuZXdUcGxkYXRhOiBhbnkgPSB7fSk6IHZvaWQge1xuICAgIHRoaXMudHBsZGF0YSA9IG5ld1RwbGRhdGE7XG4gIH1cblxuICBwYXJzZVRleHQoXG4gICAgdGV4dCA9ICcnLCB2YWx1ZTogYW55ID0ge30sIHZhbHVlczogYW55ID0ge30sIGtleTogbnVtYmVyfHN0cmluZyA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQgfHwgIS97ey4rP319Ly50ZXN0KHRleHQpKSB7IHJldHVybiB0ZXh0OyB9XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgve3soLis/KX19L2csICguLi5hKSA9PlxuICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb24oYVsxXSwgdmFsdWUsIHZhbHVlcywga2V5LCB0aGlzLnRwbGRhdGEpXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlRXhwcmVzc2lvbihcbiAgICBleHByZXNzaW9uID0gJycsIHZhbHVlOiBhbnkgPSB7fSwgdmFsdWVzOiBhbnkgPSB7fSxcbiAgICBrZXk6IG51bWJlcnxzdHJpbmcgPSBudWxsLCB0cGxkYXRhOiBhbnkgPSBudWxsXG4gICkge1xuICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiAhPT0gJ3N0cmluZycpIHsgcmV0dXJuICcnOyB9XG4gICAgY29uc3QgaW5kZXggPSB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJyA/IChrZXkgKyAxKSArICcnIDogKGtleSB8fCAnJyk7XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIGlmICgoZXhwcmVzc2lvblswXSA9PT0gJ1xcJycgfHwgZXhwcmVzc2lvblswXSA9PT0gJ1wiJykgJiZcbiAgICAgIGV4cHJlc3Npb25bMF0gPT09IGV4cHJlc3Npb25bZXhwcmVzc2lvbi5sZW5ndGggLSAxXSAmJlxuICAgICAgZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpLmluZGV4T2YoZXhwcmVzc2lvblswXSkgPT09IC0xXG4gICAgKSB7XG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5zbGljZSgxLCBleHByZXNzaW9uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJ2lkeCcgfHwgZXhwcmVzc2lvbiA9PT0gJyRpbmRleCcpIHsgcmV0dXJuIGluZGV4OyB9XG4gICAgaWYgKGV4cHJlc3Npb24gPT09ICd2YWx1ZScgJiYgIWhhc093bih2YWx1ZXMsICd2YWx1ZScpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIGlmIChbJ1wiJywgJ1xcJycsICcgJywgJ3x8JywgJyYmJywgJysnXS5ldmVyeShkZWxpbSA9PiBleHByZXNzaW9uLmluZGV4T2YoZGVsaW0pID09PSAtMSkpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZU9iamVjdFBhdGgoZXhwcmVzc2lvbik7XG4gICAgICByZXR1cm4gcG9pbnRlclswXSA9PT0gJ3ZhbHVlJyAmJiBKc29uUG9pbnRlci5oYXModmFsdWUsIHBvaW50ZXIuc2xpY2UoMSkpID9cbiAgICAgICAgICBKc29uUG9pbnRlci5nZXQodmFsdWUsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgcG9pbnRlclswXSA9PT0gJ3ZhbHVlcycgJiYgSnNvblBvaW50ZXIuaGFzKHZhbHVlcywgcG9pbnRlci5zbGljZSgxKSkgP1xuICAgICAgICAgIEpzb25Qb2ludGVyLmdldCh2YWx1ZXMsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgcG9pbnRlclswXSA9PT0gJ3RwbGRhdGEnICYmIEpzb25Qb2ludGVyLmhhcyh0cGxkYXRhLCBwb2ludGVyLnNsaWNlKDEpKSA/XG4gICAgICAgICAgSnNvblBvaW50ZXIuZ2V0KHRwbGRhdGEsIHBvaW50ZXIuc2xpY2UoMSkpIDpcbiAgICAgICAgSnNvblBvaW50ZXIuaGFzKHZhbHVlcywgcG9pbnRlcikgPyBKc29uUG9pbnRlci5nZXQodmFsdWVzLCBwb2ludGVyKSA6ICcnO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCdbaWR4XScpID4gLTEpIHtcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcW2lkeFxcXS9nLCA8c3RyaW5nPmluZGV4KTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZignWyRpbmRleF0nKSA+IC0xKSB7XG4gICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKC9cXFskaW5kZXhcXF0vZywgPHN0cmluZz5pbmRleCk7XG4gICAgfVxuICAgIC8vIFRPRE86IEltcHJvdmUgZXhwcmVzc2lvbiBldmFsdWF0aW9uIGJ5IHBhcnNpbmcgcXVvdGVkIHN0cmluZ3MgZmlyc3RcbiAgICAvLyBsZXQgZXhwcmVzc2lvbkFycmF5ID0gZXhwcmVzc2lvbi5tYXRjaCgvKFteXCInXSt8XCJbXlwiXStcInwnW14nXSsnKS9nKTtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCd8fCcpID4gLTEpIHtcbiAgICAgIHJldHVybiBleHByZXNzaW9uLnNwbGl0KCd8fCcpLnJlZHVjZSgoYWxsLCB0ZXJtKSA9PlxuICAgICAgICBhbGwgfHwgdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSwgJydcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoJyYmJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGV4cHJlc3Npb24uc3BsaXQoJyYmJykucmVkdWNlKChhbGwsIHRlcm0pID0+XG4gICAgICAgIGFsbCAmJiB0aGlzLnBhcnNlRXhwcmVzc2lvbih0ZXJtLCB2YWx1ZSwgdmFsdWVzLCBrZXksIHRwbGRhdGEpLCAnICdcbiAgICAgICkudHJpbSgpO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGV4cHJlc3Npb24uc3BsaXQoJysnKVxuICAgICAgICAubWFwKHRlcm0gPT4gdGhpcy5wYXJzZUV4cHJlc3Npb24odGVybSwgdmFsdWUsIHZhbHVlcywga2V5LCB0cGxkYXRhKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBzZXRBcnJheUl0ZW1UaXRsZShcbiAgICBwYXJlbnRDdHg6IGFueSA9IHt9LCBjaGlsZE5vZGU6IGFueSA9IG51bGwsIGluZGV4OiBudW1iZXIgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHBhcmVudEN0eC5sYXlvdXROb2RlO1xuICAgIGNvbnN0IHBhcmVudFZhbHVlczogYW55ID0gdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHBhcmVudEN0eCk7XG4gICAgY29uc3QgaXNBcnJheUl0ZW0gPVxuICAgICAgKHBhcmVudE5vZGUudHlwZSB8fCAnJykuc2xpY2UoLTUpID09PSAnYXJyYXknICYmIGlzQXJyYXkocGFyZW50VmFsdWVzKTtcbiAgICBjb25zdCB0ZXh0ID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3QoXG4gICAgICBpc0FycmF5SXRlbSAmJiBjaGlsZE5vZGUudHlwZSAhPT0gJyRyZWYnID8gW1xuICAgICAgICBbY2hpbGROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ10sXG4gICAgICAgIFtjaGlsZE5vZGUsICcvb3B0aW9ucy90aXRsZSddLFxuICAgICAgICBbcGFyZW50Tm9kZSwgJy9vcHRpb25zL3RpdGxlJ10sXG4gICAgICAgIFtwYXJlbnROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ10sXG4gICAgICBdIDogW1xuICAgICAgICBbY2hpbGROb2RlLCAnL29wdGlvbnMvdGl0bGUnXSxcbiAgICAgICAgW2NoaWxkTm9kZSwgJy9vcHRpb25zL2xlZ2VuZCddLFxuICAgICAgICBbcGFyZW50Tm9kZSwgJy9vcHRpb25zL3RpdGxlJ10sXG4gICAgICAgIFtwYXJlbnROb2RlLCAnL29wdGlvbnMvbGVnZW5kJ11cbiAgICAgIF1cbiAgICApO1xuICAgIGlmICghdGV4dCkgeyByZXR1cm4gdGV4dDsgfVxuICAgIGNvbnN0IGNoaWxkVmFsdWUgPSBpc0FycmF5KHBhcmVudFZhbHVlcykgJiYgaW5kZXggPCBwYXJlbnRWYWx1ZXMubGVuZ3RoID9cbiAgICAgIHBhcmVudFZhbHVlc1tpbmRleF0gOiBwYXJlbnRWYWx1ZXM7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VUZXh0KHRleHQsIGNoaWxkVmFsdWUsIHBhcmVudFZhbHVlcywgaW5kZXgpO1xuICB9XG5cbiAgc2V0SXRlbVRpdGxlKGN0eDogYW55KSB7XG4gICAgcmV0dXJuICFjdHgub3B0aW9ucy50aXRsZSAmJiAvXihcXGQrfC0pJC8udGVzdChjdHgubGF5b3V0Tm9kZS5uYW1lKSA/XG4gICAgICBudWxsIDpcbiAgICAgIHRoaXMucGFyc2VUZXh0KFxuICAgICAgICBjdHgub3B0aW9ucy50aXRsZSB8fCB0b1RpdGxlQ2FzZShjdHgubGF5b3V0Tm9kZS5uYW1lKSxcbiAgICAgICAgdGhpcy5nZXRGb3JtQ29udHJvbFZhbHVlKHRoaXMpLFxuICAgICAgICAodGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKHRoaXMpIHx8IDxhbnk+e30pLnZhbHVlLFxuICAgICAgICBjdHguZGF0YUluZGV4W2N0eC5kYXRhSW5kZXgubGVuZ3RoIC0gMV1cbiAgICAgICk7XG4gIH1cblxuICBldmFsdWF0ZUNvbmRpdGlvbihsYXlvdXROb2RlOiBhbnksIGRhdGFJbmRleDogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhcnJheUluZGV4ID0gZGF0YUluZGV4ICYmIGRhdGFJbmRleFtkYXRhSW5kZXgubGVuZ3RoIC0gMV07XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKGhhc1ZhbHVlKChsYXlvdXROb2RlLm9wdGlvbnMgfHwge30pLmNvbmRpdGlvbikpIHtcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbGV0IHBvaW50ZXIgPSBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uO1xuICAgICAgICBpZiAoaGFzVmFsdWUoYXJyYXlJbmRleCkpIHtcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlci5yZXBsYWNlKCdbYXJyYXlJbmRleF0nLCBgWyR7YXJyYXlJbmRleH1dYCk7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlT2JqZWN0UGF0aChwb2ludGVyKTtcbiAgICAgICAgcmVzdWx0ID0gISFKc29uUG9pbnRlci5nZXQodGhpcy5kYXRhLCBwb2ludGVyKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgcG9pbnRlclswXSA9PT0gJ21vZGVsJykge1xuICAgICAgICAgIHJlc3VsdCA9ICEhSnNvblBvaW50ZXIuZ2V0KHsgbW9kZWw6IHRoaXMuZGF0YSB9LCBwb2ludGVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGF5b3V0Tm9kZS5vcHRpb25zLmNvbmRpdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHQgPSBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uKHRoaXMuZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uLmZ1bmN0aW9uQm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBkeW5GbiA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgICAgICdtb2RlbCcsICdhcnJheUluZGljZXMnLCBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uLmZ1bmN0aW9uQm9keVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVzdWx0ID0gZHluRm4odGhpcy5kYXRhLCBkYXRhSW5kZXgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdjb25kaXRpb24gZnVuY3Rpb25Cb2R5IGVycm9yZWQgb3V0IG9uIGV2YWx1YXRpb246ICcgKyBsYXlvdXROb2RlLm9wdGlvbnMuY29uZGl0aW9uLmZ1bmN0aW9uQm9keSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGluaXRpYWxpemVDb250cm9sKGN0eDogYW55LCBiaW5kID0gdHJ1ZSk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNPYmplY3QoY3R4KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBpZiAoaXNFbXB0eShjdHgub3B0aW9ucykpIHtcbiAgICAgIGN0eC5vcHRpb25zID0gIWlzRW1wdHkoKGN0eC5sYXlvdXROb2RlIHx8IHt9KS5vcHRpb25zKSA/XG4gICAgICAgIGN0eC5sYXlvdXROb2RlLm9wdGlvbnMgOiBfLmNsb25lRGVlcCh0aGlzLmZvcm1PcHRpb25zKTtcbiAgICB9XG4gICAgY3R4LmZvcm1Db250cm9sID0gdGhpcy5nZXRGb3JtQ29udHJvbChjdHgpO1xuICAgIGN0eC5ib3VuZENvbnRyb2wgPSBiaW5kICYmICEhY3R4LmZvcm1Db250cm9sO1xuICAgIGlmIChjdHguZm9ybUNvbnRyb2wpIHtcbiAgICAgIGN0eC5jb250cm9sTmFtZSA9IHRoaXMuZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eCk7XG4gICAgICBjdHguY29udHJvbFZhbHVlID0gY3R4LmZvcm1Db250cm9sLnZhbHVlO1xuICAgICAgY3R4LmNvbnRyb2xEaXNhYmxlZCA9IGN0eC5mb3JtQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgIGN0eC5vcHRpb25zLmVycm9yTWVzc2FnZSA9IGN0eC5mb3JtQ29udHJvbC5zdGF0dXMgPT09ICdWQUxJRCcgPyBudWxsIDpcbiAgICAgICAgdGhpcy5mb3JtYXRFcnJvcnMoY3R4LmZvcm1Db250cm9sLmVycm9ycywgY3R4Lm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzKTtcbiAgICAgIGN0eC5vcHRpb25zLnNob3dFcnJvcnMgPSB0aGlzLmZvcm1PcHRpb25zLnZhbGlkYXRlT25SZW5kZXIgPT09IHRydWUgfHxcbiAgICAgICAgKHRoaXMuZm9ybU9wdGlvbnMudmFsaWRhdGVPblJlbmRlciA9PT0gJ2F1dG8nICYmIGhhc1ZhbHVlKGN0eC5jb250cm9sVmFsdWUpKTtcbiAgICAgIGN0eC5mb3JtQ29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShzdGF0dXMgPT5cbiAgICAgICAgY3R4Lm9wdGlvbnMuZXJyb3JNZXNzYWdlID0gc3RhdHVzID09PSAnVkFMSUQnID8gbnVsbCA6XG4gICAgICAgICAgdGhpcy5mb3JtYXRFcnJvcnMoY3R4LmZvcm1Db250cm9sLmVycm9ycywgY3R4Lm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzKVxuICAgICAgKTtcbiAgICAgIGN0eC5mb3JtQ29udHJvbC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCFfLmlzRXF1YWwoY3R4LmNvbnRyb2xWYWx1ZSwgdmFsdWUpKSB7IGN0eC5jb250cm9sVmFsdWUgPSB2YWx1ZTsgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5jb250cm9sTmFtZSA9IGN0eC5sYXlvdXROb2RlLm5hbWU7XG4gICAgICBjdHguY29udHJvbFZhbHVlID0gY3R4LmxheW91dE5vZGUudmFsdWUgfHwgbnVsbDtcbiAgICAgIGNvbnN0IGRhdGFQb2ludGVyID0gdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpO1xuICAgICAgaWYgKGJpbmQgJiYgZGF0YVBvaW50ZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgd2FybmluZzogY29udHJvbCBcIiR7ZGF0YVBvaW50ZXJ9XCIgaXMgbm90IGJvdW5kIHRvIHRoZSBBbmd1bGFyIEZvcm1Hcm91cC5gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN0eC5ib3VuZENvbnRyb2w7XG4gIH1cblxuICBmb3JtYXRFcnJvcnMoZXJyb3JzOiBhbnksIHZhbGlkYXRpb25NZXNzYWdlczogYW55ID0ge30pOiBzdHJpbmcge1xuICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAoIWlzT2JqZWN0KHZhbGlkYXRpb25NZXNzYWdlcykpIHsgdmFsaWRhdGlvbk1lc3NhZ2VzID0ge307IH1cbiAgICBjb25zdCBhZGRTcGFjZXMgPSBzdHJpbmcgPT4gc3RyaW5nWzBdLnRvVXBwZXJDYXNlKCkgKyAoc3RyaW5nLnNsaWNlKDEpIHx8ICcnKVxuICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgICBjb25zdCBmb3JtYXRFcnJvciA9IChlcnJvcikgPT4gdHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyA/XG4gICAgICBPYmplY3Qua2V5cyhlcnJvcikubWFwKGtleSA9PlxuICAgICAgICBlcnJvcltrZXldID09PSB0cnVlID8gYWRkU3BhY2VzKGtleSkgOlxuICAgICAgICBlcnJvcltrZXldID09PSBmYWxzZSA/ICdOb3QgJyArIGFkZFNwYWNlcyhrZXkpIDpcbiAgICAgICAgYWRkU3BhY2VzKGtleSkgKyAnOiAnICsgZm9ybWF0RXJyb3IoZXJyb3Jba2V5XSlcbiAgICAgICkuam9pbignLCAnKSA6XG4gICAgICBhZGRTcGFjZXMoZXJyb3IudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZXJyb3JzKVxuICAgICAgLy8gSGlkZSAncmVxdWlyZWQnIGVycm9yLCB1bmxlc3MgaXQgaXMgdGhlIG9ubHkgb25lXG4gICAgICAuZmlsdGVyKGVycm9yS2V5ID0+IGVycm9yS2V5ICE9PSAncmVxdWlyZWQnIHx8IE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID09PSAxKVxuICAgICAgLm1hcChlcnJvcktleSA9PlxuICAgICAgICAvLyBJZiB2YWxpZGF0aW9uTWVzc2FnZXMgaXMgYSBzdHJpbmcsIHJldHVybiBpdFxuICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzID09PSAnc3RyaW5nJyA/IHZhbGlkYXRpb25NZXNzYWdlcyA6XG4gICAgICAgIC8vIElmIGN1c3RvbSBlcnJvciBtZXNzYWdlIGlzIGEgZnVuY3Rpb24sIHJldHVybiBmdW5jdGlvbiByZXN1bHRcbiAgICAgICAgdHlwZW9mIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0gPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0oZXJyb3JzW2Vycm9yS2V5XSkgOlxuICAgICAgICAvLyBJZiBjdXN0b20gZXJyb3IgbWVzc2FnZSBpcyBhIHN0cmluZywgcmVwbGFjZSBwbGFjZWhvbGRlcnMgYW5kIHJldHVyblxuICAgICAgICB0eXBlb2YgdmFsaWRhdGlvbk1lc3NhZ2VzW2Vycm9yS2V5XSA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgIC8vIERvZXMgZXJyb3IgbWVzc2FnZSBoYXZlIGFueSB7e3Byb3BlcnR5fX0gcGxhY2Vob2xkZXJzP1xuICAgICAgICAgICEve3suKz99fS8udGVzdCh2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldKSA/XG4gICAgICAgICAgICB2YWxpZGF0aW9uTWVzc2FnZXNbZXJyb3JLZXldIDpcbiAgICAgICAgICAgIC8vIFJlcGxhY2Uge3twcm9wZXJ0eX19IHBsYWNlaG9sZGVycyB3aXRoIHZhbHVlc1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoZXJyb3JzW2Vycm9yS2V5XSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoZXJyb3JNZXNzYWdlLCBlcnJvclByb3BlcnR5KSA9PiBlcnJvck1lc3NhZ2UucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCd7eycgKyBlcnJvclByb3BlcnR5ICsgJ319JywgJ2cnKSxcbiAgICAgICAgICAgICAgICBlcnJvcnNbZXJyb3JLZXldW2Vycm9yUHJvcGVydHldXG4gICAgICAgICAgICAgICksIHZhbGlkYXRpb25NZXNzYWdlc1tlcnJvcktleV0pIDpcbiAgICAgICAgICAvLyBJZiBubyBjdXN0b20gZXJyb3IgbWVzc2FnZSwgcmV0dXJuIGZvcm1hdHRlZCBlcnJvciBkYXRhIGluc3RlYWRcbiAgICAgICAgICBhZGRTcGFjZXMoZXJyb3JLZXkpICsgJyBFcnJvcjogJyArIGZvcm1hdEVycm9yKGVycm9yc1tlcnJvcktleV0pXG4gICAgICApLmpvaW4oJzxicj4nKTtcbiAgfVxuXG4gIHVwZGF0ZVZhbHVlKGN0eDogYW55LCB2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICAvLyBTZXQgdmFsdWUgb2YgY3VycmVudCBjb250cm9sXG4gICAgY3R4LmNvbnRyb2xWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChjdHguYm91bmRDb250cm9sKSB7XG4gICAgICBjdHguZm9ybUNvbnRyb2wuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgY3R4LmZvcm1Db250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgfVxuICAgIGN0eC5sYXlvdXROb2RlLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvLyBTZXQgdmFsdWVzIG9mIGFueSByZWxhdGVkIGNvbnRyb2xzIGluIGNvcHlWYWx1ZVRvIGFycmF5XG4gICAgaWYgKGlzQXJyYXkoY3R4Lm9wdGlvbnMuY29weVZhbHVlVG8pKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY3R4Lm9wdGlvbnMuY29weVZhbHVlVG8pIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0Q29udHJvbCA9IGdldENvbnRyb2wodGhpcy5mb3JtR3JvdXAsIGl0ZW0pO1xuICAgICAgICBpZiAoaXNPYmplY3QodGFyZ2V0Q29udHJvbCkgJiYgdHlwZW9mIHRhcmdldENvbnRyb2wuc2V0VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0YXJnZXRDb250cm9sLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICB0YXJnZXRDb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVBcnJheUNoZWNrYm94TGlzdChjdHg6IGFueSwgY2hlY2tib3hMaXN0OiBUaXRsZU1hcEl0ZW1bXSk6IHZvaWQge1xuICAgIGNvbnN0IGZvcm1BcnJheSA9IDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbChjdHgpO1xuXG4gICAgLy8gUmVtb3ZlIGFsbCBleGlzdGluZyBpdGVtc1xuICAgIHdoaWxlIChmb3JtQXJyYXkudmFsdWUubGVuZ3RoKSB7IGZvcm1BcnJheS5yZW1vdmVBdCgwKTsgfVxuXG4gICAgLy8gUmUtYWRkIGFuIGl0ZW0gZm9yIGVhY2ggY2hlY2tlZCBib3hcbiAgICBjb25zdCByZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgIGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyICsgJy8tJywgdGhpcy5kYXRhUmVjdXJzaXZlUmVmTWFwLCB0aGlzLmFycmF5TWFwXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IGNoZWNrYm94SXRlbSBvZiBjaGVja2JveExpc3QpIHtcbiAgICAgIGlmIChjaGVja2JveEl0ZW0uY2hlY2tlZCkge1xuICAgICAgICBjb25zdCBuZXdGb3JtQ29udHJvbCA9IGJ1aWxkRm9ybUdyb3VwKHRoaXMudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdKTtcbiAgICAgICAgbmV3Rm9ybUNvbnRyb2wuc2V0VmFsdWUoY2hlY2tib3hJdGVtLnZhbHVlKTtcbiAgICAgICAgZm9ybUFycmF5LnB1c2gobmV3Rm9ybUNvbnRyb2wpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3JtQXJyYXkubWFya0FzRGlydHkoKTtcbiAgfVxuXG4gIGdldEZvcm1Db250cm9sKGN0eDogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHxcbiAgICAgIGN0eC5sYXlvdXROb2RlLnR5cGUgPT09ICckcmVmJ1xuICAgICkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCkpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xWYWx1ZShjdHg6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8ICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8XG4gICAgICBjdHgubGF5b3V0Tm9kZS50eXBlID09PSAnJHJlZidcbiAgICApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBjb250cm9sID0gZ2V0Q29udHJvbCh0aGlzLmZvcm1Hcm91cCwgdGhpcy5nZXREYXRhUG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gY29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiBudWxsO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHg6IGFueSk6IEZvcm1BcnJheSB8IEZvcm1Hcm91cCB7XG4gICAgaWYgKCFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBnZXRDb250cm9sKHRoaXMuZm9ybUdyb3VwLCB0aGlzLmdldERhdGFQb2ludGVyKGN0eCksIHRydWUpO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbnRyb2xOYW1lKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHwgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpXG4gICAgKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLnRvS2V5KHRoaXMuZ2V0RGF0YVBvaW50ZXIoY3R4KSk7XG4gIH1cblxuICBnZXRMYXlvdXRBcnJheShjdHg6IGFueSk6IGFueVtdIHtcbiAgICByZXR1cm4gSnNvblBvaW50ZXIuZ2V0KHRoaXMubGF5b3V0LCB0aGlzLmdldExheW91dFBvaW50ZXIoY3R4KSwgMCwgLTEpO1xuICB9XG5cbiAgZ2V0UGFyZW50Tm9kZShjdHg6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLmdldCh0aGlzLmxheW91dCwgdGhpcy5nZXRMYXlvdXRQb2ludGVyKGN0eCksIDAsIC0yKTtcbiAgfVxuXG4gIGdldERhdGFQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlcikgfHwgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpXG4gICAgKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLnRvSW5kZXhlZFBvaW50ZXIoXG4gICAgICBjdHgubGF5b3V0Tm9kZS5kYXRhUG9pbnRlciwgY3R4LmRhdGFJbmRleCwgdGhpcy5hcnJheU1hcFxuICAgICk7XG4gIH1cblxuICBnZXRMYXlvdXRQb2ludGVyKGN0eDogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoIWhhc1ZhbHVlKGN0eC5sYXlvdXRJbmRleCkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gJy8nICsgY3R4LmxheW91dEluZGV4LmpvaW4oJy9pdGVtcy8nKTtcbiAgfVxuXG4gIGlzQ29udHJvbEJvdW5kKGN0eDogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgIWN0eC5sYXlvdXROb2RlIHx8ICFpc0RlZmluZWQoY3R4LmxheW91dE5vZGUuZGF0YVBvaW50ZXIpIHx8ICFoYXNWYWx1ZShjdHguZGF0YUluZGV4KVxuICAgICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBjb250cm9sR3JvdXAgPSB0aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KTtcbiAgICByZXR1cm4gY29udHJvbEdyb3VwID8gaGFzT3duKGNvbnRyb2xHcm91cC5jb250cm9scywgbmFtZSkgOiBmYWxzZTtcbiAgfVxuXG4gIGFkZEl0ZW0oY3R4OiBhbnksIG5hbWU/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICAhY3R4LmxheW91dE5vZGUgfHwgIWlzRGVmaW5lZChjdHgubGF5b3V0Tm9kZS4kcmVmKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpXG4gICAgKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIFxuICAgIC8vIENyZWF0ZSBhIG5ldyBBbmd1bGFyIGZvcm0gY29udHJvbCBmcm9tIGEgdGVtcGxhdGUgaW4gdGVtcGxhdGVSZWZMaWJyYXJ5XG4gICAgY29uc3QgbmV3Rm9ybUdyb3VwID0gYnVpbGRGb3JtR3JvdXAodGhpcy50ZW1wbGF0ZVJlZkxpYnJhcnlbY3R4LmxheW91dE5vZGUuJHJlZl0pO1xuXG4gICAgLy8gQWRkIHRoZSBuZXcgZm9ybSBjb250cm9sIHRvIHRoZSBwYXJlbnQgZm9ybUFycmF5IG9yIGZvcm1Hcm91cFxuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW0pIHsgLy8gQWRkIG5ldyBhcnJheSBpdGVtIHRvIGZvcm1BcnJheSAgICBcbiAgICAgIC8vIGNvbnN0IGZvcm1BcnJheSA9IDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCk7XG4gICAgICAvLyBmb3JtQXJyYXkuaW5zZXJ0KDAsIG5ld0Zvcm1Hcm91cCk7IFxuICAgICAgLy8gZm9ybUFycmF5LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTsgICAgICBcbiAgICAgIC8vICg8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKS5jb250cm9sc1tuYW1lXS51bnNoaWZ0KG5ld0Zvcm1Hcm91cCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KSk7XG4gICAgICAoPEZvcm1BcnJheT50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KSkucHVzaChuZXdGb3JtR3JvdXApO1xuICAgIH0gZWxzZSB7IC8vIEFkZCBuZXcgJHJlZiBpdGVtIHRvIGZvcm1Hcm91cFxuICAgICAgKDxGb3JtR3JvdXA+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCkpXG4gICAgICAgIC5hZGRDb250cm9sKG5hbWUgfHwgdGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSwgbmV3Rm9ybUdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IGEgbmV3IGxheW91dE5vZGUgZnJvbSBsYXlvdXRSZWZMaWJyYXJ5XG4gICAgY29uc3QgbmV3TGF5b3V0Tm9kZSA9IGdldExheW91dE5vZGUoY3R4LmxheW91dE5vZGUsIHRoaXMpO1xuICAgIG5ld0xheW91dE5vZGUuYXJyYXlJdGVtID0gY3R4LmxheW91dE5vZGUuYXJyYXlJdGVtO1xuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlKSB7XG4gICAgICBuZXdMYXlvdXROb2RlLmFycmF5SXRlbVR5cGUgPSBjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbmV3TGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlO1xuICAgIH1cbiAgICBpZiAobmFtZSkge1xuICAgICAgbmV3TGF5b3V0Tm9kZS5uYW1lID0gbmFtZTtcbiAgICAgIG5ld0xheW91dE5vZGUuZGF0YVBvaW50ZXIgKz0gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKG5hbWUpO1xuICAgICAgbmV3TGF5b3V0Tm9kZS5vcHRpb25zLnRpdGxlID0gZml4VGl0bGUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBuZXcgbGF5b3V0Tm9kZSB0byB0aGUgZm9ybSBsYXlvdXRcbiAgICBKc29uUG9pbnRlci5pbnNlcnQodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpLCBuZXdMYXlvdXROb2RlKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZUFycmF5SXRlbShjdHg6IGFueSwgb2xkSW5kZXg6IG51bWJlciwgbmV3SW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpIHx8XG4gICAgICAhaXNEZWZpbmVkKG9sZEluZGV4KSB8fCAhaXNEZWZpbmVkKG5ld0luZGV4KSB8fCBvbGRJbmRleCA9PT0gbmV3SW5kZXhcbiAgICApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBNb3ZlIGl0ZW0gaW4gdGhlIGZvcm1BcnJheVxuICAgIGNvbnN0IGZvcm1BcnJheSA9IDxGb3JtQXJyYXk+dGhpcy5nZXRGb3JtQ29udHJvbEdyb3VwKGN0eCk7XG4gICAgY29uc3QgYXJyYXlJdGVtID0gZm9ybUFycmF5LmF0KG9sZEluZGV4KTtcbiAgICBmb3JtQXJyYXkucmVtb3ZlQXQob2xkSW5kZXgpO1xuICAgIGZvcm1BcnJheS5pbnNlcnQobmV3SW5kZXgsIGFycmF5SXRlbSk7XG4gICAgZm9ybUFycmF5LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcblxuICAgIC8vIE1vdmUgbGF5b3V0IGl0ZW1cbiAgICBjb25zdCBsYXlvdXRBcnJheSA9IHRoaXMuZ2V0TGF5b3V0QXJyYXkoY3R4KTtcbiAgICBsYXlvdXRBcnJheS5zcGxpY2UobmV3SW5kZXgsIDAsIGxheW91dEFycmF5LnNwbGljZShvbGRJbmRleCwgMSlbMF0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVtb3ZlSXRlbShjdHg6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgICFjdHgubGF5b3V0Tm9kZSB8fCAhaXNEZWZpbmVkKGN0eC5sYXlvdXROb2RlLmRhdGFQb2ludGVyKSB8fFxuICAgICAgIWhhc1ZhbHVlKGN0eC5kYXRhSW5kZXgpIHx8ICFoYXNWYWx1ZShjdHgubGF5b3V0SW5kZXgpXG4gICAgKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBBbmd1bGFyIGZvcm0gY29udHJvbCBmcm9tIHRoZSBwYXJlbnQgZm9ybUFycmF5IG9yIGZvcm1Hcm91cFxuICAgIGlmIChjdHgubGF5b3V0Tm9kZS5hcnJheUl0ZW0pIHsgLy8gUmVtb3ZlIGFycmF5IGl0ZW0gZnJvbSBmb3JtQXJyYXlcbiAgICAgICg8Rm9ybUFycmF5PnRoaXMuZ2V0Rm9ybUNvbnRyb2xHcm91cChjdHgpKVxuICAgICAgICAucmVtb3ZlQXQoY3R4LmRhdGFJbmRleFtjdHguZGF0YUluZGV4Lmxlbmd0aCAtIDFdKTtcbiAgICB9IGVsc2UgeyAvLyBSZW1vdmUgJHJlZiBpdGVtIGZyb20gZm9ybUdyb3VwXG4gICAgICAoPEZvcm1Hcm91cD50aGlzLmdldEZvcm1Db250cm9sR3JvdXAoY3R4KSlcbiAgICAgICAgLnJlbW92ZUNvbnRyb2wodGhpcy5nZXRGb3JtQ29udHJvbE5hbWUoY3R4KSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGxheW91dE5vZGUgZnJvbSBsYXlvdXRcbiAgICBKc29uUG9pbnRlci5yZW1vdmUodGhpcy5sYXlvdXQsIHRoaXMuZ2V0TGF5b3V0UG9pbnRlcihjdHgpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19