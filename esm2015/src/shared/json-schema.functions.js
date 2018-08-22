import * as _ from 'lodash';
import { getType, hasValue, inArray, isArray, isNumber, isObject, isString } from './validator.functions';
import { forEach, hasOwn, mergeFilteredObject } from './utility.functions';
import { mergeSchemas } from './merge-schemas.function';
import { JsonPointer } from './jsonpointer.functions';
/**
 * JSON Schema function library:
 *
 * buildSchemaFromLayout:   TODO: Write this function
 *
 * buildSchemaFromData:
 *
 * getFromSchema:
 *
 * removeRecursiveReferences:
 *
 * getInputType:
 *
 * checkInlineType:
 *
 * isInputRequired:
 *
 * updateInputOptions:
 *
 * getTitleMapFromOneOf:
 *
 * getControlValidators:
 *
 * resolveSchemaReferences:
 *
 * getSubSchema:
 *
 * combineAllOf:
 *
 * fixRequiredArrayProperties:
 */
/**
 * 'buildSchemaFromLayout' function
 *
 * TODO: Build a JSON Schema from a JSON Form layout
 *
 * @param  { any[] } layout - The JSON Form layout
 * @return { any } - The new JSON Schema
 */
export function buildSchemaFromLayout(layout) {
    return;
    // let newSchema: any = { };
    // const walkLayout = (layoutItems: any[], callback: Function): any[] => {
    //   let returnArray: any[] = [];
    //   for (let layoutItem of layoutItems) {
    //     const returnItem: any = callback(layoutItem);
    //     if (returnItem) { returnArray = returnArray.concat(callback(layoutItem)); }
    //     if (layoutItem.items) {
    //       returnArray = returnArray.concat(walkLayout(layoutItem.items, callback));
    //     }
    //   }
    //   return returnArray;
    // };
    // walkLayout(layout, layoutItem => {
    //   let itemKey: string;
    //   if (typeof layoutItem === 'string') {
    //     itemKey = layoutItem;
    //   } else if (layoutItem.key) {
    //     itemKey = layoutItem.key;
    //   }
    //   if (!itemKey) { return; }
    //   //
    // });
}
/**
 * 'buildSchemaFromData' function
 *
 * Build a JSON Schema from a data object
 *
 * @param  { any } data - The data object
 * @param  { boolean = false } requireAllFields - Require all fields?
 * @param  { boolean = true } isRoot - is root
 * @return { any } - The new JSON Schema
 */
export function buildSchemaFromData(data, requireAllFields = false, isRoot = true) {
    const newSchema = {};
    const getFieldType = (value) => {
        const fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    };
    const buildSubSchema = (value) => buildSchemaFromData(value, requireAllFields, false);
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        for (const key of Object.keys(data)) {
            newSchema.properties[key] = buildSubSchema(data[key]);
            if (requireAllFields) {
                newSchema.required.push(key);
            }
        }
    }
    else if (newSchema.type === 'array') {
        newSchema.items = data.map(buildSubSchema);
        // If all items are the same type, use an object for items instead of an array
        if ((new Set(data.map(getFieldType))).size === 1) {
            newSchema.items = newSchema.items.reduce((a, b) => (Object.assign({}, a, b)), {});
        }
        if (requireAllFields) {
            newSchema.minItems = 1;
        }
    }
    return newSchema;
}
/**
 * 'getFromSchema' function
 *
 * Uses a JSON Pointer for a value within a data object to retrieve
 * the schema for that value within schema for the data object.
 *
 * The optional third parameter can also be set to return something else:
 * 'schema' (default): the schema for the value indicated by the data pointer
 * 'parentSchema': the schema for the value's parent object or array
 * 'schemaPointer': a pointer to the value's schema within the object's schema
 * 'parentSchemaPointer': a pointer to the schema for the value's parent object or array
 *
 * @param  { any } schema - The schema to get the sub-schema from
 * @param  { Pointer } dataPointer - JSON Pointer (string or array)
 * @param  { string = 'schema' } returnType - what to return?
 * @return { any } - The located sub-schema
 */
export function getFromSchema(schema, dataPointer, returnType = 'schema') {
    const dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error(`getFromSchema error: Invalid JSON Pointer: ${dataPointer}`);
        return null;
    }
    let subSchema = schema;
    const schemaPointer = [];
    const length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (let i = 0; i < length; ++i) {
        const parentSchema = subSchema;
        const key = dataPointerArray[i];
        let subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error(`getFromSchema error: Unable to find "${key}" key in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return null;
        }
        if (subSchema.type === 'array' && (!isNaN(key) || key === '-')) {
            if (hasOwn(subSchema, 'items')) {
                if (isObject(subSchema.items)) {
                    subSchemaFound = true;
                    subSchema = subSchema.items;
                    schemaPointer.push('items');
                }
                else if (isArray(subSchema.items)) {
                    if (!isNaN(key) && subSchema.items.length >= +key) {
                        subSchemaFound = true;
                        subSchema = subSchema.items[+key];
                        schemaPointer.push('items', key);
                    }
                }
            }
            if (!subSchemaFound && isObject(subSchema.additionalItems)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalItems;
                schemaPointer.push('additionalItems');
            }
            else if (subSchema.additionalItems !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalItems');
            }
        }
        else if (subSchema.type === 'object') {
            if (isObject(subSchema.properties) && hasOwn(subSchema.properties, key)) {
                subSchemaFound = true;
                subSchema = subSchema.properties[key];
                schemaPointer.push('properties', key);
            }
            else if (isObject(subSchema.additionalProperties)) {
                subSchemaFound = true;
                subSchema = subSchema.additionalProperties;
                schemaPointer.push('additionalProperties');
            }
            else if (subSchema.additionalProperties !== false) {
                subSchemaFound = true;
                subSchema = {};
                schemaPointer.push('additionalProperties');
            }
        }
        if (!subSchemaFound) {
            console.error(`getFromSchema error: Unable to find "${key}" item in schema.`);
            console.error(schema);
            console.error(dataPointer);
            return;
        }
    }
    return returnType.slice(-7) === 'Pointer' ? schemaPointer : subSchema;
}
/**
 * 'removeRecursiveReferences' function
 *
 * Checks a JSON Pointer against a map of recursive references and returns
 * a JSON Pointer to the shallowest equivalent location in the same object.
 *
 * Using this functions enables an object to be constructed with unlimited
 * recursion, while maintaing a fixed set of metadata, such as field data types.
 * The object can grow as large as it wants, and deeply recursed nodes can
 * just refer to the metadata for their shallow equivalents, instead of having
 * to add additional redundant metadata for each recursively added node.
 *
 * Example:
 *
 * pointer:         '/stuff/and/more/and/more/and/more/and/more/stuff'
 * recursiveRefMap: [['/stuff/and/more/and/more', '/stuff/and/more/']]
 * returned:        '/stuff/and/more/stuff'
 *
 * @param  { Pointer } pointer -
 * @param  { Map<string, string> } recursiveRefMap -
 * @param  { Map<string, number> = new Map() } arrayMap - optional
 * @return { string } -
 */
export function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap = new Map()) {
    if (!pointer) {
        return '';
    }
    let genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    let possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach((toPointer, fromPointer) => {
            if (JsonPointer.isSubPointer(toPointer, fromPointer)) {
                while (JsonPointer.isSubPointer(fromPointer, genericPointer, true)) {
                    genericPointer = JsonPointer.toGenericPointer(toPointer + genericPointer.slice(fromPointer.length), arrayMap);
                    possibleReferences = true;
                }
            }
        });
    }
    return genericPointer;
}
/**
 * 'getInputType' function
 *
 * @param  { any } schema
 * @param  { any = null } layoutNode
 * @return { string }
 */
export function getInputType(schema, layoutNode = null) {
    // x-schema-form = Angular Schema Form compatibility
    // widget & component = React Jsonschema Form compatibility
    const controlType = JsonPointer.getFirst([
        [schema, '/x-schema-form/type'],
        [schema, '/x-schema-form/widget/component'],
        [schema, '/x-schema-form/widget'],
        [schema, '/widget/component'],
        [schema, '/widget']
    ]);
    if (isString(controlType)) {
        return checkInlineType(controlType, schema, layoutNode);
    }
    let schemaType = schema.type;
    if (schemaType) {
        if (isArray(schemaType)) {
            // If multiple types listed, use most inclusive type
            schemaType =
                inArray('object', schemaType) && hasOwn(schema, 'properties') ? 'object' :
                    inArray('array', schemaType) && hasOwn(schema, 'items') ? 'array' :
                        inArray('array', schemaType) && hasOwn(schema, 'additionalItems') ? 'array' :
                            inArray('string', schemaType) ? 'string' :
                                inArray('number', schemaType) ? 'number' :
                                    inArray('integer', schemaType) ? 'integer' :
                                        inArray('boolean', schemaType) ? 'boolean' : 'unknown';
        }
        if (schemaType === 'boolean') {
            return 'checkbox';
        }
        if (schemaType === 'object') {
            if (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) {
                return 'section';
            }
            // TODO: Figure out how to handle additionalProperties
            if (hasOwn(schema, '$ref')) {
                return '$ref';
            }
        }
        if (schemaType === 'array') {
            const itemsObject = JsonPointer.getFirst([
                [schema, '/items'],
                [schema, '/additionalItems']
            ]) || {};
            return hasOwn(itemsObject, 'enum') && schema.maxItems !== 1 ?
                checkInlineType('checkboxes', schema, layoutNode) : 'array';
        }
        if (schemaType === 'null') {
            return 'none';
        }
        if (JsonPointer.has(layoutNode, '/options/titleMap') ||
            hasOwn(schema, 'enum') || getTitleMapFromOneOf(schema, null, true)) {
            return 'select';
        }
        if (schemaType === 'number' || schemaType === 'integer') {
            return (schemaType === 'integer' || hasOwn(schema, 'multipleOf')) &&
                hasOwn(schema, 'maximum') && hasOwn(schema, 'minimum') ? 'range' : schemaType;
        }
        if (schemaType === 'string') {
            return {
                'color': 'color',
                'date': 'date',
                'date-time': 'datetime-local',
                'email': 'email',
                'uri': 'url',
            }[schema.format] || 'text';
        }
    }
    if (hasOwn(schema, '$ref')) {
        return '$ref';
    }
    if (isArray(schema.oneOf) || isArray(schema.anyOf)) {
        return 'one-of';
    }
    console.error(`getInputType error: Unable to determine input type for ${schemaType}`);
    console.error('schema', schema);
    if (layoutNode) {
        console.error('layoutNode', layoutNode);
    }
    return 'none';
}
/**
 * 'checkInlineType' function
 *
 * Checks layout and schema nodes for 'inline: true', and converts
 * 'radios' or 'checkboxes' to 'radios-inline' or 'checkboxes-inline'
 *
 * @param  { string } controlType -
 * @param  { any } schema -
 * @param  { any = null } layoutNode -
 * @return { string }
 */
export function checkInlineType(controlType, schema, layoutNode = null) {
    if (!isString(controlType) || (controlType.slice(0, 8) !== 'checkbox' && controlType.slice(0, 5) !== 'radio')) {
        return controlType;
    }
    if (JsonPointer.getFirst([
        [layoutNode, '/inline'],
        [layoutNode, '/options/inline'],
        [schema, '/inline'],
        [schema, '/x-schema-form/inline'],
        [schema, '/x-schema-form/options/inline'],
        [schema, '/x-schema-form/widget/inline'],
        [schema, '/x-schema-form/widget/component/inline'],
        [schema, '/x-schema-form/widget/component/options/inline'],
        [schema, '/widget/inline'],
        [schema, '/widget/component/inline'],
        [schema, '/widget/component/options/inline'],
    ]) === true) {
        return controlType.slice(0, 5) === 'radio' ?
            'radios-inline' : 'checkboxes-inline';
    }
    else {
        return controlType;
    }
}
/**
 * 'isInputRequired' function
 *
 * Checks a JSON Schema to see if an item is required
 *
 * @param  { any } schema - the schema to check
 * @param  { string } schemaPointer - the pointer to the item to check
 * @return { boolean } - true if the item is required, false if not
 */
export function isInputRequired(schema, schemaPointer) {
    if (!isObject(schema)) {
        console.error('isInputRequired error: Input schema must be an object.');
        return false;
    }
    const listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        const keyName = listPointerArray.pop();
        const nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        const parentSchema = JsonPointer.get(schema, listPointerArray) || {};
        if (isArray(parentSchema.required)) {
            return parentSchema.required.includes(keyName);
        }
        if (parentSchema.type === 'array') {
            return hasOwn(parentSchema, 'minItems') &&
                isNumber(keyName) &&
                +parentSchema.minItems > +keyName;
        }
    }
    return false;
}
/**
 * 'updateInputOptions' function
 *
 * @param  { any } layoutNode
 * @param  { any } schema
 * @param  { any } jsf
 * @return { void }
 */
export function updateInputOptions(layoutNode, schema, jsf) {
    if (!isObject(layoutNode) || !isObject(layoutNode.options)) {
        return;
    }
    // Set all option values in layoutNode.options
    const newOptions = {};
    const fixUiKeys = key => key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key;
    mergeFilteredObject(newOptions, jsf.formOptions.defautWidgetOptions, [], fixUiKeys);
    [[JsonPointer.get(schema, '/ui:widget/options'), []],
        [JsonPointer.get(schema, '/ui:widget'), []],
        [schema, [
                'additionalProperties', 'additionalItems', 'properties', 'items',
                'required', 'type', 'x-schema-form', '$ref'
            ]],
        [JsonPointer.get(schema, '/x-schema-form/options'), []],
        [JsonPointer.get(schema, '/x-schema-form'), ['items', 'options']],
        [layoutNode, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]],
        [layoutNode.options, []],
    ].forEach(([object, excludeKeys]) => mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys));
    if (!hasOwn(newOptions, 'titleMap')) {
        let newTitleMap = null;
        newTitleMap = getTitleMapFromOneOf(schema, newOptions.flatList);
        if (newTitleMap) {
            newOptions.titleMap = newTitleMap;
        }
        if (!hasOwn(newOptions, 'titleMap') && !hasOwn(newOptions, 'enum') && hasOwn(schema, 'items')) {
            if (JsonPointer.has(schema, '/items/titleMap')) {
                newOptions.titleMap = schema.items.titleMap;
            }
            else if (JsonPointer.has(schema, '/items/enum')) {
                newOptions.enum = schema.items.enum;
                if (!hasOwn(newOptions, 'enumNames') && JsonPointer.has(schema, '/items/enumNames')) {
                    newOptions.enumNames = schema.items.enumNames;
                }
            }
            else if (JsonPointer.has(schema, '/items/oneOf')) {
                newTitleMap = getTitleMapFromOneOf(schema.items, newOptions.flatList);
                if (newTitleMap) {
                    newOptions.titleMap = newTitleMap;
                }
            }
        }
    }
    // If schema type is integer, enforce by setting multipleOf = 1
    if (schema.type === 'integer' && !hasValue(newOptions.multipleOf)) {
        newOptions.multipleOf = 1;
    }
    // Copy any typeahead word lists to options.typeahead.source
    if (JsonPointer.has(newOptions, '/autocomplete/source')) {
        newOptions.typeahead = newOptions.autocomplete;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/source')) {
        newOptions.typeahead = newOptions.tagsinput;
    }
    else if (JsonPointer.has(newOptions, '/tagsinput/typeahead/source')) {
        newOptions.typeahead = newOptions.tagsinput.typeahead;
    }
    layoutNode.options = newOptions;
}
/**
 * 'getTitleMapFromOneOf' function
 *
 * @param  { schema } schema
 * @param  { boolean = null } flatList
 * @param  { boolean = false } validateOnly
 * @return { validators }
 */
export function getTitleMapFromOneOf(schema = {}, flatList = null, validateOnly = false) {
    let titleMap = null;
    const oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every(item => item.title)) {
        if (oneOf.every(item => isArray(item.enum) && item.enum.length === 1)) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(item => ({ name: item.title, value: item.enum[0] }));
        }
        else if (oneOf.every(item => item.const)) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(item => ({ name: item.title, value: item.const }));
        }
        // if flatList !== false and some items have colons, make grouped map
        if (flatList !== false && (titleMap || [])
            .filter(title => ((title || {}).name || '').indexOf(': ')).length > 1) {
            // Split name on first colon to create grouped map (name -> group: name)
            const newTitleMap = titleMap.map(title => {
                const [group, name] = title.name.split(/: (.+)/);
                return group && name ? Object.assign({}, title, { group, name }) : title;
            });
            // If flatList === true or at least one group has multiple items, use grouped map
            if (flatList === true || newTitleMap.some((title, index) => index &&
                hasOwn(title, 'group') && title.group === newTitleMap[index - 1].group)) {
                titleMap = newTitleMap;
            }
        }
    }
    return validateOnly ? false : titleMap;
}
/**
 * 'getControlValidators' function
 *
 * @param { any } schema
 * @return { validators }
 */
export function getControlValidators(schema) {
    if (!isObject(schema)) {
        return null;
    }
    const validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'number':
            case 'integer':
                forEach(['Minimum', 'Maximum'], (ucLimit) => {
                    const eLimit = 'exclusive' + ucLimit;
                    const limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        const exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                });
                forEach(['multipleOf', 'type'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'object':
                forEach(['minProperties', 'maxProperties', 'dependencies'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'array':
                forEach(['minItems', 'maxItems', 'uniqueItems'], (prop) => {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
        }
    }
    if (hasOwn(schema, 'enum')) {
        validators.enum = [schema.enum];
    }
    return validators;
}
/**
 * 'resolveSchemaReferences' function
 *
 * Find all $ref links in schema and save links and referenced schemas in
 * schemaRefLibrary, schemaRecursiveRefMap, and dataRecursiveRefMap
 *
 * @param { any } schema
 * @param { any } schemaRefLibrary
 * @param { Map<string, string> } schemaRecursiveRefMap
 * @param { Map<string, string> } dataRecursiveRefMap
 * @param { Map<string, number> } arrayMap
 * @return { any }
 */
export function resolveSchemaReferences(schema, schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, arrayMap) {
    if (!isObject(schema)) {
        console.error('resolveSchemaReferences error: schema must be an object.');
        return;
    }
    const refLinks = new Set();
    const refMapSet = new Set();
    const refMap = new Map();
    const recursiveRefMap = new Map();
    const refLibrary = {};
    // Search schema for all $ref links, and build full refLibrary
    JsonPointer.forEachDeep(schema, (subSchema, subSchemaPointer) => {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            const refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    });
    refLinks.forEach(ref => refLibrary[ref] = getSubSchema(schema, ref));
    // Follow all ref links and save in refMapSet,
    // to find any multi-link recursive refernces
    let checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach(([fromRef1, toRef1]) => Array.from(refMap)
            .filter(([fromRef2, toRef2]) => JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
            !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
            !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2))
            .forEach(([fromRef2, toRef2]) => {
            refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            checkRefLinks = true;
        }));
    }
    // Build full recursiveRefMap
    // First pass - save all internally recursive refs from refMapSet
    Array.from(refMapSet)
        .map(refLink => refLink.split('~~'))
        .filter(([fromRef, toRef]) => JsonPointer.isSubPointer(toRef, fromRef))
        .forEach(([fromRef, toRef]) => recursiveRefMap.set(fromRef, toRef));
    // Second pass - create recursive versions of any other refs that link to recursive refs
    Array.from(refMap)
        .filter(([fromRef1, toRef1]) => Array.from(recursiveRefMap.keys())
        .every(fromRef2 => !JsonPointer.isSubPointer(fromRef1, fromRef2, true)))
        .forEach(([fromRef1, toRef1]) => Array.from(recursiveRefMap)
        .filter(([fromRef2, toRef2]) => !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
        JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
        !JsonPointer.isSubPointer(toRef1, fromRef1, true))
        .forEach(([fromRef2, toRef2]) => recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length))));
    // Create compiled schema by replacing all non-recursive $ref links with
    // thieir linked schemas and, where possible, combining schemas in allOf arrays.
    let compiledSchema = Object.assign({}, schema);
    delete compiledSchema.definitions;
    compiledSchema =
        getSubSchema(compiledSchema, '', refLibrary, recursiveRefMap);
    // Make sure all remaining schema $refs are recursive, and build final
    // schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
    JsonPointer.forEachDeep(compiledSchema, (subSchema, subSchemaPointer) => {
        if (isString(subSchema['$ref'])) {
            let refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: `#${refPointer}` });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            const fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                const toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            const dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                const tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
                arrayMap.set(dataPointer, tupleItems);
            }
        }
    }, true);
    return compiledSchema;
}
/**
 * 'getSubSchema' function
 *
 * @param  { any } schema
 * @param  { Pointer } pointer
 * @param  { object } schemaRefLibrary
 * @param  { Map<string, string> } schemaRecursiveRefMap
 * @param  { string[] = [] } usedPointers
 * @return { any }
 */
export function getSubSchema(schema, pointer, schemaRefLibrary = null, schemaRecursiveRefMap = null, usedPointers = []) {
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = [...usedPointers, pointer];
    let newSchema = null;
    if (pointer === '') {
        newSchema = _.cloneDeep(schema);
    }
    else {
        const shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = [...usedPointers, shortPointer];
        }
        newSchema = JsonPointer.getFirstCopy([
            [schemaRefLibrary, [shortPointer]],
            [schema, pointer],
            [schema, shortPointer]
        ]);
    }
    return JsonPointer.forEachDeepCopy(newSchema, (subSchema, subPointer) => {
        if (isObject(subSchema)) {
            // Replace non-recursive $ref links with referenced schemas
            if (isString(subSchema.$ref)) {
                const refPointer = JsonPointer.compile(subSchema.$ref);
                if (refPointer.length && usedPointers.every(ptr => !JsonPointer.isSubPointer(refPointer, ptr, true))) {
                    const refSchema = getSubSchema(schema, refPointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        const extraKeys = Object.assign({}, subSchema);
                        delete extraKeys.$ref;
                        return mergeSchemas(refSchema, extraKeys);
                    }
                }
            }
            // TODO: Convert schemas with 'type' arrays to 'oneOf'
            // Combine allOf subSchemas
            if (isArray(subSchema.allOf)) {
                return combineAllOf(subSchema);
            }
            // Fix incorrectly placed array object required lists
            if (subSchema.type === 'array' && isArray(subSchema.required)) {
                return fixRequiredArrayProperties(subSchema);
            }
        }
        return subSchema;
    }, true, pointer);
}
/**
 * 'combineAllOf' function
 *
 * Attempt to convert an allOf schema object into
 * a non-allOf schema object with equivalent rules.
 *
 * @param  { any } schema - allOf schema object
 * @return { any } - converted schema object
 */
export function combineAllOf(schema) {
    if (!isObject(schema) || !isArray(schema.allOf)) {
        return schema;
    }
    let mergedSchema = mergeSchemas(...schema.allOf);
    if (Object.keys(schema).length > 1) {
        const extraKeys = Object.assign({}, schema);
        delete extraKeys.allOf;
        mergedSchema = mergeSchemas(mergedSchema, extraKeys);
    }
    return mergedSchema;
}
/**
 * 'fixRequiredArrayProperties' function
 *
 * Fixes an incorrectly placed required list inside an array schema, by moving
 * it into items.properties or additionalItems.properties, where it belongs.
 *
 * @param  { any } schema - allOf schema object
 * @return { any } - converted schema object
 */
export function fixRequiredArrayProperties(schema) {
    if (schema.type === 'array' && isArray(schema.required)) {
        const itemsObject = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject && !hasOwn(schema[itemsObject], 'required') && (hasOwn(schema[itemsObject], 'additionalProperties') ||
            schema.required.every(key => hasOwn(schema[itemsObject].properties, key)))) {
            schema = _.cloneDeep(schema);
            schema[itemsObject].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9zaGFyZWQvanNvbi1zY2hlbWEuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCLE9BQU8sRUFDTCxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxRQUFRLEVBQzVFLFFBQVEsRUFDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxPQUFPLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUNyQyxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFXLE1BQU0seUJBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQy9ELE1BQU0sZ0NBQWdDLE1BQU07SUFDMUMsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXVCUjs7Ozs7Ozs7Ozs7QUFZRCxNQUFNLDhCQUNKLElBQUksRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUk7SUFFN0MsTUFBTSxTQUFTLEdBQVEsRUFBRSxDQUFDO0lBQzFCLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBVSxFQUFVLEVBQUU7UUFDMUMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUM7S0FDdEUsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBSyxF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QUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQUU7WUFDbEMsUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0U7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQUU7WUFDbEMsUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDekU7O1FBR0QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7YUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQ3RFLENBQUMsQ0FBQyxDQUFDOztZQUdELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JB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QUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQzFFLENBQUMsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUN4QjtLQUNGO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztDQUNmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBnZXRUeXBlLCBoYXNWYWx1ZSwgaW5BcnJheSwgaXNBcnJheSwgaXNFbXB0eSwgaXNGdW5jdGlvbiwgaXNOdW1iZXIsIGlzT2JqZWN0LFxuICBpc1N0cmluZ1xufSBmcm9tICcuL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuaW1wb3J0IHtcbiAgZm9yRWFjaCwgaGFzT3duLCBtZXJnZUZpbHRlcmVkT2JqZWN0LCB1bmlxdWVJdGVtcywgY29tbW9uSXRlbXNcbn0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBtZXJnZVNjaGVtYXMgfSBmcm9tICcuL21lcmdlLXNjaGVtYXMuZnVuY3Rpb24nO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIsIFBvaW50ZXIgfSBmcm9tICcuL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uVmFsaWRhdG9ycyB9IGZyb20gJy4vanNvbi52YWxpZGF0b3JzJztcblxuLyoqXG4gKiBKU09OIFNjaGVtYSBmdW5jdGlvbiBsaWJyYXJ5OlxuICpcbiAqIGJ1aWxkU2NoZW1hRnJvbUxheW91dDogICBUT0RPOiBXcml0ZSB0aGlzIGZ1bmN0aW9uXG4gKlxuICogYnVpbGRTY2hlbWFGcm9tRGF0YTpcbiAqXG4gKiBnZXRGcm9tU2NoZW1hOlxuICpcbiAqIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXM6XG4gKlxuICogZ2V0SW5wdXRUeXBlOlxuICpcbiAqIGNoZWNrSW5saW5lVHlwZTpcbiAqXG4gKiBpc0lucHV0UmVxdWlyZWQ6XG4gKlxuICogdXBkYXRlSW5wdXRPcHRpb25zOlxuICpcbiAqIGdldFRpdGxlTWFwRnJvbU9uZU9mOlxuICpcbiAqIGdldENvbnRyb2xWYWxpZGF0b3JzOlxuICpcbiAqIHJlc29sdmVTY2hlbWFSZWZlcmVuY2VzOlxuICpcbiAqIGdldFN1YlNjaGVtYTpcbiAqXG4gKiBjb21iaW5lQWxsT2Y6XG4gKlxuICogZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXM6XG4gKi9cblxuLyoqXG4gKiAnYnVpbGRTY2hlbWFGcm9tTGF5b3V0JyBmdW5jdGlvblxuICpcbiAqIFRPRE86IEJ1aWxkIGEgSlNPTiBTY2hlbWEgZnJvbSBhIEpTT04gRm9ybSBsYXlvdXRcbiAqXG4gKiBAcGFyYW0gIHsgYW55W10gfSBsYXlvdXQgLSBUaGUgSlNPTiBGb3JtIGxheW91dFxuICogQHJldHVybiB7IGFueSB9IC0gVGhlIG5ldyBKU09OIFNjaGVtYVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTY2hlbWFGcm9tTGF5b3V0KGxheW91dCkge1xuICByZXR1cm47XG4gIC8vIGxldCBuZXdTY2hlbWE6IGFueSA9IHsgfTtcbiAgLy8gY29uc3Qgd2Fsa0xheW91dCA9IChsYXlvdXRJdGVtczogYW55W10sIGNhbGxiYWNrOiBGdW5jdGlvbik6IGFueVtdID0+IHtcbiAgLy8gICBsZXQgcmV0dXJuQXJyYXk6IGFueVtdID0gW107XG4gIC8vICAgZm9yIChsZXQgbGF5b3V0SXRlbSBvZiBsYXlvdXRJdGVtcykge1xuICAvLyAgICAgY29uc3QgcmV0dXJuSXRlbTogYW55ID0gY2FsbGJhY2sobGF5b3V0SXRlbSk7XG4gIC8vICAgICBpZiAocmV0dXJuSXRlbSkgeyByZXR1cm5BcnJheSA9IHJldHVybkFycmF5LmNvbmNhdChjYWxsYmFjayhsYXlvdXRJdGVtKSk7IH1cbiAgLy8gICAgIGlmIChsYXlvdXRJdGVtLml0ZW1zKSB7XG4gIC8vICAgICAgIHJldHVybkFycmF5ID0gcmV0dXJuQXJyYXkuY29uY2F0KHdhbGtMYXlvdXQobGF5b3V0SXRlbS5pdGVtcywgY2FsbGJhY2spKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIHJldHVybkFycmF5O1xuICAvLyB9O1xuICAvLyB3YWxrTGF5b3V0KGxheW91dCwgbGF5b3V0SXRlbSA9PiB7XG4gIC8vICAgbGV0IGl0ZW1LZXk6IHN0cmluZztcbiAgLy8gICBpZiAodHlwZW9mIGxheW91dEl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gIC8vICAgICBpdGVtS2V5ID0gbGF5b3V0SXRlbTtcbiAgLy8gICB9IGVsc2UgaWYgKGxheW91dEl0ZW0ua2V5KSB7XG4gIC8vICAgICBpdGVtS2V5ID0gbGF5b3V0SXRlbS5rZXk7XG4gIC8vICAgfVxuICAvLyAgIGlmICghaXRlbUtleSkgeyByZXR1cm47IH1cbiAgLy8gICAvL1xuICAvLyB9KTtcbn1cblxuLyoqXG4gKiAnYnVpbGRTY2hlbWFGcm9tRGF0YScgZnVuY3Rpb25cbiAqXG4gKiBCdWlsZCBhIEpTT04gU2NoZW1hIGZyb20gYSBkYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0XG4gKiBAcGFyYW0gIHsgYm9vbGVhbiA9IGZhbHNlIH0gcmVxdWlyZUFsbEZpZWxkcyAtIFJlcXVpcmUgYWxsIGZpZWxkcz9cbiAqIEBwYXJhbSAgeyBib29sZWFuID0gdHJ1ZSB9IGlzUm9vdCAtIGlzIHJvb3RcbiAqIEByZXR1cm4geyBhbnkgfSAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbURhdGEoXG4gIGRhdGEsIHJlcXVpcmVBbGxGaWVsZHMgPSBmYWxzZSwgaXNSb290ID0gdHJ1ZVxuKSB7XG4gIGNvbnN0IG5ld1NjaGVtYTogYW55ID0ge307XG4gIGNvbnN0IGdldEZpZWxkVHlwZSA9ICh2YWx1ZTogYW55KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWVsZFR5cGUgPSBnZXRUeXBlKHZhbHVlLCAnc3RyaWN0Jyk7XG4gICAgcmV0dXJuIHsgaW50ZWdlcjogJ251bWJlcicsIG51bGw6ICdzdHJpbmcnIH1bZmllbGRUeXBlXSB8fCBmaWVsZFR5cGU7XG4gIH07XG4gIGNvbnN0IGJ1aWxkU3ViU2NoZW1hID0gKHZhbHVlKSA9PlxuICAgIGJ1aWxkU2NoZW1hRnJvbURhdGEodmFsdWUsIHJlcXVpcmVBbGxGaWVsZHMsIGZhbHNlKTtcbiAgaWYgKGlzUm9vdCkgeyBuZXdTY2hlbWEuJHNjaGVtYSA9ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA2L3NjaGVtYSMnOyB9XG4gIG5ld1NjaGVtYS50eXBlID0gZ2V0RmllbGRUeXBlKGRhdGEpO1xuICBpZiAobmV3U2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgbmV3U2NoZW1hLnByb3BlcnRpZXMgPSB7fTtcbiAgICBpZiAocmVxdWlyZUFsbEZpZWxkcykgeyBuZXdTY2hlbWEucmVxdWlyZWQgPSBbXTsgfVxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XG4gICAgICBuZXdTY2hlbWEucHJvcGVydGllc1trZXldID0gYnVpbGRTdWJTY2hlbWEoZGF0YVtrZXldKTtcbiAgICAgIGlmIChyZXF1aXJlQWxsRmllbGRzKSB7IG5ld1NjaGVtYS5yZXF1aXJlZC5wdXNoKGtleSk7IH1cbiAgICB9XG4gIH0gZWxzZSBpZiAobmV3U2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICBuZXdTY2hlbWEuaXRlbXMgPSBkYXRhLm1hcChidWlsZFN1YlNjaGVtYSk7XG4gICAgLy8gSWYgYWxsIGl0ZW1zIGFyZSB0aGUgc2FtZSB0eXBlLCB1c2UgYW4gb2JqZWN0IGZvciBpdGVtcyBpbnN0ZWFkIG9mIGFuIGFycmF5XG4gICAgaWYgKChuZXcgU2V0KGRhdGEubWFwKGdldEZpZWxkVHlwZSkpKS5zaXplID09PSAxKSB7XG4gICAgICBuZXdTY2hlbWEuaXRlbXMgPSBuZXdTY2hlbWEuaXRlbXMucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSk7XG4gICAgfVxuICAgIGlmIChyZXF1aXJlQWxsRmllbGRzKSB7IG5ld1NjaGVtYS5taW5JdGVtcyA9IDE7IH1cbiAgfVxuICByZXR1cm4gbmV3U2NoZW1hO1xufVxuXG4vKipcbiAqICdnZXRGcm9tU2NoZW1hJyBmdW5jdGlvblxuICpcbiAqIFVzZXMgYSBKU09OIFBvaW50ZXIgZm9yIGEgdmFsdWUgd2l0aGluIGEgZGF0YSBvYmplY3QgdG8gcmV0cmlldmVcbiAqIHRoZSBzY2hlbWEgZm9yIHRoYXQgdmFsdWUgd2l0aGluIHNjaGVtYSBmb3IgdGhlIGRhdGEgb2JqZWN0LlxuICpcbiAqIFRoZSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIgY2FuIGFsc28gYmUgc2V0IHRvIHJldHVybiBzb21ldGhpbmcgZWxzZTpcbiAqICdzY2hlbWEnIChkZWZhdWx0KTogdGhlIHNjaGVtYSBmb3IgdGhlIHZhbHVlIGluZGljYXRlZCBieSB0aGUgZGF0YSBwb2ludGVyXG4gKiAncGFyZW50U2NoZW1hJzogdGhlIHNjaGVtYSBmb3IgdGhlIHZhbHVlJ3MgcGFyZW50IG9iamVjdCBvciBhcnJheVxuICogJ3NjaGVtYVBvaW50ZXInOiBhIHBvaW50ZXIgdG8gdGhlIHZhbHVlJ3Mgc2NoZW1hIHdpdGhpbiB0aGUgb2JqZWN0J3Mgc2NoZW1hXG4gKiAncGFyZW50U2NoZW1hUG9pbnRlcic6IGEgcG9pbnRlciB0byB0aGUgc2NoZW1hIGZvciB0aGUgdmFsdWUncyBwYXJlbnQgb2JqZWN0IG9yIGFycmF5XG4gKlxuICogQHBhcmFtICB7IGFueSB9IHNjaGVtYSAtIFRoZSBzY2hlbWEgdG8gZ2V0IHRoZSBzdWItc2NoZW1hIGZyb21cbiAqIEBwYXJhbSAgeyBQb2ludGVyIH0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAqIEBwYXJhbSAgeyBzdHJpbmcgPSAnc2NoZW1hJyB9IHJldHVyblR5cGUgLSB3aGF0IHRvIHJldHVybj9cbiAqIEByZXR1cm4geyBhbnkgfSAtIFRoZSBsb2NhdGVkIHN1Yi1zY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZyb21TY2hlbWEoc2NoZW1hLCBkYXRhUG9pbnRlciwgcmV0dXJuVHlwZSA9ICdzY2hlbWEnKSB7XG4gIGNvbnN0IGRhdGFQb2ludGVyQXJyYXk6IGFueVtdID0gSnNvblBvaW50ZXIucGFyc2UoZGF0YVBvaW50ZXIpO1xuICBpZiAoZGF0YVBvaW50ZXJBcnJheSA9PT0gbnVsbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoYGdldEZyb21TY2hlbWEgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke2RhdGFQb2ludGVyfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGxldCBzdWJTY2hlbWEgPSBzY2hlbWE7XG4gIGNvbnN0IHNjaGVtYVBvaW50ZXIgPSBbXTtcbiAgY29uc3QgbGVuZ3RoID0gZGF0YVBvaW50ZXJBcnJheS5sZW5ndGg7XG4gIGlmIChyZXR1cm5UeXBlLnNsaWNlKDAsIDYpID09PSAncGFyZW50JykgeyBkYXRhUG9pbnRlckFycmF5Lmxlbmd0aC0tOyB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBwYXJlbnRTY2hlbWEgPSBzdWJTY2hlbWE7XG4gICAgY29uc3Qga2V5ID0gZGF0YVBvaW50ZXJBcnJheVtpXTtcbiAgICBsZXQgc3ViU2NoZW1hRm91bmQgPSBmYWxzZTtcbiAgICBpZiAodHlwZW9mIHN1YlNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldEZyb21TY2hlbWEgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIga2V5IGluIHNjaGVtYS5gKTtcbiAgICAgIGNvbnNvbGUuZXJyb3Ioc2NoZW1hKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YVBvaW50ZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiAoIWlzTmFOKGtleSkgfHwga2V5ID09PSAnLScpKSB7XG4gICAgICBpZiAoaGFzT3duKHN1YlNjaGVtYSwgJ2l0ZW1zJykpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHN1YlNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLml0ZW1zO1xuICAgICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnaXRlbXMnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHN1YlNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgICBpZiAoIWlzTmFOKGtleSkgJiYgc3ViU2NoZW1hLml0ZW1zLmxlbmd0aCA+PSAra2V5KSB7XG4gICAgICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEuaXRlbXNbK2tleV07XG4gICAgICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2l0ZW1zJywga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3ViU2NoZW1hRm91bmQgJiYgaXNPYmplY3Qoc3ViU2NoZW1hLmFkZGl0aW9uYWxJdGVtcykpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEuYWRkaXRpb25hbEl0ZW1zO1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2FkZGl0aW9uYWxJdGVtcycpO1xuICAgICAgfSBlbHNlIGlmIChzdWJTY2hlbWEuYWRkaXRpb25hbEl0ZW1zICE9PSBmYWxzZSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgIHN1YlNjaGVtYSA9IHsgfTtcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdhZGRpdGlvbmFsSXRlbXMnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN1YlNjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzT2JqZWN0KHN1YlNjaGVtYS5wcm9wZXJ0aWVzKSAmJiBoYXNPd24oc3ViU2NoZW1hLnByb3BlcnRpZXMsIGtleSkpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSBzdWJTY2hlbWEucHJvcGVydGllc1trZXldO1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ3Byb3BlcnRpZXMnLCBrZXkpO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzdWJTY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzO1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyk7XG4gICAgICB9IGVsc2UgaWYgKHN1YlNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSB7IH07XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbFByb3BlcnRpZXMnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFzdWJTY2hlbWFGb3VuZCkge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0RnJvbVNjaGVtYSBlcnJvcjogVW5hYmxlIHRvIGZpbmQgXCIke2tleX1cIiBpdGVtIGluIHNjaGVtYS5gKTtcbiAgICAgIGNvbnNvbGUuZXJyb3Ioc2NoZW1hKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YVBvaW50ZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuVHlwZS5zbGljZSgtNykgPT09ICdQb2ludGVyJyA/IHNjaGVtYVBvaW50ZXIgOiBzdWJTY2hlbWE7XG59XG5cbi8qKlxuICogJ3JlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMnIGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIGEgSlNPTiBQb2ludGVyIGFnYWluc3QgYSBtYXAgb2YgcmVjdXJzaXZlIHJlZmVyZW5jZXMgYW5kIHJldHVybnNcbiAqIGEgSlNPTiBQb2ludGVyIHRvIHRoZSBzaGFsbG93ZXN0IGVxdWl2YWxlbnQgbG9jYXRpb24gaW4gdGhlIHNhbWUgb2JqZWN0LlxuICpcbiAqIFVzaW5nIHRoaXMgZnVuY3Rpb25zIGVuYWJsZXMgYW4gb2JqZWN0IHRvIGJlIGNvbnN0cnVjdGVkIHdpdGggdW5saW1pdGVkXG4gKiByZWN1cnNpb24sIHdoaWxlIG1haW50YWluZyBhIGZpeGVkIHNldCBvZiBtZXRhZGF0YSwgc3VjaCBhcyBmaWVsZCBkYXRhIHR5cGVzLlxuICogVGhlIG9iamVjdCBjYW4gZ3JvdyBhcyBsYXJnZSBhcyBpdCB3YW50cywgYW5kIGRlZXBseSByZWN1cnNlZCBub2RlcyBjYW5cbiAqIGp1c3QgcmVmZXIgdG8gdGhlIG1ldGFkYXRhIGZvciB0aGVpciBzaGFsbG93IGVxdWl2YWxlbnRzLCBpbnN0ZWFkIG9mIGhhdmluZ1xuICogdG8gYWRkIGFkZGl0aW9uYWwgcmVkdW5kYW50IG1ldGFkYXRhIGZvciBlYWNoIHJlY3Vyc2l2ZWx5IGFkZGVkIG5vZGUuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBwb2ludGVyOiAgICAgICAgICcvc3R1ZmYvYW5kL21vcmUvYW5kL21vcmUvYW5kL21vcmUvYW5kL21vcmUvc3R1ZmYnXG4gKiByZWN1cnNpdmVSZWZNYXA6IFtbJy9zdHVmZi9hbmQvbW9yZS9hbmQvbW9yZScsICcvc3R1ZmYvYW5kL21vcmUvJ11dXG4gKiByZXR1cm5lZDogICAgICAgICcvc3R1ZmYvYW5kL21vcmUvc3R1ZmYnXG4gKlxuICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC1cbiAqIEBwYXJhbSAgeyBNYXA8c3RyaW5nLCBzdHJpbmc+IH0gcmVjdXJzaXZlUmVmTWFwIC1cbiAqIEBwYXJhbSAgeyBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpIH0gYXJyYXlNYXAgLSBvcHRpb25hbFxuICogQHJldHVybiB7IHN0cmluZyB9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gIHBvaW50ZXIsIHJlY3Vyc2l2ZVJlZk1hcCwgYXJyYXlNYXAgPSBuZXcgTWFwKClcbikge1xuICBpZiAoIXBvaW50ZXIpIHsgcmV0dXJuICcnOyB9XG4gIGxldCBnZW5lcmljUG9pbnRlciA9XG4gICAgSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihKc29uUG9pbnRlci5jb21waWxlKHBvaW50ZXIpLCBhcnJheU1hcCk7XG4gIGlmIChnZW5lcmljUG9pbnRlci5pbmRleE9mKCcvJykgPT09IC0xKSB7IHJldHVybiBnZW5lcmljUG9pbnRlcjsgfVxuICBsZXQgcG9zc2libGVSZWZlcmVuY2VzID0gdHJ1ZTtcbiAgd2hpbGUgKHBvc3NpYmxlUmVmZXJlbmNlcykge1xuICAgIHBvc3NpYmxlUmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgIHJlY3Vyc2l2ZVJlZk1hcC5mb3JFYWNoKCh0b1BvaW50ZXIsIGZyb21Qb2ludGVyKSA9PiB7XG4gICAgICBpZiAoSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUG9pbnRlciwgZnJvbVBvaW50ZXIpKSB7XG4gICAgICAgIHdoaWxlIChKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIoZnJvbVBvaW50ZXIsIGdlbmVyaWNQb2ludGVyLCB0cnVlKSkge1xuICAgICAgICAgIGdlbmVyaWNQb2ludGVyID0gSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihcbiAgICAgICAgICAgIHRvUG9pbnRlciArIGdlbmVyaWNQb2ludGVyLnNsaWNlKGZyb21Qb2ludGVyLmxlbmd0aCksIGFycmF5TWFwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBwb3NzaWJsZVJlZmVyZW5jZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGdlbmVyaWNQb2ludGVyO1xufVxuXG4vKipcbiAqICdnZXRJbnB1dFR5cGUnIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICB7IGFueSB9IHNjaGVtYVxuICogQHBhcmFtICB7IGFueSA9IG51bGwgfSBsYXlvdXROb2RlXG4gKiBAcmV0dXJuIHsgc3RyaW5nIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0VHlwZShzY2hlbWEsIGxheW91dE5vZGU6IGFueSA9IG51bGwpIHtcbiAgLy8geC1zY2hlbWEtZm9ybSA9IEFuZ3VsYXIgU2NoZW1hIEZvcm0gY29tcGF0aWJpbGl0eVxuICAvLyB3aWRnZXQgJiBjb21wb25lbnQgPSBSZWFjdCBKc29uc2NoZW1hIEZvcm0gY29tcGF0aWJpbGl0eVxuICBjb25zdCBjb250cm9sVHlwZSA9IEpzb25Qb2ludGVyLmdldEZpcnN0KFtcbiAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vdHlwZSddLFxuICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQvY29tcG9uZW50J10sXG4gICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3dpZGdldCddLFxuICAgIFtzY2hlbWEsICcvd2lkZ2V0L2NvbXBvbmVudCddLFxuICAgIFtzY2hlbWEsICcvd2lkZ2V0J11cbiAgXSk7XG4gIGlmIChpc1N0cmluZyhjb250cm9sVHlwZSkpIHsgcmV0dXJuIGNoZWNrSW5saW5lVHlwZShjb250cm9sVHlwZSwgc2NoZW1hLCBsYXlvdXROb2RlKTsgfVxuICBsZXQgc2NoZW1hVHlwZSA9IHNjaGVtYS50eXBlO1xuICBpZiAoc2NoZW1hVHlwZSkge1xuICAgIGlmIChpc0FycmF5KHNjaGVtYVR5cGUpKSB7IC8vIElmIG11bHRpcGxlIHR5cGVzIGxpc3RlZCwgdXNlIG1vc3QgaW5jbHVzaXZlIHR5cGVcbiAgICAgIHNjaGVtYVR5cGUgPVxuICAgICAgICBpbkFycmF5KCdvYmplY3QnLCBzY2hlbWFUeXBlKSAmJiBoYXNPd24oc2NoZW1hLCAncHJvcGVydGllcycpID8gJ29iamVjdCcgOlxuICAgICAgICBpbkFycmF5KCdhcnJheScsIHNjaGVtYVR5cGUpICYmIGhhc093bihzY2hlbWEsICdpdGVtcycpID8gJ2FycmF5JyA6XG4gICAgICAgIGluQXJyYXkoJ2FycmF5Jywgc2NoZW1hVHlwZSkgJiYgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxJdGVtcycpID8gJ2FycmF5JyA6XG4gICAgICAgIGluQXJyYXkoJ3N0cmluZycsIHNjaGVtYVR5cGUpID8gJ3N0cmluZycgOlxuICAgICAgICBpbkFycmF5KCdudW1iZXInLCBzY2hlbWFUeXBlKSA/ICdudW1iZXInIDpcbiAgICAgICAgaW5BcnJheSgnaW50ZWdlcicsIHNjaGVtYVR5cGUpID8gJ2ludGVnZXInIDpcbiAgICAgICAgaW5BcnJheSgnYm9vbGVhbicsIHNjaGVtYVR5cGUpID8gJ2Jvb2xlYW4nIDogJ3Vua25vd24nO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ2Jvb2xlYW4nKSB7IHJldHVybiAnY2hlY2tib3gnOyB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSB8fCBoYXNPd24oc2NoZW1hLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKSkge1xuICAgICAgICByZXR1cm4gJ3NlY3Rpb24nO1xuICAgICAgfVxuICAgICAgLy8gVE9ETzogRmlndXJlIG91dCBob3cgdG8gaGFuZGxlIGFkZGl0aW9uYWxQcm9wZXJ0aWVzXG4gICAgICBpZiAoaGFzT3duKHNjaGVtYSwgJyRyZWYnKSkgeyByZXR1cm4gJyRyZWYnOyB9XG4gICAgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnYXJyYXknKSB7XG4gICAgICBjb25zdCBpdGVtc09iamVjdCA9IEpzb25Qb2ludGVyLmdldEZpcnN0KFtcbiAgICAgICAgW3NjaGVtYSwgJy9pdGVtcyddLFxuICAgICAgICBbc2NoZW1hLCAnL2FkZGl0aW9uYWxJdGVtcyddXG4gICAgICBdKSB8fCB7fTtcbiAgICAgIHJldHVybiBoYXNPd24oaXRlbXNPYmplY3QsICdlbnVtJykgJiYgc2NoZW1hLm1heEl0ZW1zICE9PSAxID9cbiAgICAgICAgY2hlY2tJbmxpbmVUeXBlKCdjaGVja2JveGVzJywgc2NoZW1hLCBsYXlvdXROb2RlKSA6ICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnbnVsbCcpIHsgcmV0dXJuICdub25lJzsgfVxuICAgIGlmIChKc29uUG9pbnRlci5oYXMobGF5b3V0Tm9kZSwgJy9vcHRpb25zL3RpdGxlTWFwJykgfHxcbiAgICAgIGhhc093bihzY2hlbWEsICdlbnVtJykgfHwgZ2V0VGl0bGVNYXBGcm9tT25lT2Yoc2NoZW1hLCBudWxsLCB0cnVlKVxuICAgICkgeyByZXR1cm4gJ3NlbGVjdCc7IH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ251bWJlcicgfHwgc2NoZW1hVHlwZSA9PT0gJ2ludGVnZXInKSB7XG4gICAgICByZXR1cm4gKHNjaGVtYVR5cGUgPT09ICdpbnRlZ2VyJyB8fCBoYXNPd24oc2NoZW1hLCAnbXVsdGlwbGVPZicpKSAmJlxuICAgICAgICBoYXNPd24oc2NoZW1hLCAnbWF4aW11bScpICYmIGhhc093bihzY2hlbWEsICdtaW5pbXVtJykgPyAncmFuZ2UnIDogc2NoZW1hVHlwZTtcbiAgICB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAnY29sb3InOiAnY29sb3InLFxuICAgICAgICAnZGF0ZSc6ICdkYXRlJyxcbiAgICAgICAgJ2RhdGUtdGltZSc6ICdkYXRldGltZS1sb2NhbCcsXG4gICAgICAgICdlbWFpbCc6ICdlbWFpbCcsXG4gICAgICAgICd1cmknOiAndXJsJyxcbiAgICAgIH1bc2NoZW1hLmZvcm1hdF0gfHwgJ3RleHQnO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzT3duKHNjaGVtYSwgJyRyZWYnKSkgeyByZXR1cm4gJyRyZWYnOyB9XG4gIGlmIChpc0FycmF5KHNjaGVtYS5vbmVPZikgfHwgaXNBcnJheShzY2hlbWEuYW55T2YpKSB7IHJldHVybiAnb25lLW9mJzsgfVxuICBjb25zb2xlLmVycm9yKGBnZXRJbnB1dFR5cGUgZXJyb3I6IFVuYWJsZSB0byBkZXRlcm1pbmUgaW5wdXQgdHlwZSBmb3IgJHtzY2hlbWFUeXBlfWApO1xuICBjb25zb2xlLmVycm9yKCdzY2hlbWEnLCBzY2hlbWEpO1xuICBpZiAobGF5b3V0Tm9kZSkgeyBjb25zb2xlLmVycm9yKCdsYXlvdXROb2RlJywgbGF5b3V0Tm9kZSk7IH1cbiAgcmV0dXJuICdub25lJztcbn1cblxuLyoqXG4gKiAnY2hlY2tJbmxpbmVUeXBlJyBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBsYXlvdXQgYW5kIHNjaGVtYSBub2RlcyBmb3IgJ2lubGluZTogdHJ1ZScsIGFuZCBjb252ZXJ0c1xuICogJ3JhZGlvcycgb3IgJ2NoZWNrYm94ZXMnIHRvICdyYWRpb3MtaW5saW5lJyBvciAnY2hlY2tib3hlcy1pbmxpbmUnXG4gKlxuICogQHBhcmFtICB7IHN0cmluZyB9IGNvbnRyb2xUeXBlIC1cbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWEgLVxuICogQHBhcmFtICB7IGFueSA9IG51bGwgfSBsYXlvdXROb2RlIC1cbiAqIEByZXR1cm4geyBzdHJpbmcgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJbmxpbmVUeXBlKGNvbnRyb2xUeXBlLCBzY2hlbWEsIGxheW91dE5vZGU6IGFueSA9IG51bGwpIHtcbiAgaWYgKCFpc1N0cmluZyhjb250cm9sVHlwZSkgfHwgKFxuICAgIGNvbnRyb2xUeXBlLnNsaWNlKDAsIDgpICE9PSAnY2hlY2tib3gnICYmIGNvbnRyb2xUeXBlLnNsaWNlKDAsIDUpICE9PSAncmFkaW8nXG4gICkpIHtcbiAgICByZXR1cm4gY29udHJvbFR5cGU7XG4gIH1cbiAgaWYgKFxuICAgIEpzb25Qb2ludGVyLmdldEZpcnN0KFtcbiAgICAgIFtsYXlvdXROb2RlLCAnL2lubGluZSddLFxuICAgICAgW2xheW91dE5vZGUsICcvb3B0aW9ucy9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vb3B0aW9ucy9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudC9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQvY29tcG9uZW50L29wdGlvbnMvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3dpZGdldC9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcvd2lkZ2V0L2NvbXBvbmVudC9pbmxpbmUnXSxcbiAgICAgIFtzY2hlbWEsICcvd2lkZ2V0L2NvbXBvbmVudC9vcHRpb25zL2lubGluZSddLFxuICAgIF0pID09PSB0cnVlXG4gICkge1xuICAgIHJldHVybiBjb250cm9sVHlwZS5zbGljZSgwLCA1KSA9PT0gJ3JhZGlvJyA/XG4gICAgICAncmFkaW9zLWlubGluZScgOiAnY2hlY2tib3hlcy1pbmxpbmUnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb250cm9sVHlwZTtcbiAgfVxufVxuXG4vKipcbiAqICdpc0lucHV0UmVxdWlyZWQnIGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIGEgSlNPTiBTY2hlbWEgdG8gc2VlIGlmIGFuIGl0ZW0gaXMgcmVxdWlyZWRcbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hIC0gdGhlIHNjaGVtYSB0byBjaGVja1xuICogQHBhcmFtICB7IHN0cmluZyB9IHNjaGVtYVBvaW50ZXIgLSB0aGUgcG9pbnRlciB0byB0aGUgaXRlbSB0byBjaGVja1xuICogQHJldHVybiB7IGJvb2xlYW4gfSAtIHRydWUgaWYgdGhlIGl0ZW0gaXMgcmVxdWlyZWQsIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnB1dFJlcXVpcmVkKHNjaGVtYSwgc2NoZW1hUG9pbnRlcikge1xuICBpZiAoIWlzT2JqZWN0KHNjaGVtYSkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdpc0lucHV0UmVxdWlyZWQgZXJyb3I6IElucHV0IHNjaGVtYSBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgbGlzdFBvaW50ZXJBcnJheSA9IEpzb25Qb2ludGVyLnBhcnNlKHNjaGVtYVBvaW50ZXIpO1xuICBpZiAoaXNBcnJheShsaXN0UG9pbnRlckFycmF5KSkge1xuICAgIGlmICghbGlzdFBvaW50ZXJBcnJheS5sZW5ndGgpIHsgcmV0dXJuIHNjaGVtYS5yZXF1aXJlZCA9PT0gdHJ1ZTsgfVxuICAgIGNvbnN0IGtleU5hbWUgPSBsaXN0UG9pbnRlckFycmF5LnBvcCgpO1xuICAgIGNvbnN0IG5leHRUb0xhc3RLZXkgPSBsaXN0UG9pbnRlckFycmF5W2xpc3RQb2ludGVyQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgaWYgKFsncHJvcGVydGllcycsICdhZGRpdGlvbmFsUHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycsICdpdGVtcycsICdhZGRpdGlvbmFsSXRlbXMnXVxuICAgICAgLmluY2x1ZGVzKG5leHRUb0xhc3RLZXkpXG4gICAgKSB7XG4gICAgICBsaXN0UG9pbnRlckFycmF5LnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCBwYXJlbnRTY2hlbWEgPSBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCBsaXN0UG9pbnRlckFycmF5KSB8fCB7fTtcbiAgICBpZiAoaXNBcnJheShwYXJlbnRTY2hlbWEucmVxdWlyZWQpKSB7XG4gICAgICByZXR1cm4gcGFyZW50U2NoZW1hLnJlcXVpcmVkLmluY2x1ZGVzKGtleU5hbWUpO1xuICAgIH1cbiAgICBpZiAocGFyZW50U2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgIHJldHVybiBoYXNPd24ocGFyZW50U2NoZW1hLCAnbWluSXRlbXMnKSAmJlxuICAgICAgICBpc051bWJlcihrZXlOYW1lKSAmJlxuICAgICAgICArcGFyZW50U2NoZW1hLm1pbkl0ZW1zID4gK2tleU5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiAndXBkYXRlSW5wdXRPcHRpb25zJyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBsYXlvdXROb2RlXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hXG4gKiBAcGFyYW0gIHsgYW55IH0ganNmXG4gKiBAcmV0dXJuIHsgdm9pZCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVJbnB1dE9wdGlvbnMobGF5b3V0Tm9kZSwgc2NoZW1hLCBqc2YpIHtcbiAgaWYgKCFpc09iamVjdChsYXlvdXROb2RlKSB8fCAhaXNPYmplY3QobGF5b3V0Tm9kZS5vcHRpb25zKSkgeyByZXR1cm47IH1cblxuICAvLyBTZXQgYWxsIG9wdGlvbiB2YWx1ZXMgaW4gbGF5b3V0Tm9kZS5vcHRpb25zXG4gIGNvbnN0IG5ld09wdGlvbnM6IGFueSA9IHsgfTtcbiAgY29uc3QgZml4VWlLZXlzID0ga2V5ID0+IGtleS5zbGljZSgwLCAzKS50b0xvd2VyQ2FzZSgpID09PSAndWk6JyA/IGtleS5zbGljZSgzKSA6IGtleTtcbiAgbWVyZ2VGaWx0ZXJlZE9iamVjdChuZXdPcHRpb25zLCBqc2YuZm9ybU9wdGlvbnMuZGVmYXV0V2lkZ2V0T3B0aW9ucywgW10sIGZpeFVpS2V5cyk7XG4gIFsgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldC9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3VpOndpZGdldCcpLCBbXSBdLFxuICAgIFsgc2NoZW1hLCBbXG4gICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJywgJ3Byb3BlcnRpZXMnLCAnaXRlbXMnLFxuICAgICAgJ3JlcXVpcmVkJywgJ3R5cGUnLCAneC1zY2hlbWEtZm9ybScsICckcmVmJ1xuICAgIF0gXSxcbiAgICBbIEpzb25Qb2ludGVyLmdldChzY2hlbWEsICcveC1zY2hlbWEtZm9ybS9vcHRpb25zJyksIFtdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0nKSwgWydpdGVtcycsICdvcHRpb25zJ10gXSxcbiAgICBbIGxheW91dE5vZGUsIFtcbiAgICAgICdfaWQnLCAnJHJlZicsICdhcnJheUl0ZW0nLCAnYXJyYXlJdGVtVHlwZScsICdkYXRhUG9pbnRlcicsICdkYXRhVHlwZScsXG4gICAgICAnaXRlbXMnLCAna2V5JywgJ25hbWUnLCAnb3B0aW9ucycsICdyZWN1cnNpdmVSZWZlcmVuY2UnLCAndHlwZScsICd3aWRnZXQnXG4gICAgXSBdLFxuICAgIFsgbGF5b3V0Tm9kZS5vcHRpb25zLCBbXSBdLFxuICBdLmZvckVhY2goKFsgb2JqZWN0LCBleGNsdWRlS2V5cyBdKSA9PlxuICAgIG1lcmdlRmlsdGVyZWRPYmplY3QobmV3T3B0aW9ucywgb2JqZWN0LCBleGNsdWRlS2V5cywgZml4VWlLZXlzKVxuICApO1xuICBpZiAoIWhhc093bihuZXdPcHRpb25zLCAndGl0bGVNYXAnKSkge1xuICAgIGxldCBuZXdUaXRsZU1hcDogYW55ID0gbnVsbDtcbiAgICBuZXdUaXRsZU1hcCA9IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYSwgbmV3T3B0aW9ucy5mbGF0TGlzdCk7XG4gICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgIGlmICghaGFzT3duKG5ld09wdGlvbnMsICd0aXRsZU1hcCcpICYmICFoYXNPd24obmV3T3B0aW9ucywgJ2VudW0nKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSkge1xuICAgICAgaWYgKEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvdGl0bGVNYXAnKSkge1xuICAgICAgICBuZXdPcHRpb25zLnRpdGxlTWFwID0gc2NoZW1hLml0ZW1zLnRpdGxlTWFwO1xuICAgICAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMoc2NoZW1hLCAnL2l0ZW1zL2VudW0nKSkge1xuICAgICAgICBuZXdPcHRpb25zLmVudW0gPSBzY2hlbWEuaXRlbXMuZW51bTtcbiAgICAgICAgaWYgKCFoYXNPd24obmV3T3B0aW9ucywgJ2VudW1OYW1lcycpICYmIEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvZW51bU5hbWVzJykpIHtcbiAgICAgICAgICBuZXdPcHRpb25zLmVudW1OYW1lcyA9IHNjaGVtYS5pdGVtcy5lbnVtTmFtZXM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKHNjaGVtYSwgJy9pdGVtcy9vbmVPZicpKSB7XG4gICAgICAgIG5ld1RpdGxlTWFwID0gZ2V0VGl0bGVNYXBGcm9tT25lT2Yoc2NoZW1hLml0ZW1zLCBuZXdPcHRpb25zLmZsYXRMaXN0KTtcbiAgICAgICAgaWYgKG5ld1RpdGxlTWFwKSB7IG5ld09wdGlvbnMudGl0bGVNYXAgPSBuZXdUaXRsZU1hcDsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHNjaGVtYSB0eXBlIGlzIGludGVnZXIsIGVuZm9yY2UgYnkgc2V0dGluZyBtdWx0aXBsZU9mID0gMVxuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdpbnRlZ2VyJyAmJiAhaGFzVmFsdWUobmV3T3B0aW9ucy5tdWx0aXBsZU9mKSkge1xuICAgIG5ld09wdGlvbnMubXVsdGlwbGVPZiA9IDE7XG4gIH1cblxuICAvLyBDb3B5IGFueSB0eXBlYWhlYWQgd29yZCBsaXN0cyB0byBvcHRpb25zLnR5cGVhaGVhZC5zb3VyY2VcbiAgaWYgKEpzb25Qb2ludGVyLmhhcyhuZXdPcHRpb25zLCAnL2F1dG9jb21wbGV0ZS9zb3VyY2UnKSkge1xuICAgIG5ld09wdGlvbnMudHlwZWFoZWFkID0gbmV3T3B0aW9ucy5hdXRvY29tcGxldGU7XG4gIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKG5ld09wdGlvbnMsICcvdGFnc2lucHV0L3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dDtcbiAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5oYXMobmV3T3B0aW9ucywgJy90YWdzaW5wdXQvdHlwZWFoZWFkL3NvdXJjZScpKSB7XG4gICAgbmV3T3B0aW9ucy50eXBlYWhlYWQgPSBuZXdPcHRpb25zLnRhZ3NpbnB1dC50eXBlYWhlYWQ7XG4gIH1cblxuICBsYXlvdXROb2RlLm9wdGlvbnMgPSBuZXdPcHRpb25zO1xufVxuXG4vKipcbiAqICdnZXRUaXRsZU1hcEZyb21PbmVPZicgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHsgc2NoZW1hIH0gc2NoZW1hXG4gKiBAcGFyYW0gIHsgYm9vbGVhbiA9IG51bGwgfSBmbGF0TGlzdFxuICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IHZhbGlkYXRlT25seVxuICogQHJldHVybiB7IHZhbGlkYXRvcnMgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGl0bGVNYXBGcm9tT25lT2YoXG4gIHNjaGVtYTogYW55ID0ge30sIGZsYXRMaXN0OiBib29sZWFuID0gbnVsbCwgdmFsaWRhdGVPbmx5ID0gZmFsc2Vcbikge1xuICBsZXQgdGl0bGVNYXAgPSBudWxsO1xuICBjb25zdCBvbmVPZiA9IHNjaGVtYS5vbmVPZiB8fCBzY2hlbWEuYW55T2YgfHwgbnVsbDtcbiAgaWYgKGlzQXJyYXkob25lT2YpICYmIG9uZU9mLmV2ZXJ5KGl0ZW0gPT4gaXRlbS50aXRsZSkpIHtcbiAgICBpZiAob25lT2YuZXZlcnkoaXRlbSA9PiBpc0FycmF5KGl0ZW0uZW51bSkgJiYgaXRlbS5lbnVtLmxlbmd0aCA9PT0gMSkpIHtcbiAgICAgIGlmICh2YWxpZGF0ZU9ubHkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIHRpdGxlTWFwID0gb25lT2YubWFwKGl0ZW0gPT4gKHsgbmFtZTogaXRlbS50aXRsZSwgdmFsdWU6IGl0ZW0uZW51bVswXSB9KSk7XG4gICAgfSBlbHNlIGlmIChvbmVPZi5ldmVyeShpdGVtID0+IGl0ZW0uY29uc3QpKSB7XG4gICAgICBpZiAodmFsaWRhdGVPbmx5KSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB0aXRsZU1hcCA9IG9uZU9mLm1hcChpdGVtID0+ICh7IG5hbWU6IGl0ZW0udGl0bGUsIHZhbHVlOiBpdGVtLmNvbnN0IH0pKTtcbiAgICB9XG5cbiAgICAvLyBpZiBmbGF0TGlzdCAhPT0gZmFsc2UgYW5kIHNvbWUgaXRlbXMgaGF2ZSBjb2xvbnMsIG1ha2UgZ3JvdXBlZCBtYXBcbiAgICBpZiAoZmxhdExpc3QgIT09IGZhbHNlICYmICh0aXRsZU1hcCB8fCBbXSlcbiAgICAgIC5maWx0ZXIodGl0bGUgPT4gKCh0aXRsZSB8fCB7fSkubmFtZSB8fCAnJykuaW5kZXhPZignOiAnKSkubGVuZ3RoID4gMVxuICAgICkge1xuXG4gICAgICAvLyBTcGxpdCBuYW1lIG9uIGZpcnN0IGNvbG9uIHRvIGNyZWF0ZSBncm91cGVkIG1hcCAobmFtZSAtPiBncm91cDogbmFtZSlcbiAgICAgIGNvbnN0IG5ld1RpdGxlTWFwID0gdGl0bGVNYXAubWFwKHRpdGxlID0+IHtcbiAgICAgICAgY29uc3QgW2dyb3VwLCBuYW1lXSA9IHRpdGxlLm5hbWUuc3BsaXQoLzogKC4rKS8pO1xuICAgICAgICByZXR1cm4gZ3JvdXAgJiYgbmFtZSA/IHsgLi4udGl0bGUsIGdyb3VwLCBuYW1lIH0gOiB0aXRsZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiBmbGF0TGlzdCA9PT0gdHJ1ZSBvciBhdCBsZWFzdCBvbmUgZ3JvdXAgaGFzIG11bHRpcGxlIGl0ZW1zLCB1c2UgZ3JvdXBlZCBtYXBcbiAgICAgIGlmIChmbGF0TGlzdCA9PT0gdHJ1ZSB8fCBuZXdUaXRsZU1hcC5zb21lKCh0aXRsZSwgaW5kZXgpID0+IGluZGV4ICYmXG4gICAgICAgIGhhc093bih0aXRsZSwgJ2dyb3VwJykgJiYgdGl0bGUuZ3JvdXAgPT09IG5ld1RpdGxlTWFwW2luZGV4IC0gMV0uZ3JvdXBcbiAgICAgICkpIHtcbiAgICAgICAgdGl0bGVNYXAgPSBuZXdUaXRsZU1hcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbGlkYXRlT25seSA/IGZhbHNlIDogdGl0bGVNYXA7XG59XG5cbi8qKlxuICogJ2dldENvbnRyb2xWYWxpZGF0b3JzJyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7IGFueSB9IHNjaGVtYVxuICogQHJldHVybiB7IHZhbGlkYXRvcnMgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbFZhbGlkYXRvcnMoc2NoZW1hKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkgeyByZXR1cm4gbnVsbDsgfVxuICBjb25zdCB2YWxpZGF0b3JzOiBhbnkgPSB7IH07XG4gIGlmIChoYXNPd24oc2NoZW1hLCAndHlwZScpKSB7XG4gICAgc3dpdGNoIChzY2hlbWEudHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgZm9yRWFjaChbJ3BhdHRlcm4nLCAnZm9ybWF0JywgJ21pbkxlbmd0aCcsICdtYXhMZW5ndGgnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOiBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgZm9yRWFjaChbJ01pbmltdW0nLCAnTWF4aW11bSddLCAodWNMaW1pdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVMaW1pdCA9ICdleGNsdXNpdmUnICsgdWNMaW1pdDtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IHVjTGltaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgbGltaXQpKSB7XG4gICAgICAgICAgICBjb25zdCBleGNsdXNpdmUgPSBoYXNPd24oc2NoZW1hLCBlTGltaXQpICYmIHNjaGVtYVtlTGltaXRdID09PSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdG9yc1tsaW1pdF0gPSBbc2NoZW1hW2xpbWl0XSwgZXhjbHVzaXZlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmb3JFYWNoKFsnbXVsdGlwbGVPZicsICd0eXBlJ10sIChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIHByb3ApKSB7IHZhbGlkYXRvcnNbcHJvcF0gPSBbc2NoZW1hW3Byb3BdXTsgfVxuICAgICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZm9yRWFjaChbJ21pblByb3BlcnRpZXMnLCAnbWF4UHJvcGVydGllcycsICdkZXBlbmRlbmNpZXMnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGZvckVhY2goWydtaW5JdGVtcycsICdtYXhJdGVtcycsICd1bmlxdWVJdGVtcyddLCAocHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBwcm9wKSkgeyB2YWxpZGF0b3JzW3Byb3BdID0gW3NjaGVtYVtwcm9wXV07IH1cbiAgICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGhhc093bihzY2hlbWEsICdlbnVtJykpIHsgdmFsaWRhdG9ycy5lbnVtID0gW3NjaGVtYS5lbnVtXTsgfVxuICByZXR1cm4gdmFsaWRhdG9ycztcbn1cblxuLyoqXG4gKiAncmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMnIGZ1bmN0aW9uXG4gKlxuICogRmluZCBhbGwgJHJlZiBsaW5rcyBpbiBzY2hlbWEgYW5kIHNhdmUgbGlua3MgYW5kIHJlZmVyZW5jZWQgc2NoZW1hcyBpblxuICogc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBhbmQgZGF0YVJlY3Vyc2l2ZVJlZk1hcFxuICpcbiAqIEBwYXJhbSB7IGFueSB9IHNjaGVtYVxuICogQHBhcmFtIHsgYW55IH0gc2NoZW1hUmVmTGlicmFyeVxuICogQHBhcmFtIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICogQHBhcmFtIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IGRhdGFSZWN1cnNpdmVSZWZNYXBcbiAqIEBwYXJhbSB7IE1hcDxzdHJpbmcsIG51bWJlcj4gfSBhcnJheU1hcFxuICogQHJldHVybiB7IGFueSB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlU2NoZW1hUmVmZXJlbmNlcyhcbiAgc2NoZW1hLCBzY2hlbWFSZWZMaWJyYXJ5LCBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsIGRhdGFSZWN1cnNpdmVSZWZNYXAsIGFycmF5TWFwXG4pIHtcbiAgaWYgKCFpc09iamVjdChzY2hlbWEpKSB7XG4gICAgY29uc29sZS5lcnJvcigncmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMgZXJyb3I6IHNjaGVtYSBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcmVmTGlua3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcmVmTWFwU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHJlZk1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IHJlY3Vyc2l2ZVJlZk1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IHJlZkxpYnJhcnk6IGFueSA9IHt9O1xuXG4gIC8vIFNlYXJjaCBzY2hlbWEgZm9yIGFsbCAkcmVmIGxpbmtzLCBhbmQgYnVpbGQgZnVsbCByZWZMaWJyYXJ5XG4gIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwKHNjaGVtYSwgKHN1YlNjaGVtYSwgc3ViU2NoZW1hUG9pbnRlcikgPT4ge1xuICAgIGlmIChoYXNPd24oc3ViU2NoZW1hLCAnJHJlZicpICYmIGlzU3RyaW5nKHN1YlNjaGVtYVsnJHJlZiddKSkge1xuICAgICAgY29uc3QgcmVmUG9pbnRlciA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc3ViU2NoZW1hWyckcmVmJ10pO1xuICAgICAgcmVmTGlua3MuYWRkKHJlZlBvaW50ZXIpO1xuICAgICAgcmVmTWFwU2V0LmFkZChzdWJTY2hlbWFQb2ludGVyICsgJ35+JyArIHJlZlBvaW50ZXIpO1xuICAgICAgcmVmTWFwLnNldChzdWJTY2hlbWFQb2ludGVyLCByZWZQb2ludGVyKTtcbiAgICB9XG4gIH0pO1xuICByZWZMaW5rcy5mb3JFYWNoKHJlZiA9PiByZWZMaWJyYXJ5W3JlZl0gPSBnZXRTdWJTY2hlbWEoc2NoZW1hLCByZWYpKTtcblxuICAvLyBGb2xsb3cgYWxsIHJlZiBsaW5rcyBhbmQgc2F2ZSBpbiByZWZNYXBTZXQsXG4gIC8vIHRvIGZpbmQgYW55IG11bHRpLWxpbmsgcmVjdXJzaXZlIHJlZmVybmNlc1xuICBsZXQgY2hlY2tSZWZMaW5rcyA9IHRydWU7XG4gIHdoaWxlIChjaGVja1JlZkxpbmtzKSB7XG4gICAgY2hlY2tSZWZMaW5rcyA9IGZhbHNlO1xuICAgIEFycmF5LmZyb20ocmVmTWFwKS5mb3JFYWNoKChbZnJvbVJlZjEsIHRvUmVmMV0pID0+IEFycmF5LmZyb20ocmVmTWFwKVxuICAgICAgLmZpbHRlcigoW2Zyb21SZWYyLCB0b1JlZjJdKSA9PlxuICAgICAgICBKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYxLCBmcm9tUmVmMiwgdHJ1ZSkgJiZcbiAgICAgICAgIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcih0b1JlZjIsIHRvUmVmMSwgdHJ1ZSkgJiZcbiAgICAgICAgIXJlZk1hcFNldC5oYXMoZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSArICd+ficgKyB0b1JlZjIpXG4gICAgICApXG4gICAgICAuZm9yRWFjaCgoW2Zyb21SZWYyLCB0b1JlZjJdKSA9PiB7XG4gICAgICAgIHJlZk1hcFNldC5hZGQoZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSArICd+ficgKyB0b1JlZjIpO1xuICAgICAgICBjaGVja1JlZkxpbmtzID0gdHJ1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8vIEJ1aWxkIGZ1bGwgcmVjdXJzaXZlUmVmTWFwXG4gIC8vIEZpcnN0IHBhc3MgLSBzYXZlIGFsbCBpbnRlcm5hbGx5IHJlY3Vyc2l2ZSByZWZzIGZyb20gcmVmTWFwU2V0XG4gIEFycmF5LmZyb20ocmVmTWFwU2V0KVxuICAgIC5tYXAocmVmTGluayA9PiByZWZMaW5rLnNwbGl0KCd+ficpKVxuICAgIC5maWx0ZXIoKFtmcm9tUmVmLCB0b1JlZl0pID0+IEpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcih0b1JlZiwgZnJvbVJlZikpXG4gICAgLmZvckVhY2goKFtmcm9tUmVmLCB0b1JlZl0pID0+IHJlY3Vyc2l2ZVJlZk1hcC5zZXQoZnJvbVJlZiwgdG9SZWYpKTtcbiAgLy8gU2Vjb25kIHBhc3MgLSBjcmVhdGUgcmVjdXJzaXZlIHZlcnNpb25zIG9mIGFueSBvdGhlciByZWZzIHRoYXQgbGluayB0byByZWN1cnNpdmUgcmVmc1xuICBBcnJheS5mcm9tKHJlZk1hcClcbiAgICAuZmlsdGVyKChbZnJvbVJlZjEsIHRvUmVmMV0pID0+IEFycmF5LmZyb20ocmVjdXJzaXZlUmVmTWFwLmtleXMoKSlcbiAgICAgIC5ldmVyeShmcm9tUmVmMiA9PiAhSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKGZyb21SZWYxLCBmcm9tUmVmMiwgdHJ1ZSkpXG4gICAgKVxuICAgIC5mb3JFYWNoKChbZnJvbVJlZjEsIHRvUmVmMV0pID0+IEFycmF5LmZyb20ocmVjdXJzaXZlUmVmTWFwKVxuICAgICAgLmZpbHRlcigoW2Zyb21SZWYyLCB0b1JlZjJdKSA9PlxuICAgICAgICAhcmVjdXJzaXZlUmVmTWFwLmhhcyhmcm9tUmVmMSArIGZyb21SZWYyLnNsaWNlKHRvUmVmMS5sZW5ndGgpKSAmJlxuICAgICAgICBKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYxLCBmcm9tUmVmMiwgdHJ1ZSkgJiZcbiAgICAgICAgIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcih0b1JlZjEsIGZyb21SZWYxLCB0cnVlKVxuICAgICAgKVxuICAgICAgLmZvckVhY2goKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT4gcmVjdXJzaXZlUmVmTWFwLnNldChcbiAgICAgICAgZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSxcbiAgICAgICAgZnJvbVJlZjEgKyB0b1JlZjIuc2xpY2UodG9SZWYxLmxlbmd0aClcbiAgICAgICkpXG4gICAgKTtcblxuICAvLyBDcmVhdGUgY29tcGlsZWQgc2NoZW1hIGJ5IHJlcGxhY2luZyBhbGwgbm9uLXJlY3Vyc2l2ZSAkcmVmIGxpbmtzIHdpdGhcbiAgLy8gdGhpZWlyIGxpbmtlZCBzY2hlbWFzIGFuZCwgd2hlcmUgcG9zc2libGUsIGNvbWJpbmluZyBzY2hlbWFzIGluIGFsbE9mIGFycmF5cy5cbiAgbGV0IGNvbXBpbGVkU2NoZW1hID0geyAuLi5zY2hlbWEgfTtcbiAgZGVsZXRlIGNvbXBpbGVkU2NoZW1hLmRlZmluaXRpb25zO1xuICBjb21waWxlZFNjaGVtYSA9XG4gICAgZ2V0U3ViU2NoZW1hKGNvbXBpbGVkU2NoZW1hLCAnJywgcmVmTGlicmFyeSwgcmVjdXJzaXZlUmVmTWFwKTtcblxuICAvLyBNYWtlIHN1cmUgYWxsIHJlbWFpbmluZyBzY2hlbWEgJHJlZnMgYXJlIHJlY3Vyc2l2ZSwgYW5kIGJ1aWxkIGZpbmFsXG4gIC8vIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgZGF0YVJlY3Vyc2l2ZVJlZk1hcCwgJiBhcnJheU1hcFxuICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChjb21waWxlZFNjaGVtYSwgKHN1YlNjaGVtYSwgc3ViU2NoZW1hUG9pbnRlcikgPT4ge1xuICAgIGlmIChpc1N0cmluZyhzdWJTY2hlbWFbJyRyZWYnXSkpIHtcbiAgICAgIGxldCByZWZQb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShzdWJTY2hlbWFbJyRyZWYnXSk7XG4gICAgICBpZiAoIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihyZWZQb2ludGVyLCBzdWJTY2hlbWFQb2ludGVyLCB0cnVlKSkge1xuICAgICAgICByZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhzdWJTY2hlbWFQb2ludGVyLCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgICBKc29uUG9pbnRlci5zZXQoY29tcGlsZWRTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIsIHsgJHJlZjogYCMke3JlZlBvaW50ZXJ9YCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghaGFzT3duKHNjaGVtYVJlZkxpYnJhcnksICdyZWZQb2ludGVyJykpIHtcbiAgICAgICAgc2NoZW1hUmVmTGlicmFyeVtyZWZQb2ludGVyXSA9ICFyZWZQb2ludGVyLmxlbmd0aCA/IGNvbXBpbGVkU2NoZW1hIDpcbiAgICAgICAgICBnZXRTdWJTY2hlbWEoY29tcGlsZWRTY2hlbWEsIHJlZlBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnksIHJlY3Vyc2l2ZVJlZk1hcCk7XG4gICAgICB9XG4gICAgICBpZiAoIXNjaGVtYVJlY3Vyc2l2ZVJlZk1hcC5oYXMoc3ViU2NoZW1hUG9pbnRlcikpIHtcbiAgICAgICAgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLnNldChzdWJTY2hlbWFQb2ludGVyLCByZWZQb2ludGVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZyb21EYXRhUmVmID0gSnNvblBvaW50ZXIudG9EYXRhUG9pbnRlcihzdWJTY2hlbWFQb2ludGVyLCBjb21waWxlZFNjaGVtYSk7XG4gICAgICBpZiAoIWRhdGFSZWN1cnNpdmVSZWZNYXAuaGFzKGZyb21EYXRhUmVmKSkge1xuICAgICAgICBjb25zdCB0b0RhdGFSZWYgPSBKc29uUG9pbnRlci50b0RhdGFQb2ludGVyKHJlZlBvaW50ZXIsIGNvbXBpbGVkU2NoZW1hKTtcbiAgICAgICAgZGF0YVJlY3Vyc2l2ZVJlZk1hcC5zZXQoZnJvbURhdGFSZWYsIHRvRGF0YVJlZik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJlxuICAgICAgKGhhc093bihzdWJTY2hlbWEsICdpdGVtcycpIHx8IGhhc093bihzdWJTY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSlcbiAgICApIHtcbiAgICAgIGNvbnN0IGRhdGFQb2ludGVyID0gSnNvblBvaW50ZXIudG9EYXRhUG9pbnRlcihzdWJTY2hlbWFQb2ludGVyLCBjb21waWxlZFNjaGVtYSk7XG4gICAgICBpZiAoIWFycmF5TWFwLmhhcyhkYXRhUG9pbnRlcikpIHtcbiAgICAgICAgY29uc3QgdHVwbGVJdGVtcyA9IGlzQXJyYXkoc3ViU2NoZW1hLml0ZW1zKSA/IHN1YlNjaGVtYS5pdGVtcy5sZW5ndGggOiAwO1xuICAgICAgICBhcnJheU1hcC5zZXQoZGF0YVBvaW50ZXIsIHR1cGxlSXRlbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgdHJ1ZSk7XG4gIHJldHVybiBjb21waWxlZFNjaGVtYTtcbn1cblxuLyoqXG4gKiAnZ2V0U3ViU2NoZW1hJyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWFcbiAqIEBwYXJhbSAgeyBQb2ludGVyIH0gcG9pbnRlclxuICogQHBhcmFtICB7IG9iamVjdCB9IHNjaGVtYVJlZkxpYnJhcnlcbiAqIEBwYXJhbSAgeyBNYXA8c3RyaW5nLCBzdHJpbmc+IH0gc2NoZW1hUmVjdXJzaXZlUmVmTWFwXG4gKiBAcGFyYW0gIHsgc3RyaW5nW10gPSBbXSB9IHVzZWRQb2ludGVyc1xuICogQHJldHVybiB7IGFueSB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdWJTY2hlbWEoXG4gIHNjaGVtYSwgcG9pbnRlciwgc2NoZW1hUmVmTGlicmFyeSA9IG51bGwsXG4gIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG51bGwsIHVzZWRQb2ludGVyczogc3RyaW5nW10gPSBbXVxuKSB7XG4gIGlmICghc2NoZW1hUmVmTGlicmFyeSB8fCAhc2NoZW1hUmVjdXJzaXZlUmVmTWFwKSB7XG4gICAgcmV0dXJuIEpzb25Qb2ludGVyLmdldENvcHkoc2NoZW1hLCBwb2ludGVyKTtcbiAgfVxuICBpZiAodHlwZW9mIHBvaW50ZXIgIT09ICdzdHJpbmcnKSB7IHBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHBvaW50ZXIpOyB9XG4gIHVzZWRQb2ludGVycyA9IFsgLi4udXNlZFBvaW50ZXJzLCBwb2ludGVyIF07XG4gIGxldCBuZXdTY2hlbWE6IGFueSA9IG51bGw7XG4gIGlmIChwb2ludGVyID09PSAnJykge1xuICAgIG5ld1NjaGVtYSA9IF8uY2xvbmVEZWVwKHNjaGVtYSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc2hvcnRQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhwb2ludGVyLCBzY2hlbWFSZWN1cnNpdmVSZWZNYXApO1xuICAgIGlmIChzaG9ydFBvaW50ZXIgIT09IHBvaW50ZXIpIHsgdXNlZFBvaW50ZXJzID0gWyAuLi51c2VkUG9pbnRlcnMsIHNob3J0UG9pbnRlciBdOyB9XG4gICAgbmV3U2NoZW1hID0gSnNvblBvaW50ZXIuZ2V0Rmlyc3RDb3B5KFtcbiAgICAgIFtzY2hlbWFSZWZMaWJyYXJ5LCBbc2hvcnRQb2ludGVyXV0sXG4gICAgICBbc2NoZW1hLCBwb2ludGVyXSxcbiAgICAgIFtzY2hlbWEsIHNob3J0UG9pbnRlcl1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gSnNvblBvaW50ZXIuZm9yRWFjaERlZXBDb3B5KG5ld1NjaGVtYSwgKHN1YlNjaGVtYSwgc3ViUG9pbnRlcikgPT4ge1xuICAgIGlmIChpc09iamVjdChzdWJTY2hlbWEpKSB7XG5cbiAgICAgIC8vIFJlcGxhY2Ugbm9uLXJlY3Vyc2l2ZSAkcmVmIGxpbmtzIHdpdGggcmVmZXJlbmNlZCBzY2hlbWFzXG4gICAgICBpZiAoaXNTdHJpbmcoc3ViU2NoZW1hLiRyZWYpKSB7XG4gICAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHN1YlNjaGVtYS4kcmVmKTtcbiAgICAgICAgaWYgKHJlZlBvaW50ZXIubGVuZ3RoICYmIHVzZWRQb2ludGVycy5ldmVyeShwdHIgPT5cbiAgICAgICAgICAhSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHJlZlBvaW50ZXIsIHB0ciwgdHJ1ZSlcbiAgICAgICAgKSkge1xuICAgICAgICAgIGNvbnN0IHJlZlNjaGVtYSA9IGdldFN1YlNjaGVtYShcbiAgICAgICAgICAgIHNjaGVtYSwgcmVmUG9pbnRlciwgc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCB1c2VkUG9pbnRlcnNcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhzdWJTY2hlbWEpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlZlNjaGVtYTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXh0cmFLZXlzID0geyAuLi5zdWJTY2hlbWEgfTtcbiAgICAgICAgICAgIGRlbGV0ZSBleHRyYUtleXMuJHJlZjtcbiAgICAgICAgICAgIHJldHVybiBtZXJnZVNjaGVtYXMocmVmU2NoZW1hLCBleHRyYUtleXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiBDb252ZXJ0IHNjaGVtYXMgd2l0aCAndHlwZScgYXJyYXlzIHRvICdvbmVPZidcblxuICAgICAgLy8gQ29tYmluZSBhbGxPZiBzdWJTY2hlbWFzXG4gICAgICBpZiAoaXNBcnJheShzdWJTY2hlbWEuYWxsT2YpKSB7IHJldHVybiBjb21iaW5lQWxsT2Yoc3ViU2NoZW1hKTsgfVxuXG4gICAgICAvLyBGaXggaW5jb3JyZWN0bHkgcGxhY2VkIGFycmF5IG9iamVjdCByZXF1aXJlZCBsaXN0c1xuICAgICAgaWYgKHN1YlNjaGVtYS50eXBlID09PSAnYXJyYXknICYmIGlzQXJyYXkoc3ViU2NoZW1hLnJlcXVpcmVkKSkge1xuICAgICAgICByZXR1cm4gZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMoc3ViU2NoZW1hKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YlNjaGVtYTtcbiAgfSwgdHJ1ZSwgPHN0cmluZz5wb2ludGVyKTtcbn1cblxuLyoqXG4gKiAnY29tYmluZUFsbE9mJyBmdW5jdGlvblxuICpcbiAqIEF0dGVtcHQgdG8gY29udmVydCBhbiBhbGxPZiBzY2hlbWEgb2JqZWN0IGludG9cbiAqIGEgbm9uLWFsbE9mIHNjaGVtYSBvYmplY3Qgd2l0aCBlcXVpdmFsZW50IHJ1bGVzLlxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWEgLSBhbGxPZiBzY2hlbWEgb2JqZWN0XG4gKiBAcmV0dXJuIHsgYW55IH0gLSBjb252ZXJ0ZWQgc2NoZW1hIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUFsbE9mKHNjaGVtYSkge1xuICBpZiAoIWlzT2JqZWN0KHNjaGVtYSkgfHwgIWlzQXJyYXkoc2NoZW1hLmFsbE9mKSkgeyByZXR1cm4gc2NoZW1hOyB9XG4gIGxldCBtZXJnZWRTY2hlbWEgPSBtZXJnZVNjaGVtYXMoLi4uc2NoZW1hLmFsbE9mKTtcbiAgaWYgKE9iamVjdC5rZXlzKHNjaGVtYSkubGVuZ3RoID4gMSkge1xuICAgIGNvbnN0IGV4dHJhS2V5cyA9IHsgLi4uc2NoZW1hIH07XG4gICAgZGVsZXRlIGV4dHJhS2V5cy5hbGxPZjtcbiAgICBtZXJnZWRTY2hlbWEgPSBtZXJnZVNjaGVtYXMobWVyZ2VkU2NoZW1hLCBleHRyYUtleXMpO1xuICB9XG4gIHJldHVybiBtZXJnZWRTY2hlbWE7XG59XG5cbi8qKlxuICogJ2ZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzJyBmdW5jdGlvblxuICpcbiAqIEZpeGVzIGFuIGluY29ycmVjdGx5IHBsYWNlZCByZXF1aXJlZCBsaXN0IGluc2lkZSBhbiBhcnJheSBzY2hlbWEsIGJ5IG1vdmluZ1xuICogaXQgaW50byBpdGVtcy5wcm9wZXJ0aWVzIG9yIGFkZGl0aW9uYWxJdGVtcy5wcm9wZXJ0aWVzLCB3aGVyZSBpdCBiZWxvbmdzLlxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWEgLSBhbGxPZiBzY2hlbWEgb2JqZWN0XG4gKiBAcmV0dXJuIHsgYW55IH0gLSBjb252ZXJ0ZWQgc2NoZW1hIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4UmVxdWlyZWRBcnJheVByb3BlcnRpZXMoc2NoZW1hKSB7XG4gIGlmIChzY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICBjb25zdCBpdGVtc09iamVjdCA9IGhhc093bihzY2hlbWEuaXRlbXMsICdwcm9wZXJ0aWVzJykgPyAnaXRlbXMnIDpcbiAgICAgIGhhc093bihzY2hlbWEuYWRkaXRpb25hbEl0ZW1zLCAncHJvcGVydGllcycpID8gJ2FkZGl0aW9uYWxJdGVtcycgOiBudWxsO1xuICAgIGlmIChpdGVtc09iamVjdCAmJiAhaGFzT3duKHNjaGVtYVtpdGVtc09iamVjdF0sICdyZXF1aXJlZCcpICYmIChcbiAgICAgIGhhc093bihzY2hlbWFbaXRlbXNPYmplY3RdLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKSB8fFxuICAgICAgc2NoZW1hLnJlcXVpcmVkLmV2ZXJ5KGtleSA9PiBoYXNPd24oc2NoZW1hW2l0ZW1zT2JqZWN0XS5wcm9wZXJ0aWVzLCBrZXkpKVxuICAgICkpIHtcbiAgICAgIHNjaGVtYSA9IF8uY2xvbmVEZWVwKHNjaGVtYSk7XG4gICAgICBzY2hlbWFbaXRlbXNPYmplY3RdLnJlcXVpcmVkID0gc2NoZW1hLnJlcXVpcmVkO1xuICAgICAgZGVsZXRlIHNjaGVtYS5yZXF1aXJlZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjaGVtYTtcbn1cbiJdfQ==