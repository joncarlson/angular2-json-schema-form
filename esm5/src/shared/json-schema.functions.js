import * as tslib_1 from "tslib";
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
export function buildSchemaFromData(data, requireAllFields, isRoot) {
    if (requireAllFields === void 0) { requireAllFields = false; }
    if (isRoot === void 0) { isRoot = true; }
    var newSchema = {};
    var getFieldType = function (value) {
        var fieldType = getType(value, 'strict');
        return { integer: 'number', null: 'string' }[fieldType] || fieldType;
    };
    var buildSubSchema = function (value) {
        return buildSchemaFromData(value, requireAllFields, false);
    };
    if (isRoot) {
        newSchema.$schema = 'http://json-schema.org/draft-06/schema#';
    }
    newSchema.type = getFieldType(data);
    if (newSchema.type === 'object') {
        newSchema.properties = {};
        if (requireAllFields) {
            newSchema.required = [];
        }
        try {
            for (var _a = tslib_1.__values(Object.keys(data)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                newSchema.properties[key] = buildSubSchema(data[key]);
                if (requireAllFields) {
                    newSchema.required.push(key);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else if (newSchema.type === 'array') {
        newSchema.items = data.map(buildSubSchema);
        // If all items are the same type, use an object for items instead of an array
        if ((new Set(data.map(getFieldType))).size === 1) {
            newSchema.items = newSchema.items.reduce(function (a, b) { return (tslib_1.__assign({}, a, b)); }, {});
        }
        if (requireAllFields) {
            newSchema.minItems = 1;
        }
    }
    return newSchema;
    var e_1, _c;
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
export function getFromSchema(schema, dataPointer, returnType) {
    if (returnType === void 0) { returnType = 'schema'; }
    var dataPointerArray = JsonPointer.parse(dataPointer);
    if (dataPointerArray === null) {
        console.error("getFromSchema error: Invalid JSON Pointer: " + dataPointer);
        return null;
    }
    var subSchema = schema;
    var schemaPointer = [];
    var length = dataPointerArray.length;
    if (returnType.slice(0, 6) === 'parent') {
        dataPointerArray.length--;
    }
    for (var i = 0; i < length; ++i) {
        var parentSchema = subSchema;
        var key = dataPointerArray[i];
        var subSchemaFound = false;
        if (typeof subSchema !== 'object') {
            console.error("getFromSchema error: Unable to find \"" + key + "\" key in schema.");
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
            console.error("getFromSchema error: Unable to find \"" + key + "\" item in schema.");
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
export function removeRecursiveReferences(pointer, recursiveRefMap, arrayMap) {
    if (arrayMap === void 0) { arrayMap = new Map(); }
    if (!pointer) {
        return '';
    }
    var genericPointer = JsonPointer.toGenericPointer(JsonPointer.compile(pointer), arrayMap);
    if (genericPointer.indexOf('/') === -1) {
        return genericPointer;
    }
    var possibleReferences = true;
    while (possibleReferences) {
        possibleReferences = false;
        recursiveRefMap.forEach(function (toPointer, fromPointer) {
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
export function getInputType(schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
    // x-schema-form = Angular Schema Form compatibility
    // widget & component = React Jsonschema Form compatibility
    var controlType = JsonPointer.getFirst([
        [schema, '/x-schema-form/type'],
        [schema, '/x-schema-form/widget/component'],
        [schema, '/x-schema-form/widget'],
        [schema, '/widget/component'],
        [schema, '/widget']
    ]);
    if (isString(controlType)) {
        return checkInlineType(controlType, schema, layoutNode);
    }
    var schemaType = schema.type;
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
            var itemsObject = JsonPointer.getFirst([
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
    console.error("getInputType error: Unable to determine input type for " + schemaType);
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
export function checkInlineType(controlType, schema, layoutNode) {
    if (layoutNode === void 0) { layoutNode = null; }
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
    var listPointerArray = JsonPointer.parse(schemaPointer);
    if (isArray(listPointerArray)) {
        if (!listPointerArray.length) {
            return schema.required === true;
        }
        var keyName = listPointerArray.pop();
        var nextToLastKey = listPointerArray[listPointerArray.length - 1];
        if (['properties', 'additionalProperties', 'patternProperties', 'items', 'additionalItems']
            .includes(nextToLastKey)) {
            listPointerArray.pop();
        }
        var parentSchema = JsonPointer.get(schema, listPointerArray) || {};
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
    var newOptions = {};
    var fixUiKeys = function (key) { return key.slice(0, 3).toLowerCase() === 'ui:' ? key.slice(3) : key; };
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
    ].forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), object = _b[0], excludeKeys = _b[1];
        return mergeFilteredObject(newOptions, object, excludeKeys, fixUiKeys);
    });
    if (!hasOwn(newOptions, 'titleMap')) {
        var newTitleMap = null;
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
export function getTitleMapFromOneOf(schema, flatList, validateOnly) {
    if (schema === void 0) { schema = {}; }
    if (flatList === void 0) { flatList = null; }
    if (validateOnly === void 0) { validateOnly = false; }
    var titleMap = null;
    var oneOf = schema.oneOf || schema.anyOf || null;
    if (isArray(oneOf) && oneOf.every(function (item) { return item.title; })) {
        if (oneOf.every(function (item) { return isArray(item.enum) && item.enum.length === 1; })) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(function (item) { return ({ name: item.title, value: item.enum[0] }); });
        }
        else if (oneOf.every(function (item) { return item.const; })) {
            if (validateOnly) {
                return true;
            }
            titleMap = oneOf.map(function (item) { return ({ name: item.title, value: item.const }); });
        }
        // if flatList !== false and some items have colons, make grouped map
        if (flatList !== false && (titleMap || [])
            .filter(function (title) { return ((title || {}).name || '').indexOf(': '); }).length > 1) {
            // Split name on first colon to create grouped map (name -> group: name)
            var newTitleMap_1 = titleMap.map(function (title) {
                var _a = tslib_1.__read(title.name.split(/: (.+)/), 2), group = _a[0], name = _a[1];
                return group && name ? tslib_1.__assign({}, title, { group: group, name: name }) : title;
            });
            // If flatList === true or at least one group has multiple items, use grouped map
            if (flatList === true || newTitleMap_1.some(function (title, index) {
                return index &&
                    hasOwn(title, 'group') && title.group === newTitleMap_1[index - 1].group;
            })) {
                titleMap = newTitleMap_1;
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
    var validators = {};
    if (hasOwn(schema, 'type')) {
        switch (schema.type) {
            case 'string':
                forEach(['pattern', 'format', 'minLength', 'maxLength'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'number':
            case 'integer':
                forEach(['Minimum', 'Maximum'], function (ucLimit) {
                    var eLimit = 'exclusive' + ucLimit;
                    var limit = ucLimit.toLowerCase();
                    if (hasOwn(schema, limit)) {
                        var exclusive = hasOwn(schema, eLimit) && schema[eLimit] === true;
                        validators[limit] = [schema[limit], exclusive];
                    }
                });
                forEach(['multipleOf', 'type'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'object':
                forEach(['minProperties', 'maxProperties', 'dependencies'], function (prop) {
                    if (hasOwn(schema, prop)) {
                        validators[prop] = [schema[prop]];
                    }
                });
                break;
            case 'array':
                forEach(['minItems', 'maxItems', 'uniqueItems'], function (prop) {
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
    var refLinks = new Set();
    var refMapSet = new Set();
    var refMap = new Map();
    var recursiveRefMap = new Map();
    var refLibrary = {};
    // Search schema for all $ref links, and build full refLibrary
    JsonPointer.forEachDeep(schema, function (subSchema, subSchemaPointer) {
        if (hasOwn(subSchema, '$ref') && isString(subSchema['$ref'])) {
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            refLinks.add(refPointer);
            refMapSet.add(subSchemaPointer + '~~' + refPointer);
            refMap.set(subSchemaPointer, refPointer);
        }
    });
    refLinks.forEach(function (ref) { return refLibrary[ref] = getSubSchema(schema, ref); });
    // Follow all ref links and save in refMapSet,
    // to find any multi-link recursive refernces
    var checkRefLinks = true;
    while (checkRefLinks) {
        checkRefLinks = false;
        Array.from(refMap).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
            return Array.from(refMap)
                .filter(function (_a) {
                var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
                return JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                    !JsonPointer.isSubPointer(toRef2, toRef1, true) &&
                    !refMapSet.has(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
            })
                .forEach(function (_a) {
                var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
                refMapSet.add(fromRef1 + fromRef2.slice(toRef1.length) + '~~' + toRef2);
                checkRefLinks = true;
            });
        });
    }
    // Build full recursiveRefMap
    // First pass - save all internally recursive refs from refMapSet
    Array.from(refMapSet)
        .map(function (refLink) { return refLink.split('~~'); })
        .filter(function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef = _b[0], toRef = _b[1];
        return JsonPointer.isSubPointer(toRef, fromRef);
    })
        .forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef = _b[0], toRef = _b[1];
        return recursiveRefMap.set(fromRef, toRef);
    });
    // Second pass - create recursive versions of any other refs that link to recursive refs
    Array.from(refMap)
        .filter(function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
        return Array.from(recursiveRefMap.keys())
            .every(function (fromRef2) { return !JsonPointer.isSubPointer(fromRef1, fromRef2, true); });
    })
        .forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), fromRef1 = _b[0], toRef1 = _b[1];
        return Array.from(recursiveRefMap)
            .filter(function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
            return !recursiveRefMap.has(fromRef1 + fromRef2.slice(toRef1.length)) &&
                JsonPointer.isSubPointer(toRef1, fromRef2, true) &&
                !JsonPointer.isSubPointer(toRef1, fromRef1, true);
        })
            .forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), fromRef2 = _b[0], toRef2 = _b[1];
            return recursiveRefMap.set(fromRef1 + fromRef2.slice(toRef1.length), fromRef1 + toRef2.slice(toRef1.length));
        });
    });
    // Create compiled schema by replacing all non-recursive $ref links with
    // thieir linked schemas and, where possible, combining schemas in allOf arrays.
    var compiledSchema = tslib_1.__assign({}, schema);
    delete compiledSchema.definitions;
    compiledSchema =
        getSubSchema(compiledSchema, '', refLibrary, recursiveRefMap);
    // Make sure all remaining schema $refs are recursive, and build final
    // schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
    JsonPointer.forEachDeep(compiledSchema, function (subSchema, subSchemaPointer) {
        if (isString(subSchema['$ref'])) {
            var refPointer = JsonPointer.compile(subSchema['$ref']);
            if (!JsonPointer.isSubPointer(refPointer, subSchemaPointer, true)) {
                refPointer = removeRecursiveReferences(subSchemaPointer, recursiveRefMap);
                JsonPointer.set(compiledSchema, subSchemaPointer, { $ref: "#" + refPointer });
            }
            if (!hasOwn(schemaRefLibrary, 'refPointer')) {
                schemaRefLibrary[refPointer] = !refPointer.length ? compiledSchema :
                    getSubSchema(compiledSchema, refPointer, schemaRefLibrary, recursiveRefMap);
            }
            if (!schemaRecursiveRefMap.has(subSchemaPointer)) {
                schemaRecursiveRefMap.set(subSchemaPointer, refPointer);
            }
            var fromDataRef = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!dataRecursiveRefMap.has(fromDataRef)) {
                var toDataRef = JsonPointer.toDataPointer(refPointer, compiledSchema);
                dataRecursiveRefMap.set(fromDataRef, toDataRef);
            }
        }
        if (subSchema.type === 'array' &&
            (hasOwn(subSchema, 'items') || hasOwn(subSchema, 'additionalItems'))) {
            var dataPointer = JsonPointer.toDataPointer(subSchemaPointer, compiledSchema);
            if (!arrayMap.has(dataPointer)) {
                var tupleItems = isArray(subSchema.items) ? subSchema.items.length : 0;
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
export function getSubSchema(schema, pointer, schemaRefLibrary, schemaRecursiveRefMap, usedPointers) {
    if (schemaRefLibrary === void 0) { schemaRefLibrary = null; }
    if (schemaRecursiveRefMap === void 0) { schemaRecursiveRefMap = null; }
    if (usedPointers === void 0) { usedPointers = []; }
    if (!schemaRefLibrary || !schemaRecursiveRefMap) {
        return JsonPointer.getCopy(schema, pointer);
    }
    if (typeof pointer !== 'string') {
        pointer = JsonPointer.compile(pointer);
    }
    usedPointers = tslib_1.__spread(usedPointers, [pointer]);
    var newSchema = null;
    if (pointer === '') {
        newSchema = _.cloneDeep(schema);
    }
    else {
        var shortPointer = removeRecursiveReferences(pointer, schemaRecursiveRefMap);
        if (shortPointer !== pointer) {
            usedPointers = tslib_1.__spread(usedPointers, [shortPointer]);
        }
        newSchema = JsonPointer.getFirstCopy([
            [schemaRefLibrary, [shortPointer]],
            [schema, pointer],
            [schema, shortPointer]
        ]);
    }
    return JsonPointer.forEachDeepCopy(newSchema, function (subSchema, subPointer) {
        if (isObject(subSchema)) {
            // Replace non-recursive $ref links with referenced schemas
            if (isString(subSchema.$ref)) {
                var refPointer_1 = JsonPointer.compile(subSchema.$ref);
                if (refPointer_1.length && usedPointers.every(function (ptr) {
                    return !JsonPointer.isSubPointer(refPointer_1, ptr, true);
                })) {
                    var refSchema = getSubSchema(schema, refPointer_1, schemaRefLibrary, schemaRecursiveRefMap, usedPointers);
                    if (Object.keys(subSchema).length === 1) {
                        return refSchema;
                    }
                    else {
                        var extraKeys = tslib_1.__assign({}, subSchema);
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
    var mergedSchema = mergeSchemas.apply(void 0, tslib_1.__spread(schema.allOf));
    if (Object.keys(schema).length > 1) {
        var extraKeys = tslib_1.__assign({}, schema);
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
        var itemsObject_1 = hasOwn(schema.items, 'properties') ? 'items' :
            hasOwn(schema.additionalItems, 'properties') ? 'additionalItems' : null;
        if (itemsObject_1 && !hasOwn(schema[itemsObject_1], 'required') && (hasOwn(schema[itemsObject_1], 'additionalProperties') ||
            schema.required.every(function (key) { return hasOwn(schema[itemsObject_1].properties, key); }))) {
            schema = _.cloneDeep(schema);
            schema[itemsObject_1].required = schema.required;
            delete schema.required;
        }
    }
    return schema;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9zaGFyZWQvanNvbi1zY2hlbWEuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQ0wsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUF1QixRQUFRLEVBQUUsUUFBUSxFQUM1RSxRQUFRLEVBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsT0FBTyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFDckMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFdBQVcsRUFBVyxNQUFNLHlCQUF5QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkMvRCxNQUFNLGdDQUFnQyxNQUFNO0lBQzFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F1QlI7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSw4QkFDSixJQUFJLEVBQUUsZ0JBQXdCLEVBQUUsTUFBYTtJQUF2QyxpQ0FBQSxFQUFBLHdCQUF3QjtJQUFFLHVCQUFBLEVBQUEsYUFBYTtJQUU3QyxJQUFNLFNBQVMsR0FBUSxFQUFFLENBQUM7SUFDMUIsSUFBTSxZQUFZLEdBQUcsVUFBQyxLQUFVO1FBQzlCLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDO0tBQ3RFLENBQUM7SUFDRixJQUFNLGNBQWMs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QyxDQUFDO1FBQ3hELElBQU0sYUFBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMxRSxFQUFFLENBQUMsQ0FBQyxhQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQVcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQzdELE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBVyxDQUFDLEVBQUUsc0JBQXNCLENBQUM7WUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQVcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQyxDQUMxRSxDQUFDLENBQUMsQ0FBQztZQUNGLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxhQUFXLENBQUMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUMvQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDeEI7S0FDRjtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Q0FDZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgZ2V0VHlwZSwgaGFzVmFsdWUsIGluQXJyYXksIGlzQXJyYXksIGlzRW1wdHksIGlzRnVuY3Rpb24sIGlzTnVtYmVyLCBpc09iamVjdCxcbiAgaXNTdHJpbmdcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7XG4gIGZvckVhY2gsIGhhc093biwgbWVyZ2VGaWx0ZXJlZE9iamVjdCwgdW5pcXVlSXRlbXMsIGNvbW1vbkl0ZW1zXG59IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgbWVyZ2VTY2hlbWFzIH0gZnJvbSAnLi9tZXJnZS1zY2hlbWFzLmZ1bmN0aW9uJztcbmltcG9ydCB7IEpzb25Qb2ludGVyLCBQb2ludGVyIH0gZnJvbSAnLi9qc29ucG9pbnRlci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblZhbGlkYXRvcnMgfSBmcm9tICcuL2pzb24udmFsaWRhdG9ycyc7XG5cbi8qKlxuICogSlNPTiBTY2hlbWEgZnVuY3Rpb24gbGlicmFyeTpcbiAqXG4gKiBidWlsZFNjaGVtYUZyb21MYXlvdXQ6ICAgVE9ETzogV3JpdGUgdGhpcyBmdW5jdGlvblxuICpcbiAqIGJ1aWxkU2NoZW1hRnJvbURhdGE6XG4gKlxuICogZ2V0RnJvbVNjaGVtYTpcbiAqXG4gKiByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzOlxuICpcbiAqIGdldElucHV0VHlwZTpcbiAqXG4gKiBjaGVja0lubGluZVR5cGU6XG4gKlxuICogaXNJbnB1dFJlcXVpcmVkOlxuICpcbiAqIHVwZGF0ZUlucHV0T3B0aW9uczpcbiAqXG4gKiBnZXRUaXRsZU1hcEZyb21PbmVPZjpcbiAqXG4gKiBnZXRDb250cm9sVmFsaWRhdG9yczpcbiAqXG4gKiByZXNvbHZlU2NoZW1hUmVmZXJlbmNlczpcbiAqXG4gKiBnZXRTdWJTY2hlbWE6XG4gKlxuICogY29tYmluZUFsbE9mOlxuICpcbiAqIGZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzOlxuICovXG5cbi8qKlxuICogJ2J1aWxkU2NoZW1hRnJvbUxheW91dCcgZnVuY3Rpb25cbiAqXG4gKiBUT0RPOiBCdWlsZCBhIEpTT04gU2NoZW1hIGZyb20gYSBKU09OIEZvcm0gbGF5b3V0XG4gKlxuICogQHBhcmFtICB7IGFueVtdIH0gbGF5b3V0IC0gVGhlIEpTT04gRm9ybSBsYXlvdXRcbiAqIEByZXR1cm4geyBhbnkgfSAtIFRoZSBuZXcgSlNPTiBTY2hlbWFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2NoZW1hRnJvbUxheW91dChsYXlvdXQpIHtcbiAgcmV0dXJuO1xuICAvLyBsZXQgbmV3U2NoZW1hOiBhbnkgPSB7IH07XG4gIC8vIGNvbnN0IHdhbGtMYXlvdXQgPSAobGF5b3V0SXRlbXM6IGFueVtdLCBjYWxsYmFjazogRnVuY3Rpb24pOiBhbnlbXSA9PiB7XG4gIC8vICAgbGV0IHJldHVybkFycmF5OiBhbnlbXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcbiAgLy8gICAgIGNvbnN0IHJldHVybkl0ZW06IGFueSA9IGNhbGxiYWNrKGxheW91dEl0ZW0pO1xuICAvLyAgICAgaWYgKHJldHVybkl0ZW0pIHsgcmV0dXJuQXJyYXkgPSByZXR1cm5BcnJheS5jb25jYXQoY2FsbGJhY2sobGF5b3V0SXRlbSkpOyB9XG4gIC8vICAgICBpZiAobGF5b3V0SXRlbS5pdGVtcykge1xuICAvLyAgICAgICByZXR1cm5BcnJheSA9IHJldHVybkFycmF5LmNvbmNhdCh3YWxrTGF5b3V0KGxheW91dEl0ZW0uaXRlbXMsIGNhbGxiYWNrKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgLy8gfTtcbiAgLy8gd2Fsa0xheW91dChsYXlvdXQsIGxheW91dEl0ZW0gPT4ge1xuICAvLyAgIGxldCBpdGVtS2V5OiBzdHJpbmc7XG4gIC8vICAgaWYgKHR5cGVvZiBsYXlvdXRJdGVtID09PSAnc3RyaW5nJykge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW07XG4gIC8vICAgfSBlbHNlIGlmIChsYXlvdXRJdGVtLmtleSkge1xuICAvLyAgICAgaXRlbUtleSA9IGxheW91dEl0ZW0ua2V5O1xuICAvLyAgIH1cbiAgLy8gICBpZiAoIWl0ZW1LZXkpIHsgcmV0dXJuOyB9XG4gIC8vICAgLy9cbiAgLy8gfSk7XG59XG5cbi8qKlxuICogJ2J1aWxkU2NoZW1hRnJvbURhdGEnIGZ1bmN0aW9uXG4gKlxuICogQnVpbGQgYSBKU09OIFNjaGVtYSBmcm9tIGEgZGF0YSBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdFxuICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IHJlcXVpcmVBbGxGaWVsZHMgLSBSZXF1aXJlIGFsbCBmaWVsZHM/XG4gKiBAcGFyYW0gIHsgYm9vbGVhbiA9IHRydWUgfSBpc1Jvb3QgLSBpcyByb290XG4gKiBAcmV0dXJuIHsgYW55IH0gLSBUaGUgbmV3IEpTT04gU2NoZW1hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNjaGVtYUZyb21EYXRhKFxuICBkYXRhLCByZXF1aXJlQWxsRmllbGRzID0gZmFsc2UsIGlzUm9vdCA9IHRydWVcbikge1xuICBjb25zdCBuZXdTY2hlbWE6IGFueSA9IHt9O1xuICBjb25zdCBnZXRGaWVsZFR5cGUgPSAodmFsdWU6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmllbGRUeXBlID0gZ2V0VHlwZSh2YWx1ZSwgJ3N0cmljdCcpO1xuICAgIHJldHVybiB7IGludGVnZXI6ICdudW1iZXInLCBudWxsOiAnc3RyaW5nJyB9W2ZpZWxkVHlwZV0gfHwgZmllbGRUeXBlO1xuICB9O1xuICBjb25zdCBidWlsZFN1YlNjaGVtYSA9ICh2YWx1ZSkgPT5cbiAgICBidWlsZFNjaGVtYUZyb21EYXRhKHZhbHVlLCByZXF1aXJlQWxsRmllbGRzLCBmYWxzZSk7XG4gIGlmIChpc1Jvb3QpIHsgbmV3U2NoZW1hLiRzY2hlbWEgPSAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNi9zY2hlbWEjJzsgfVxuICBuZXdTY2hlbWEudHlwZSA9IGdldEZpZWxkVHlwZShkYXRhKTtcbiAgaWYgKG5ld1NjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgIG5ld1NjaGVtYS5wcm9wZXJ0aWVzID0ge307XG4gICAgaWYgKHJlcXVpcmVBbGxGaWVsZHMpIHsgbmV3U2NoZW1hLnJlcXVpcmVkID0gW107IH1cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhkYXRhKSkge1xuICAgICAgbmV3U2NoZW1hLnByb3BlcnRpZXNba2V5XSA9IGJ1aWxkU3ViU2NoZW1hKGRhdGFba2V5XSk7XG4gICAgICBpZiAocmVxdWlyZUFsbEZpZWxkcykgeyBuZXdTY2hlbWEucmVxdWlyZWQucHVzaChrZXkpOyB9XG4gICAgfVxuICB9IGVsc2UgaWYgKG5ld1NjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgbmV3U2NoZW1hLml0ZW1zID0gZGF0YS5tYXAoYnVpbGRTdWJTY2hlbWEpO1xuICAgIC8vIElmIGFsbCBpdGVtcyBhcmUgdGhlIHNhbWUgdHlwZSwgdXNlIGFuIG9iamVjdCBmb3IgaXRlbXMgaW5zdGVhZCBvZiBhbiBhcnJheVxuICAgIGlmICgobmV3IFNldChkYXRhLm1hcChnZXRGaWVsZFR5cGUpKSkuc2l6ZSA9PT0gMSkge1xuICAgICAgbmV3U2NoZW1hLml0ZW1zID0gbmV3U2NoZW1hLml0ZW1zLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pO1xuICAgIH1cbiAgICBpZiAocmVxdWlyZUFsbEZpZWxkcykgeyBuZXdTY2hlbWEubWluSXRlbXMgPSAxOyB9XG4gIH1cbiAgcmV0dXJuIG5ld1NjaGVtYTtcbn1cblxuLyoqXG4gKiAnZ2V0RnJvbVNjaGVtYScgZnVuY3Rpb25cbiAqXG4gKiBVc2VzIGEgSlNPTiBQb2ludGVyIGZvciBhIHZhbHVlIHdpdGhpbiBhIGRhdGEgb2JqZWN0IHRvIHJldHJpZXZlXG4gKiB0aGUgc2NoZW1hIGZvciB0aGF0IHZhbHVlIHdpdGhpbiBzY2hlbWEgZm9yIHRoZSBkYXRhIG9iamVjdC5cbiAqXG4gKiBUaGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIGNhbiBhbHNvIGJlIHNldCB0byByZXR1cm4gc29tZXRoaW5nIGVsc2U6XG4gKiAnc2NoZW1hJyAoZGVmYXVsdCk6IHRoZSBzY2hlbWEgZm9yIHRoZSB2YWx1ZSBpbmRpY2F0ZWQgYnkgdGhlIGRhdGEgcG9pbnRlclxuICogJ3BhcmVudFNjaGVtYSc6IHRoZSBzY2hlbWEgZm9yIHRoZSB2YWx1ZSdzIHBhcmVudCBvYmplY3Qgb3IgYXJyYXlcbiAqICdzY2hlbWFQb2ludGVyJzogYSBwb2ludGVyIHRvIHRoZSB2YWx1ZSdzIHNjaGVtYSB3aXRoaW4gdGhlIG9iamVjdCdzIHNjaGVtYVxuICogJ3BhcmVudFNjaGVtYVBvaW50ZXInOiBhIHBvaW50ZXIgdG8gdGhlIHNjaGVtYSBmb3IgdGhlIHZhbHVlJ3MgcGFyZW50IG9iamVjdCBvciBhcnJheVxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWEgLSBUaGUgc2NoZW1hIHRvIGdldCB0aGUgc3ViLXNjaGVtYSBmcm9tXG4gKiBAcGFyYW0gIHsgUG9pbnRlciB9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gKiBAcGFyYW0gIHsgc3RyaW5nID0gJ3NjaGVtYScgfSByZXR1cm5UeXBlIC0gd2hhdCB0byByZXR1cm4/XG4gKiBAcmV0dXJuIHsgYW55IH0gLSBUaGUgbG9jYXRlZCBzdWItc2NoZW1hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU2NoZW1hKHNjaGVtYSwgZGF0YVBvaW50ZXIsIHJldHVyblR5cGUgPSAnc2NoZW1hJykge1xuICBjb25zdCBkYXRhUG9pbnRlckFycmF5OiBhbnlbXSA9IEpzb25Qb2ludGVyLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgaWYgKGRhdGFQb2ludGVyQXJyYXkgPT09IG51bGwpIHtcbiAgICBjb25zb2xlLmVycm9yKGBnZXRGcm9tU2NoZW1hIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtkYXRhUG9pbnRlcn1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgc3ViU2NoZW1hID0gc2NoZW1hO1xuICBjb25zdCBzY2hlbWFQb2ludGVyID0gW107XG4gIGNvbnN0IGxlbmd0aCA9IGRhdGFQb2ludGVyQXJyYXkubGVuZ3RoO1xuICBpZiAocmV0dXJuVHlwZS5zbGljZSgwLCA2KSA9PT0gJ3BhcmVudCcpIHsgZGF0YVBvaW50ZXJBcnJheS5sZW5ndGgtLTsgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcGFyZW50U2NoZW1hID0gc3ViU2NoZW1hO1xuICAgIGNvbnN0IGtleSA9IGRhdGFQb2ludGVyQXJyYXlbaV07XG4gICAgbGV0IHN1YlNjaGVtYUZvdW5kID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBzdWJTY2hlbWEgIT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRGcm9tU2NoZW1hIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGtleSBpbiBzY2hlbWEuYCk7XG4gICAgICBjb25zb2xlLmVycm9yKHNjaGVtYSk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiYgKCFpc05hTihrZXkpIHx8IGtleSA9PT0gJy0nKSkge1xuICAgICAgaWYgKGhhc093bihzdWJTY2hlbWEsICdpdGVtcycpKSB7XG4gICAgICAgIGlmIChpc09iamVjdChzdWJTY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5pdGVtcztcbiAgICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2l0ZW1zJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShzdWJTY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgaWYgKCFpc05hTihrZXkpICYmIHN1YlNjaGVtYS5pdGVtcy5sZW5ndGggPj0gK2tleSkge1xuICAgICAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLml0ZW1zWytrZXldO1xuICAgICAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdpdGVtcycsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXN1YlNjaGVtYUZvdW5kICYmIGlzT2JqZWN0KHN1YlNjaGVtYS5hZGRpdGlvbmFsSXRlbXMpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLmFkZGl0aW9uYWxJdGVtcztcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdhZGRpdGlvbmFsSXRlbXMnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3ViU2NoZW1hLmFkZGl0aW9uYWxJdGVtcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3ViU2NoZW1hRm91bmQgPSB0cnVlO1xuICAgICAgICBzdWJTY2hlbWEgPSB7IH07XG4gICAgICAgIHNjaGVtYVBvaW50ZXIucHVzaCgnYWRkaXRpb25hbEl0ZW1zJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc09iamVjdChzdWJTY2hlbWEucHJvcGVydGllcykgJiYgaGFzT3duKHN1YlNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0gc3ViU2NoZW1hLnByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdwcm9wZXJ0aWVzJywga2V5KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkge1xuICAgICAgICBzdWJTY2hlbWFGb3VuZCA9IHRydWU7XG4gICAgICAgIHN1YlNjaGVtYSA9IHN1YlNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcztcbiAgICAgICAgc2NoZW1hUG9pbnRlci5wdXNoKCdhZGRpdGlvbmFsUHJvcGVydGllcycpO1xuICAgICAgfSBlbHNlIGlmIChzdWJTY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIHN1YlNjaGVtYUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgc3ViU2NoZW1hID0geyB9O1xuICAgICAgICBzY2hlbWFQb2ludGVyLnB1c2goJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghc3ViU2NoZW1hRm91bmQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGdldEZyb21TY2hlbWEgZXJyb3I6IFVuYWJsZSB0byBmaW5kIFwiJHtrZXl9XCIgaXRlbSBpbiBzY2hlbWEuYCk7XG4gICAgICBjb25zb2xlLmVycm9yKHNjaGVtYSk7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldHVyblR5cGUuc2xpY2UoLTcpID09PSAnUG9pbnRlcicgPyBzY2hlbWFQb2ludGVyIDogc3ViU2NoZW1hO1xufVxuXG4vKipcbiAqICdyZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzJyBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBhIEpTT04gUG9pbnRlciBhZ2FpbnN0IGEgbWFwIG9mIHJlY3Vyc2l2ZSByZWZlcmVuY2VzIGFuZCByZXR1cm5zXG4gKiBhIEpTT04gUG9pbnRlciB0byB0aGUgc2hhbGxvd2VzdCBlcXVpdmFsZW50IGxvY2F0aW9uIGluIHRoZSBzYW1lIG9iamVjdC5cbiAqXG4gKiBVc2luZyB0aGlzIGZ1bmN0aW9ucyBlbmFibGVzIGFuIG9iamVjdCB0byBiZSBjb25zdHJ1Y3RlZCB3aXRoIHVubGltaXRlZFxuICogcmVjdXJzaW9uLCB3aGlsZSBtYWludGFpbmcgYSBmaXhlZCBzZXQgb2YgbWV0YWRhdGEsIHN1Y2ggYXMgZmllbGQgZGF0YSB0eXBlcy5cbiAqIFRoZSBvYmplY3QgY2FuIGdyb3cgYXMgbGFyZ2UgYXMgaXQgd2FudHMsIGFuZCBkZWVwbHkgcmVjdXJzZWQgbm9kZXMgY2FuXG4gKiBqdXN0IHJlZmVyIHRvIHRoZSBtZXRhZGF0YSBmb3IgdGhlaXIgc2hhbGxvdyBlcXVpdmFsZW50cywgaW5zdGVhZCBvZiBoYXZpbmdcbiAqIHRvIGFkZCBhZGRpdGlvbmFsIHJlZHVuZGFudCBtZXRhZGF0YSBmb3IgZWFjaCByZWN1cnNpdmVseSBhZGRlZCBub2RlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogcG9pbnRlcjogICAgICAgICAnL3N0dWZmL2FuZC9tb3JlL2FuZC9tb3JlL2FuZC9tb3JlL2FuZC9tb3JlL3N0dWZmJ1xuICogcmVjdXJzaXZlUmVmTWFwOiBbWycvc3R1ZmYvYW5kL21vcmUvYW5kL21vcmUnLCAnL3N0dWZmL2FuZC9tb3JlLyddXVxuICogcmV0dXJuZWQ6ICAgICAgICAnL3N0dWZmL2FuZC9tb3JlL3N0dWZmJ1xuICpcbiAqIEBwYXJhbSAgeyBQb2ludGVyIH0gcG9pbnRlciAtXG4gKiBAcGFyYW0gIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IHJlY3Vyc2l2ZVJlZk1hcCAtXG4gKiBAcGFyYW0gIHsgTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKSB9IGFycmF5TWFwIC0gb3B0aW9uYWxcbiAqIEByZXR1cm4geyBzdHJpbmcgfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICBwb2ludGVyLCByZWN1cnNpdmVSZWZNYXAsIGFycmF5TWFwID0gbmV3IE1hcCgpXG4pIHtcbiAgaWYgKCFwb2ludGVyKSB7IHJldHVybiAnJzsgfVxuICBsZXQgZ2VuZXJpY1BvaW50ZXIgPVxuICAgIEpzb25Qb2ludGVyLnRvR2VuZXJpY1BvaW50ZXIoSnNvblBvaW50ZXIuY29tcGlsZShwb2ludGVyKSwgYXJyYXlNYXApO1xuICBpZiAoZ2VuZXJpY1BvaW50ZXIuaW5kZXhPZignLycpID09PSAtMSkgeyByZXR1cm4gZ2VuZXJpY1BvaW50ZXI7IH1cbiAgbGV0IHBvc3NpYmxlUmVmZXJlbmNlcyA9IHRydWU7XG4gIHdoaWxlIChwb3NzaWJsZVJlZmVyZW5jZXMpIHtcbiAgICBwb3NzaWJsZVJlZmVyZW5jZXMgPSBmYWxzZTtcbiAgICByZWN1cnNpdmVSZWZNYXAuZm9yRWFjaCgodG9Qb2ludGVyLCBmcm9tUG9pbnRlcikgPT4ge1xuICAgICAgaWYgKEpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcih0b1BvaW50ZXIsIGZyb21Qb2ludGVyKSkge1xuICAgICAgICB3aGlsZSAoSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKGZyb21Qb2ludGVyLCBnZW5lcmljUG9pbnRlciwgdHJ1ZSkpIHtcbiAgICAgICAgICBnZW5lcmljUG9pbnRlciA9IEpzb25Qb2ludGVyLnRvR2VuZXJpY1BvaW50ZXIoXG4gICAgICAgICAgICB0b1BvaW50ZXIgKyBnZW5lcmljUG9pbnRlci5zbGljZShmcm9tUG9pbnRlci5sZW5ndGgpLCBhcnJheU1hcFxuICAgICAgICAgICk7XG4gICAgICAgICAgcG9zc2libGVSZWZlcmVuY2VzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBnZW5lcmljUG9pbnRlcjtcbn1cblxuLyoqXG4gKiAnZ2V0SW5wdXRUeXBlJyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAgeyBhbnkgfSBzY2hlbWFcbiAqIEBwYXJhbSAgeyBhbnkgPSBudWxsIH0gbGF5b3V0Tm9kZVxuICogQHJldHVybiB7IHN0cmluZyB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnB1dFR5cGUoc2NoZW1hLCBsYXlvdXROb2RlOiBhbnkgPSBudWxsKSB7XG4gIC8vIHgtc2NoZW1hLWZvcm0gPSBBbmd1bGFyIFNjaGVtYSBGb3JtIGNvbXBhdGliaWxpdHlcbiAgLy8gd2lkZ2V0ICYgY29tcG9uZW50ID0gUmVhY3QgSnNvbnNjaGVtYSBGb3JtIGNvbXBhdGliaWxpdHlcbiAgY29uc3QgY29udHJvbFR5cGUgPSBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3R5cGUnXSxcbiAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudCddLFxuICAgIFtzY2hlbWEsICcveC1zY2hlbWEtZm9ybS93aWRnZXQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQnXSxcbiAgICBbc2NoZW1hLCAnL3dpZGdldCddXG4gIF0pO1xuICBpZiAoaXNTdHJpbmcoY29udHJvbFR5cGUpKSB7IHJldHVybiBjaGVja0lubGluZVR5cGUoY29udHJvbFR5cGUsIHNjaGVtYSwgbGF5b3V0Tm9kZSk7IH1cbiAgbGV0IHNjaGVtYVR5cGUgPSBzY2hlbWEudHlwZTtcbiAgaWYgKHNjaGVtYVR5cGUpIHtcbiAgICBpZiAoaXNBcnJheShzY2hlbWFUeXBlKSkgeyAvLyBJZiBtdWx0aXBsZSB0eXBlcyBsaXN0ZWQsIHVzZSBtb3N0IGluY2x1c2l2ZSB0eXBlXG4gICAgICBzY2hlbWFUeXBlID1cbiAgICAgICAgaW5BcnJheSgnb2JqZWN0Jywgc2NoZW1hVHlwZSkgJiYgaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSA/ICdvYmplY3QnIDpcbiAgICAgICAgaW5BcnJheSgnYXJyYXknLCBzY2hlbWFUeXBlKSAmJiBoYXNPd24oc2NoZW1hLCAnaXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdhcnJheScsIHNjaGVtYVR5cGUpICYmIGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSA/ICdhcnJheScgOlxuICAgICAgICBpbkFycmF5KCdzdHJpbmcnLCBzY2hlbWFUeXBlKSA/ICdzdHJpbmcnIDpcbiAgICAgICAgaW5BcnJheSgnbnVtYmVyJywgc2NoZW1hVHlwZSkgPyAnbnVtYmVyJyA6XG4gICAgICAgIGluQXJyYXkoJ2ludGVnZXInLCBzY2hlbWFUeXBlKSA/ICdpbnRlZ2VyJyA6XG4gICAgICAgIGluQXJyYXkoJ2Jvb2xlYW4nLCBzY2hlbWFUeXBlKSA/ICdib29sZWFuJyA6ICd1bmtub3duJztcbiAgICB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdib29sZWFuJykgeyByZXR1cm4gJ2NoZWNrYm94JzsgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICdwcm9wZXJ0aWVzJykgfHwgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykpIHtcbiAgICAgICAgcmV0dXJuICdzZWN0aW9uJztcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIGhhbmRsZSBhZGRpdGlvbmFsUHJvcGVydGllc1xuICAgICAgaWYgKGhhc093bihzY2hlbWEsICckcmVmJykpIHsgcmV0dXJuICckcmVmJzsgfVxuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgY29uc3QgaXRlbXNPYmplY3QgPSBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgICAgIFtzY2hlbWEsICcvaXRlbXMnXSxcbiAgICAgICAgW3NjaGVtYSwgJy9hZGRpdGlvbmFsSXRlbXMnXVxuICAgICAgXSkgfHwge307XG4gICAgICByZXR1cm4gaGFzT3duKGl0ZW1zT2JqZWN0LCAnZW51bScpICYmIHNjaGVtYS5tYXhJdGVtcyAhPT0gMSA/XG4gICAgICAgIGNoZWNrSW5saW5lVHlwZSgnY2hlY2tib3hlcycsIHNjaGVtYSwgbGF5b3V0Tm9kZSkgOiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hVHlwZSA9PT0gJ251bGwnKSB7IHJldHVybiAnbm9uZSc7IH1cbiAgICBpZiAoSnNvblBvaW50ZXIuaGFzKGxheW91dE5vZGUsICcvb3B0aW9ucy90aXRsZU1hcCcpIHx8XG4gICAgICBoYXNPd24oc2NoZW1hLCAnZW51bScpIHx8IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYSwgbnVsbCwgdHJ1ZSlcbiAgICApIHsgcmV0dXJuICdzZWxlY3QnOyB9XG4gICAgaWYgKHNjaGVtYVR5cGUgPT09ICdudW1iZXInIHx8IHNjaGVtYVR5cGUgPT09ICdpbnRlZ2VyJykge1xuICAgICAgcmV0dXJuIChzY2hlbWFUeXBlID09PSAnaW50ZWdlcicgfHwgaGFzT3duKHNjaGVtYSwgJ211bHRpcGxlT2YnKSkgJiZcbiAgICAgICAgaGFzT3duKHNjaGVtYSwgJ21heGltdW0nKSAmJiBoYXNPd24oc2NoZW1hLCAnbWluaW11bScpID8gJ3JhbmdlJyA6IHNjaGVtYVR5cGU7XG4gICAgfVxuICAgIGlmIChzY2hlbWFUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2NvbG9yJzogJ2NvbG9yJyxcbiAgICAgICAgJ2RhdGUnOiAnZGF0ZScsXG4gICAgICAgICdkYXRlLXRpbWUnOiAnZGF0ZXRpbWUtbG9jYWwnLFxuICAgICAgICAnZW1haWwnOiAnZW1haWwnLFxuICAgICAgICAndXJpJzogJ3VybCcsXG4gICAgICB9W3NjaGVtYS5mb3JtYXRdIHx8ICd0ZXh0JztcbiAgICB9XG4gIH1cbiAgaWYgKGhhc093bihzY2hlbWEsICckcmVmJykpIHsgcmV0dXJuICckcmVmJzsgfVxuICBpZiAoaXNBcnJheShzY2hlbWEub25lT2YpIHx8IGlzQXJyYXkoc2NoZW1hLmFueU9mKSkgeyByZXR1cm4gJ29uZS1vZic7IH1cbiAgY29uc29sZS5lcnJvcihgZ2V0SW5wdXRUeXBlIGVycm9yOiBVbmFibGUgdG8gZGV0ZXJtaW5lIGlucHV0IHR5cGUgZm9yICR7c2NoZW1hVHlwZX1gKTtcbiAgY29uc29sZS5lcnJvcignc2NoZW1hJywgc2NoZW1hKTtcbiAgaWYgKGxheW91dE5vZGUpIHsgY29uc29sZS5lcnJvcignbGF5b3V0Tm9kZScsIGxheW91dE5vZGUpOyB9XG4gIHJldHVybiAnbm9uZSc7XG59XG5cbi8qKlxuICogJ2NoZWNrSW5saW5lVHlwZScgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgbGF5b3V0IGFuZCBzY2hlbWEgbm9kZXMgZm9yICdpbmxpbmU6IHRydWUnLCBhbmQgY29udmVydHNcbiAqICdyYWRpb3MnIG9yICdjaGVja2JveGVzJyB0byAncmFkaW9zLWlubGluZScgb3IgJ2NoZWNrYm94ZXMtaW5saW5lJ1xuICpcbiAqIEBwYXJhbSAgeyBzdHJpbmcgfSBjb250cm9sVHlwZSAtXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hIC1cbiAqIEBwYXJhbSAgeyBhbnkgPSBudWxsIH0gbGF5b3V0Tm9kZSAtXG4gKiBAcmV0dXJuIHsgc3RyaW5nIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSW5saW5lVHlwZShjb250cm9sVHlwZSwgc2NoZW1hLCBsYXlvdXROb2RlOiBhbnkgPSBudWxsKSB7XG4gIGlmICghaXNTdHJpbmcoY29udHJvbFR5cGUpIHx8IChcbiAgICBjb250cm9sVHlwZS5zbGljZSgwLCA4KSAhPT0gJ2NoZWNrYm94JyAmJiBjb250cm9sVHlwZS5zbGljZSgwLCA1KSAhPT0gJ3JhZGlvJ1xuICApKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xUeXBlO1xuICB9XG4gIGlmIChcbiAgICBKc29uUG9pbnRlci5nZXRGaXJzdChbXG4gICAgICBbbGF5b3V0Tm9kZSwgJy9pbmxpbmUnXSxcbiAgICAgIFtsYXlvdXROb2RlLCAnL29wdGlvbnMvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL29wdGlvbnMvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy94LXNjaGVtYS1mb3JtL3dpZGdldC9jb21wb25lbnQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vd2lkZ2V0L2NvbXBvbmVudC9vcHRpb25zL2lubGluZSddLFxuICAgICAgW3NjaGVtYSwgJy93aWRnZXQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQvaW5saW5lJ10sXG4gICAgICBbc2NoZW1hLCAnL3dpZGdldC9jb21wb25lbnQvb3B0aW9ucy9pbmxpbmUnXSxcbiAgICBdKSA9PT0gdHJ1ZVxuICApIHtcbiAgICByZXR1cm4gY29udHJvbFR5cGUuc2xpY2UoMCwgNSkgPT09ICdyYWRpbycgP1xuICAgICAgJ3JhZGlvcy1pbmxpbmUnIDogJ2NoZWNrYm94ZXMtaW5saW5lJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29udHJvbFR5cGU7XG4gIH1cbn1cblxuLyoqXG4gKiAnaXNJbnB1dFJlcXVpcmVkJyBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBhIEpTT04gU2NoZW1hIHRvIHNlZSBpZiBhbiBpdGVtIGlzIHJlcXVpcmVkXG4gKlxuICogQHBhcmFtICB7IGFueSB9IHNjaGVtYSAtIHRoZSBzY2hlbWEgdG8gY2hlY2tcbiAqIEBwYXJhbSAgeyBzdHJpbmcgfSBzY2hlbWFQb2ludGVyIC0gdGhlIHBvaW50ZXIgdG8gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIEByZXR1cm4geyBib29sZWFuIH0gLSB0cnVlIGlmIHRoZSBpdGVtIGlzIHJlcXVpcmVkLCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5wdXRSZXF1aXJlZChzY2hlbWEsIHNjaGVtYVBvaW50ZXIpIHtcbiAgaWYgKCFpc09iamVjdChzY2hlbWEpKSB7XG4gICAgY29uc29sZS5lcnJvcignaXNJbnB1dFJlcXVpcmVkIGVycm9yOiBJbnB1dCBzY2hlbWEgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGxpc3RQb2ludGVyQXJyYXkgPSBKc29uUG9pbnRlci5wYXJzZShzY2hlbWFQb2ludGVyKTtcbiAgaWYgKGlzQXJyYXkobGlzdFBvaW50ZXJBcnJheSkpIHtcbiAgICBpZiAoIWxpc3RQb2ludGVyQXJyYXkubGVuZ3RoKSB7IHJldHVybiBzY2hlbWEucmVxdWlyZWQgPT09IHRydWU7IH1cbiAgICBjb25zdCBrZXlOYW1lID0gbGlzdFBvaW50ZXJBcnJheS5wb3AoKTtcbiAgICBjb25zdCBuZXh0VG9MYXN0S2V5ID0gbGlzdFBvaW50ZXJBcnJheVtsaXN0UG9pbnRlckFycmF5Lmxlbmd0aCAtIDFdO1xuICAgIGlmIChbJ3Byb3BlcnRpZXMnLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnLCAncGF0dGVyblByb3BlcnRpZXMnLCAnaXRlbXMnLCAnYWRkaXRpb25hbEl0ZW1zJ11cbiAgICAgIC5pbmNsdWRlcyhuZXh0VG9MYXN0S2V5KVxuICAgICkge1xuICAgICAgbGlzdFBvaW50ZXJBcnJheS5wb3AoKTtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50U2NoZW1hID0gSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgbGlzdFBvaW50ZXJBcnJheSkgfHwge307XG4gICAgaWYgKGlzQXJyYXkocGFyZW50U2NoZW1hLnJlcXVpcmVkKSkge1xuICAgICAgcmV0dXJuIHBhcmVudFNjaGVtYS5yZXF1aXJlZC5pbmNsdWRlcyhrZXlOYW1lKTtcbiAgICB9XG4gICAgaWYgKHBhcmVudFNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgICByZXR1cm4gaGFzT3duKHBhcmVudFNjaGVtYSwgJ21pbkl0ZW1zJykgJiZcbiAgICAgICAgaXNOdW1iZXIoa2V5TmFtZSkgJiZcbiAgICAgICAgK3BhcmVudFNjaGVtYS5taW5JdGVtcyA+ICtrZXlOYW1lO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogJ3VwZGF0ZUlucHV0T3B0aW9ucycgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gbGF5b3V0Tm9kZVxuICogQHBhcmFtICB7IGFueSB9IHNjaGVtYVxuICogQHBhcmFtICB7IGFueSB9IGpzZlxuICogQHJldHVybiB7IHZvaWQgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlSW5wdXRPcHRpb25zKGxheW91dE5vZGUsIHNjaGVtYSwganNmKSB7XG4gIGlmICghaXNPYmplY3QobGF5b3V0Tm9kZSkgfHwgIWlzT2JqZWN0KGxheW91dE5vZGUub3B0aW9ucykpIHsgcmV0dXJuOyB9XG5cbiAgLy8gU2V0IGFsbCBvcHRpb24gdmFsdWVzIGluIGxheW91dE5vZGUub3B0aW9uc1xuICBjb25zdCBuZXdPcHRpb25zOiBhbnkgPSB7IH07XG4gIGNvbnN0IGZpeFVpS2V5cyA9IGtleSA9PiBrZXkuc2xpY2UoMCwgMykudG9Mb3dlckNhc2UoKSA9PT0gJ3VpOicgPyBrZXkuc2xpY2UoMykgOiBrZXk7XG4gIG1lcmdlRmlsdGVyZWRPYmplY3QobmV3T3B0aW9ucywganNmLmZvcm1PcHRpb25zLmRlZmF1dFdpZGdldE9wdGlvbnMsIFtdLCBmaXhVaUtleXMpO1xuICBbIFsgSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgJy91aTp3aWRnZXQvb3B0aW9ucycpLCBbXSBdLFxuICAgIFsgSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgJy91aTp3aWRnZXQnKSwgW10gXSxcbiAgICBbIHNjaGVtYSwgW1xuICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJywgJ2FkZGl0aW9uYWxJdGVtcycsICdwcm9wZXJ0aWVzJywgJ2l0ZW1zJyxcbiAgICAgICdyZXF1aXJlZCcsICd0eXBlJywgJ3gtc2NoZW1hLWZvcm0nLCAnJHJlZidcbiAgICBdIF0sXG4gICAgWyBKc29uUG9pbnRlci5nZXQoc2NoZW1hLCAnL3gtc2NoZW1hLWZvcm0vb3B0aW9ucycpLCBbXSBdLFxuICAgIFsgSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgJy94LXNjaGVtYS1mb3JtJyksIFsnaXRlbXMnLCAnb3B0aW9ucyddIF0sXG4gICAgWyBsYXlvdXROb2RlLCBbXG4gICAgICAnX2lkJywgJyRyZWYnLCAnYXJyYXlJdGVtJywgJ2FycmF5SXRlbVR5cGUnLCAnZGF0YVBvaW50ZXInLCAnZGF0YVR5cGUnLFxuICAgICAgJ2l0ZW1zJywgJ2tleScsICduYW1lJywgJ29wdGlvbnMnLCAncmVjdXJzaXZlUmVmZXJlbmNlJywgJ3R5cGUnLCAnd2lkZ2V0J1xuICAgIF0gXSxcbiAgICBbIGxheW91dE5vZGUub3B0aW9ucywgW10gXSxcbiAgXS5mb3JFYWNoKChbIG9iamVjdCwgZXhjbHVkZUtleXMgXSkgPT5cbiAgICBtZXJnZUZpbHRlcmVkT2JqZWN0KG5ld09wdGlvbnMsIG9iamVjdCwgZXhjbHVkZUtleXMsIGZpeFVpS2V5cylcbiAgKTtcbiAgaWYgKCFoYXNPd24obmV3T3B0aW9ucywgJ3RpdGxlTWFwJykpIHtcbiAgICBsZXQgbmV3VGl0bGVNYXA6IGFueSA9IG51bGw7XG4gICAgbmV3VGl0bGVNYXAgPSBnZXRUaXRsZU1hcEZyb21PbmVPZihzY2hlbWEsIG5ld09wdGlvbnMuZmxhdExpc3QpO1xuICAgIGlmIChuZXdUaXRsZU1hcCkgeyBuZXdPcHRpb25zLnRpdGxlTWFwID0gbmV3VGl0bGVNYXA7IH1cbiAgICBpZiAoIWhhc093bihuZXdPcHRpb25zLCAndGl0bGVNYXAnKSAmJiAhaGFzT3duKG5ld09wdGlvbnMsICdlbnVtJykgJiYgaGFzT3duKHNjaGVtYSwgJ2l0ZW1zJykpIHtcbiAgICAgIGlmIChKc29uUG9pbnRlci5oYXMoc2NoZW1hLCAnL2l0ZW1zL3RpdGxlTWFwJykpIHtcbiAgICAgICAgbmV3T3B0aW9ucy50aXRsZU1hcCA9IHNjaGVtYS5pdGVtcy50aXRsZU1hcDtcbiAgICAgIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKHNjaGVtYSwgJy9pdGVtcy9lbnVtJykpIHtcbiAgICAgICAgbmV3T3B0aW9ucy5lbnVtID0gc2NoZW1hLml0ZW1zLmVudW07XG4gICAgICAgIGlmICghaGFzT3duKG5ld09wdGlvbnMsICdlbnVtTmFtZXMnKSAmJiBKc29uUG9pbnRlci5oYXMoc2NoZW1hLCAnL2l0ZW1zL2VudW1OYW1lcycpKSB7XG4gICAgICAgICAgbmV3T3B0aW9ucy5lbnVtTmFtZXMgPSBzY2hlbWEuaXRlbXMuZW51bU5hbWVzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKEpzb25Qb2ludGVyLmhhcyhzY2hlbWEsICcvaXRlbXMvb25lT2YnKSkge1xuICAgICAgICBuZXdUaXRsZU1hcCA9IGdldFRpdGxlTWFwRnJvbU9uZU9mKHNjaGVtYS5pdGVtcywgbmV3T3B0aW9ucy5mbGF0TGlzdCk7XG4gICAgICAgIGlmIChuZXdUaXRsZU1hcCkgeyBuZXdPcHRpb25zLnRpdGxlTWFwID0gbmV3VGl0bGVNYXA7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBzY2hlbWEgdHlwZSBpcyBpbnRlZ2VyLCBlbmZvcmNlIGJ5IHNldHRpbmcgbXVsdGlwbGVPZiA9IDFcbiAgaWYgKHNjaGVtYS50eXBlID09PSAnaW50ZWdlcicgJiYgIWhhc1ZhbHVlKG5ld09wdGlvbnMubXVsdGlwbGVPZikpIHtcbiAgICBuZXdPcHRpb25zLm11bHRpcGxlT2YgPSAxO1xuICB9XG5cbiAgLy8gQ29weSBhbnkgdHlwZWFoZWFkIHdvcmQgbGlzdHMgdG8gb3B0aW9ucy50eXBlYWhlYWQuc291cmNlXG4gIGlmIChKc29uUG9pbnRlci5oYXMobmV3T3B0aW9ucywgJy9hdXRvY29tcGxldGUvc291cmNlJykpIHtcbiAgICBuZXdPcHRpb25zLnR5cGVhaGVhZCA9IG5ld09wdGlvbnMuYXV0b2NvbXBsZXRlO1xuICB9IGVsc2UgaWYgKEpzb25Qb2ludGVyLmhhcyhuZXdPcHRpb25zLCAnL3RhZ3NpbnB1dC9zb3VyY2UnKSkge1xuICAgIG5ld09wdGlvbnMudHlwZWFoZWFkID0gbmV3T3B0aW9ucy50YWdzaW5wdXQ7XG4gIH0gZWxzZSBpZiAoSnNvblBvaW50ZXIuaGFzKG5ld09wdGlvbnMsICcvdGFnc2lucHV0L3R5cGVhaGVhZC9zb3VyY2UnKSkge1xuICAgIG5ld09wdGlvbnMudHlwZWFoZWFkID0gbmV3T3B0aW9ucy50YWdzaW5wdXQudHlwZWFoZWFkO1xuICB9XG5cbiAgbGF5b3V0Tm9kZS5vcHRpb25zID0gbmV3T3B0aW9ucztcbn1cblxuLyoqXG4gKiAnZ2V0VGl0bGVNYXBGcm9tT25lT2YnIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICB7IHNjaGVtYSB9IHNjaGVtYVxuICogQHBhcmFtICB7IGJvb2xlYW4gPSBudWxsIH0gZmxhdExpc3RcbiAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSB2YWxpZGF0ZU9ubHlcbiAqIEByZXR1cm4geyB2YWxpZGF0b3JzIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpdGxlTWFwRnJvbU9uZU9mKFxuICBzY2hlbWE6IGFueSA9IHt9LCBmbGF0TGlzdDogYm9vbGVhbiA9IG51bGwsIHZhbGlkYXRlT25seSA9IGZhbHNlXG4pIHtcbiAgbGV0IHRpdGxlTWFwID0gbnVsbDtcbiAgY29uc3Qgb25lT2YgPSBzY2hlbWEub25lT2YgfHwgc2NoZW1hLmFueU9mIHx8IG51bGw7XG4gIGlmIChpc0FycmF5KG9uZU9mKSAmJiBvbmVPZi5ldmVyeShpdGVtID0+IGl0ZW0udGl0bGUpKSB7XG4gICAgaWYgKG9uZU9mLmV2ZXJ5KGl0ZW0gPT4gaXNBcnJheShpdGVtLmVudW0pICYmIGl0ZW0uZW51bS5sZW5ndGggPT09IDEpKSB7XG4gICAgICBpZiAodmFsaWRhdGVPbmx5KSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB0aXRsZU1hcCA9IG9uZU9mLm1hcChpdGVtID0+ICh7IG5hbWU6IGl0ZW0udGl0bGUsIHZhbHVlOiBpdGVtLmVudW1bMF0gfSkpO1xuICAgIH0gZWxzZSBpZiAob25lT2YuZXZlcnkoaXRlbSA9PiBpdGVtLmNvbnN0KSkge1xuICAgICAgaWYgKHZhbGlkYXRlT25seSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgdGl0bGVNYXAgPSBvbmVPZi5tYXAoaXRlbSA9PiAoeyBuYW1lOiBpdGVtLnRpdGxlLCB2YWx1ZTogaXRlbS5jb25zdCB9KSk7XG4gICAgfVxuXG4gICAgLy8gaWYgZmxhdExpc3QgIT09IGZhbHNlIGFuZCBzb21lIGl0ZW1zIGhhdmUgY29sb25zLCBtYWtlIGdyb3VwZWQgbWFwXG4gICAgaWYgKGZsYXRMaXN0ICE9PSBmYWxzZSAmJiAodGl0bGVNYXAgfHwgW10pXG4gICAgICAuZmlsdGVyKHRpdGxlID0+ICgodGl0bGUgfHwge30pLm5hbWUgfHwgJycpLmluZGV4T2YoJzogJykpLmxlbmd0aCA+IDFcbiAgICApIHtcblxuICAgICAgLy8gU3BsaXQgbmFtZSBvbiBmaXJzdCBjb2xvbiB0byBjcmVhdGUgZ3JvdXBlZCBtYXAgKG5hbWUgLT4gZ3JvdXA6IG5hbWUpXG4gICAgICBjb25zdCBuZXdUaXRsZU1hcCA9IHRpdGxlTWFwLm1hcCh0aXRsZSA9PiB7XG4gICAgICAgIGNvbnN0IFtncm91cCwgbmFtZV0gPSB0aXRsZS5uYW1lLnNwbGl0KC86ICguKykvKTtcbiAgICAgICAgcmV0dXJuIGdyb3VwICYmIG5hbWUgPyB7IC4uLnRpdGxlLCBncm91cCwgbmFtZSB9IDogdGl0bGU7XG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgZmxhdExpc3QgPT09IHRydWUgb3IgYXQgbGVhc3Qgb25lIGdyb3VwIGhhcyBtdWx0aXBsZSBpdGVtcywgdXNlIGdyb3VwZWQgbWFwXG4gICAgICBpZiAoZmxhdExpc3QgPT09IHRydWUgfHwgbmV3VGl0bGVNYXAuc29tZSgodGl0bGUsIGluZGV4KSA9PiBpbmRleCAmJlxuICAgICAgICBoYXNPd24odGl0bGUsICdncm91cCcpICYmIHRpdGxlLmdyb3VwID09PSBuZXdUaXRsZU1hcFtpbmRleCAtIDFdLmdyb3VwXG4gICAgICApKSB7XG4gICAgICAgIHRpdGxlTWFwID0gbmV3VGl0bGVNYXA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWxpZGF0ZU9ubHkgPyBmYWxzZSA6IHRpdGxlTWFwO1xufVxuXG4vKipcbiAqICdnZXRDb250cm9sVmFsaWRhdG9ycycgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geyBhbnkgfSBzY2hlbWFcbiAqIEByZXR1cm4geyB2YWxpZGF0b3JzIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xWYWxpZGF0b3JzKHNjaGVtYSkge1xuICBpZiAoIWlzT2JqZWN0KHNjaGVtYSkpIHsgcmV0dXJuIG51bGw7IH1cbiAgY29uc3QgdmFsaWRhdG9yczogYW55ID0geyB9O1xuICBpZiAoaGFzT3duKHNjaGVtYSwgJ3R5cGUnKSkge1xuICAgIHN3aXRjaCAoc2NoZW1hLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGZvckVhY2goWydwYXR0ZXJuJywgJ2Zvcm1hdCcsICdtaW5MZW5ndGgnLCAnbWF4TGVuZ3RoJ10sIChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIHByb3ApKSB7IHZhbGlkYXRvcnNbcHJvcF0gPSBbc2NoZW1hW3Byb3BdXTsgfVxuICAgICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzogY2FzZSAnaW50ZWdlcic6XG4gICAgICAgIGZvckVhY2goWydNaW5pbXVtJywgJ01heGltdW0nXSwgKHVjTGltaXQpID0+IHtcbiAgICAgICAgICBjb25zdCBlTGltaXQgPSAnZXhjbHVzaXZlJyArIHVjTGltaXQ7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSB1Y0xpbWl0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIGxpbWl0KSkge1xuICAgICAgICAgICAgY29uc3QgZXhjbHVzaXZlID0gaGFzT3duKHNjaGVtYSwgZUxpbWl0KSAmJiBzY2hlbWFbZUxpbWl0XSA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRvcnNbbGltaXRdID0gW3NjaGVtYVtsaW1pdF0sIGV4Y2x1c2l2ZV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZm9yRWFjaChbJ211bHRpcGxlT2YnLCAndHlwZSddLCAocHJvcCkgPT4ge1xuICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hLCBwcm9wKSkgeyB2YWxpZGF0b3JzW3Byb3BdID0gW3NjaGVtYVtwcm9wXV07IH1cbiAgICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGZvckVhY2goWydtaW5Qcm9wZXJ0aWVzJywgJ21heFByb3BlcnRpZXMnLCAnZGVwZW5kZW5jaWVzJ10sIChwcm9wKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bihzY2hlbWEsIHByb3ApKSB7IHZhbGlkYXRvcnNbcHJvcF0gPSBbc2NoZW1hW3Byb3BdXTsgfVxuICAgICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBmb3JFYWNoKFsnbWluSXRlbXMnLCAnbWF4SXRlbXMnLCAndW5pcXVlSXRlbXMnXSwgKHByb3ApID0+IHtcbiAgICAgICAgICBpZiAoaGFzT3duKHNjaGVtYSwgcHJvcCkpIHsgdmFsaWRhdG9yc1twcm9wXSA9IFtzY2hlbWFbcHJvcF1dOyB9XG4gICAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChoYXNPd24oc2NoZW1hLCAnZW51bScpKSB7IHZhbGlkYXRvcnMuZW51bSA9IFtzY2hlbWEuZW51bV07IH1cbiAgcmV0dXJuIHZhbGlkYXRvcnM7XG59XG5cbi8qKlxuICogJ3Jlc29sdmVTY2hlbWFSZWZlcmVuY2VzJyBmdW5jdGlvblxuICpcbiAqIEZpbmQgYWxsICRyZWYgbGlua3MgaW4gc2NoZW1hIGFuZCBzYXZlIGxpbmtzIGFuZCByZWZlcmVuY2VkIHNjaGVtYXMgaW5cbiAqIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgYW5kIGRhdGFSZWN1cnNpdmVSZWZNYXBcbiAqXG4gKiBAcGFyYW0geyBhbnkgfSBzY2hlbWFcbiAqIEBwYXJhbSB7IGFueSB9IHNjaGVtYVJlZkxpYnJhcnlcbiAqIEBwYXJhbSB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSBzY2hlbWFSZWN1cnNpdmVSZWZNYXBcbiAqIEBwYXJhbSB7IE1hcDxzdHJpbmcsIHN0cmluZz4gfSBkYXRhUmVjdXJzaXZlUmVmTWFwXG4gKiBAcGFyYW0geyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXBcbiAqIEByZXR1cm4geyBhbnkgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNjaGVtYVJlZmVyZW5jZXMoXG4gIHNjaGVtYSwgc2NoZW1hUmVmTGlicmFyeSwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwLCBkYXRhUmVjdXJzaXZlUmVmTWFwLCBhcnJheU1hcFxuKSB7XG4gIGlmICghaXNPYmplY3Qoc2NoZW1hKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3Jlc29sdmVTY2hlbWFSZWZlcmVuY2VzIGVycm9yOiBzY2hlbWEgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHJlZkxpbmtzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHJlZk1hcFNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCByZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWN1cnNpdmVSZWZNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCByZWZMaWJyYXJ5OiBhbnkgPSB7fTtcblxuICAvLyBTZWFyY2ggc2NoZW1hIGZvciBhbGwgJHJlZiBsaW5rcywgYW5kIGJ1aWxkIGZ1bGwgcmVmTGlicmFyeVxuICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChzY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaGFzT3duKHN1YlNjaGVtYSwgJyRyZWYnKSAmJiBpc1N0cmluZyhzdWJTY2hlbWFbJyRyZWYnXSkpIHtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSBKc29uUG9pbnRlci5jb21waWxlKHN1YlNjaGVtYVsnJHJlZiddKTtcbiAgICAgIHJlZkxpbmtzLmFkZChyZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcFNldC5hZGQoc3ViU2NoZW1hUG9pbnRlciArICd+ficgKyByZWZQb2ludGVyKTtcbiAgICAgIHJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgfVxuICB9KTtcbiAgcmVmTGlua3MuZm9yRWFjaChyZWYgPT4gcmVmTGlicmFyeVtyZWZdID0gZ2V0U3ViU2NoZW1hKHNjaGVtYSwgcmVmKSk7XG5cbiAgLy8gRm9sbG93IGFsbCByZWYgbGlua3MgYW5kIHNhdmUgaW4gcmVmTWFwU2V0LFxuICAvLyB0byBmaW5kIGFueSBtdWx0aS1saW5rIHJlY3Vyc2l2ZSByZWZlcm5jZXNcbiAgbGV0IGNoZWNrUmVmTGlua3MgPSB0cnVlO1xuICB3aGlsZSAoY2hlY2tSZWZMaW5rcykge1xuICAgIGNoZWNrUmVmTGlua3MgPSBmYWxzZTtcbiAgICBBcnJheS5mcm9tKHJlZk1hcCkuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYyLCB0b1JlZjEsIHRydWUpICYmXG4gICAgICAgICFyZWZNYXBTZXQuaGFzKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKVxuICAgICAgKVxuICAgICAgLmZvckVhY2goKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT4ge1xuICAgICAgICByZWZNYXBTZXQuYWRkKGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCkgKyAnfn4nICsgdG9SZWYyKTtcbiAgICAgICAgY2hlY2tSZWZMaW5rcyA9IHRydWU7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvLyBCdWlsZCBmdWxsIHJlY3Vyc2l2ZVJlZk1hcFxuICAvLyBGaXJzdCBwYXNzIC0gc2F2ZSBhbGwgaW50ZXJuYWxseSByZWN1cnNpdmUgcmVmcyBmcm9tIHJlZk1hcFNldFxuICBBcnJheS5mcm9tKHJlZk1hcFNldClcbiAgICAubWFwKHJlZkxpbmsgPT4gcmVmTGluay5zcGxpdCgnfn4nKSlcbiAgICAuZmlsdGVyKChbZnJvbVJlZiwgdG9SZWZdKSA9PiBKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYsIGZyb21SZWYpKVxuICAgIC5mb3JFYWNoKChbZnJvbVJlZiwgdG9SZWZdKSA9PiByZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21SZWYsIHRvUmVmKSk7XG4gIC8vIFNlY29uZCBwYXNzIC0gY3JlYXRlIHJlY3Vyc2l2ZSB2ZXJzaW9ucyBvZiBhbnkgb3RoZXIgcmVmcyB0aGF0IGxpbmsgdG8gcmVjdXJzaXZlIHJlZnNcbiAgQXJyYXkuZnJvbShyZWZNYXApXG4gICAgLmZpbHRlcigoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcC5rZXlzKCkpXG4gICAgICAuZXZlcnkoZnJvbVJlZjIgPT4gIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihmcm9tUmVmMSwgZnJvbVJlZjIsIHRydWUpKVxuICAgIClcbiAgICAuZm9yRWFjaCgoW2Zyb21SZWYxLCB0b1JlZjFdKSA9PiBBcnJheS5mcm9tKHJlY3Vyc2l2ZVJlZk1hcClcbiAgICAgIC5maWx0ZXIoKFtmcm9tUmVmMiwgdG9SZWYyXSkgPT5cbiAgICAgICAgIXJlY3Vyc2l2ZVJlZk1hcC5oYXMoZnJvbVJlZjEgKyBmcm9tUmVmMi5zbGljZSh0b1JlZjEubGVuZ3RoKSkgJiZcbiAgICAgICAgSnNvblBvaW50ZXIuaXNTdWJQb2ludGVyKHRvUmVmMSwgZnJvbVJlZjIsIHRydWUpICYmXG4gICAgICAgICFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIodG9SZWYxLCBmcm9tUmVmMSwgdHJ1ZSlcbiAgICAgIClcbiAgICAgIC5mb3JFYWNoKChbZnJvbVJlZjIsIHRvUmVmMl0pID0+IHJlY3Vyc2l2ZVJlZk1hcC5zZXQoXG4gICAgICAgIGZyb21SZWYxICsgZnJvbVJlZjIuc2xpY2UodG9SZWYxLmxlbmd0aCksXG4gICAgICAgIGZyb21SZWYxICsgdG9SZWYyLnNsaWNlKHRvUmVmMS5sZW5ndGgpXG4gICAgICApKVxuICAgICk7XG5cbiAgLy8gQ3JlYXRlIGNvbXBpbGVkIHNjaGVtYSBieSByZXBsYWNpbmcgYWxsIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoXG4gIC8vIHRoaWVpciBsaW5rZWQgc2NoZW1hcyBhbmQsIHdoZXJlIHBvc3NpYmxlLCBjb21iaW5pbmcgc2NoZW1hcyBpbiBhbGxPZiBhcnJheXMuXG4gIGxldCBjb21waWxlZFNjaGVtYSA9IHsgLi4uc2NoZW1hIH07XG4gIGRlbGV0ZSBjb21waWxlZFNjaGVtYS5kZWZpbml0aW9ucztcbiAgY29tcGlsZWRTY2hlbWEgPVxuICAgIGdldFN1YlNjaGVtYShjb21waWxlZFNjaGVtYSwgJycsIHJlZkxpYnJhcnksIHJlY3Vyc2l2ZVJlZk1hcCk7XG5cbiAgLy8gTWFrZSBzdXJlIGFsbCByZW1haW5pbmcgc2NoZW1hICRyZWZzIGFyZSByZWN1cnNpdmUsIGFuZCBidWlsZCBmaW5hbFxuICAvLyBzY2hlbWFSZWZMaWJyYXJ5LCBzY2hlbWFSZWN1cnNpdmVSZWZNYXAsIGRhdGFSZWN1cnNpdmVSZWZNYXAsICYgYXJyYXlNYXBcbiAgSnNvblBvaW50ZXIuZm9yRWFjaERlZXAoY29tcGlsZWRTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlNjaGVtYVBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNTdHJpbmcoc3ViU2NoZW1hWyckcmVmJ10pKSB7XG4gICAgICBsZXQgcmVmUG9pbnRlciA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc3ViU2NoZW1hWyckcmVmJ10pO1xuICAgICAgaWYgKCFKc29uUG9pbnRlci5pc1N1YlBvaW50ZXIocmVmUG9pbnRlciwgc3ViU2NoZW1hUG9pbnRlciwgdHJ1ZSkpIHtcbiAgICAgICAgcmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoc3ViU2NoZW1hUG9pbnRlciwgcmVjdXJzaXZlUmVmTWFwKTtcbiAgICAgICAgSnNvblBvaW50ZXIuc2V0KGNvbXBpbGVkU2NoZW1hLCBzdWJTY2hlbWFQb2ludGVyLCB7ICRyZWY6IGAjJHtyZWZQb2ludGVyfWAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWhhc093bihzY2hlbWFSZWZMaWJyYXJ5LCAncmVmUG9pbnRlcicpKSB7XG4gICAgICAgIHNjaGVtYVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSAhcmVmUG9pbnRlci5sZW5ndGggPyBjb21waWxlZFNjaGVtYSA6XG4gICAgICAgICAgZ2V0U3ViU2NoZW1hKGNvbXBpbGVkU2NoZW1hLCByZWZQb2ludGVyLCBzY2hlbWFSZWZMaWJyYXJ5LCByZWN1cnNpdmVSZWZNYXApO1xuICAgICAgfVxuICAgICAgaWYgKCFzY2hlbWFSZWN1cnNpdmVSZWZNYXAuaGFzKHN1YlNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcC5zZXQoc3ViU2NoZW1hUG9pbnRlciwgcmVmUG9pbnRlcik7XG4gICAgICB9XG4gICAgICBjb25zdCBmcm9tRGF0YVJlZiA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFkYXRhUmVjdXJzaXZlUmVmTWFwLmhhcyhmcm9tRGF0YVJlZikpIHtcbiAgICAgICAgY29uc3QgdG9EYXRhUmVmID0gSnNvblBvaW50ZXIudG9EYXRhUG9pbnRlcihyZWZQb2ludGVyLCBjb21waWxlZFNjaGVtYSk7XG4gICAgICAgIGRhdGFSZWN1cnNpdmVSZWZNYXAuc2V0KGZyb21EYXRhUmVmLCB0b0RhdGFSZWYpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3ViU2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiZcbiAgICAgIChoYXNPd24oc3ViU2NoZW1hLCAnaXRlbXMnKSB8fCBoYXNPd24oc3ViU2NoZW1hLCAnYWRkaXRpb25hbEl0ZW1zJykpXG4gICAgKSB7XG4gICAgICBjb25zdCBkYXRhUG9pbnRlciA9IEpzb25Qb2ludGVyLnRvRGF0YVBvaW50ZXIoc3ViU2NoZW1hUG9pbnRlciwgY29tcGlsZWRTY2hlbWEpO1xuICAgICAgaWYgKCFhcnJheU1hcC5oYXMoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnN0IHR1cGxlSXRlbXMgPSBpc0FycmF5KHN1YlNjaGVtYS5pdGVtcykgPyBzdWJTY2hlbWEuaXRlbXMubGVuZ3RoIDogMDtcbiAgICAgICAgYXJyYXlNYXAuc2V0KGRhdGFQb2ludGVyLCB0dXBsZUl0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuICByZXR1cm4gY29tcGlsZWRTY2hlbWE7XG59XG5cbi8qKlxuICogJ2dldFN1YlNjaGVtYScgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hXG4gKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBvaW50ZXJcbiAqIEBwYXJhbSAgeyBvYmplY3QgfSBzY2hlbWFSZWZMaWJyYXJ5XG4gKiBAcGFyYW0gIHsgTWFwPHN0cmluZywgc3RyaW5nPiB9IHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICogQHBhcmFtICB7IHN0cmluZ1tdID0gW10gfSB1c2VkUG9pbnRlcnNcbiAqIEByZXR1cm4geyBhbnkgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ViU2NoZW1hKFxuICBzY2hlbWEsIHBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnkgPSBudWxsLFxuICBzY2hlbWFSZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBudWxsLCB1c2VkUG9pbnRlcnM6IHN0cmluZ1tdID0gW11cbikge1xuICBpZiAoIXNjaGVtYVJlZkxpYnJhcnkgfHwgIXNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCkge1xuICAgIHJldHVybiBKc29uUG9pbnRlci5nZXRDb3B5KHNjaGVtYSwgcG9pbnRlcik7XG4gIH1cbiAgaWYgKHR5cGVvZiBwb2ludGVyICE9PSAnc3RyaW5nJykgeyBwb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShwb2ludGVyKTsgfVxuICB1c2VkUG9pbnRlcnMgPSBbIC4uLnVzZWRQb2ludGVycywgcG9pbnRlciBdO1xuICBsZXQgbmV3U2NoZW1hOiBhbnkgPSBudWxsO1xuICBpZiAocG9pbnRlciA9PT0gJycpIHtcbiAgICBuZXdTY2hlbWEgPSBfLmNsb25lRGVlcChzY2hlbWEpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNob3J0UG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMocG9pbnRlciwgc2NoZW1hUmVjdXJzaXZlUmVmTWFwKTtcbiAgICBpZiAoc2hvcnRQb2ludGVyICE9PSBwb2ludGVyKSB7IHVzZWRQb2ludGVycyA9IFsgLi4udXNlZFBvaW50ZXJzLCBzaG9ydFBvaW50ZXIgXTsgfVxuICAgIG5ld1NjaGVtYSA9IEpzb25Qb2ludGVyLmdldEZpcnN0Q29weShbXG4gICAgICBbc2NoZW1hUmVmTGlicmFyeSwgW3Nob3J0UG9pbnRlcl1dLFxuICAgICAgW3NjaGVtYSwgcG9pbnRlcl0sXG4gICAgICBbc2NoZW1hLCBzaG9ydFBvaW50ZXJdXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwQ29weShuZXdTY2hlbWEsIChzdWJTY2hlbWEsIHN1YlBvaW50ZXIpID0+IHtcbiAgICBpZiAoaXNPYmplY3Qoc3ViU2NoZW1hKSkge1xuXG4gICAgICAvLyBSZXBsYWNlIG5vbi1yZWN1cnNpdmUgJHJlZiBsaW5rcyB3aXRoIHJlZmVyZW5jZWQgc2NoZW1hc1xuICAgICAgaWYgKGlzU3RyaW5nKHN1YlNjaGVtYS4kcmVmKSkge1xuICAgICAgICBjb25zdCByZWZQb2ludGVyID0gSnNvblBvaW50ZXIuY29tcGlsZShzdWJTY2hlbWEuJHJlZik7XG4gICAgICAgIGlmIChyZWZQb2ludGVyLmxlbmd0aCAmJiB1c2VkUG9pbnRlcnMuZXZlcnkocHRyID0+XG4gICAgICAgICAgIUpzb25Qb2ludGVyLmlzU3ViUG9pbnRlcihyZWZQb2ludGVyLCBwdHIsIHRydWUpXG4gICAgICAgICkpIHtcbiAgICAgICAgICBjb25zdCByZWZTY2hlbWEgPSBnZXRTdWJTY2hlbWEoXG4gICAgICAgICAgICBzY2hlbWEsIHJlZlBvaW50ZXIsIHNjaGVtYVJlZkxpYnJhcnksIHNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwgdXNlZFBvaW50ZXJzXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoc3ViU2NoZW1hKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiByZWZTY2hlbWE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhS2V5cyA9IHsgLi4uc3ViU2NoZW1hIH07XG4gICAgICAgICAgICBkZWxldGUgZXh0cmFLZXlzLiRyZWY7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VTY2hlbWFzKHJlZlNjaGVtYSwgZXh0cmFLZXlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogQ29udmVydCBzY2hlbWFzIHdpdGggJ3R5cGUnIGFycmF5cyB0byAnb25lT2YnXG5cbiAgICAgIC8vIENvbWJpbmUgYWxsT2Ygc3ViU2NoZW1hc1xuICAgICAgaWYgKGlzQXJyYXkoc3ViU2NoZW1hLmFsbE9mKSkgeyByZXR1cm4gY29tYmluZUFsbE9mKHN1YlNjaGVtYSk7IH1cblxuICAgICAgLy8gRml4IGluY29ycmVjdGx5IHBsYWNlZCBhcnJheSBvYmplY3QgcmVxdWlyZWQgbGlzdHNcbiAgICAgIGlmIChzdWJTY2hlbWEudHlwZSA9PT0gJ2FycmF5JyAmJiBpc0FycmF5KHN1YlNjaGVtYS5yZXF1aXJlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzKHN1YlNjaGVtYSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdWJTY2hlbWE7XG4gIH0sIHRydWUsIDxzdHJpbmc+cG9pbnRlcik7XG59XG5cbi8qKlxuICogJ2NvbWJpbmVBbGxPZicgZnVuY3Rpb25cbiAqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgYW4gYWxsT2Ygc2NoZW1hIG9iamVjdCBpbnRvXG4gKiBhIG5vbi1hbGxPZiBzY2hlbWEgb2JqZWN0IHdpdGggZXF1aXZhbGVudCBydWxlcy5cbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hIC0gYWxsT2Ygc2NoZW1hIG9iamVjdFxuICogQHJldHVybiB7IGFueSB9IC0gY29udmVydGVkIHNjaGVtYSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVBbGxPZihzY2hlbWEpIHtcbiAgaWYgKCFpc09iamVjdChzY2hlbWEpIHx8ICFpc0FycmF5KHNjaGVtYS5hbGxPZikpIHsgcmV0dXJuIHNjaGVtYTsgfVxuICBsZXQgbWVyZ2VkU2NoZW1hID0gbWVyZ2VTY2hlbWFzKC4uLnNjaGVtYS5hbGxPZik7XG4gIGlmIChPYmplY3Qua2V5cyhzY2hlbWEpLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCBleHRyYUtleXMgPSB7IC4uLnNjaGVtYSB9O1xuICAgIGRlbGV0ZSBleHRyYUtleXMuYWxsT2Y7XG4gICAgbWVyZ2VkU2NoZW1hID0gbWVyZ2VTY2hlbWFzKG1lcmdlZFNjaGVtYSwgZXh0cmFLZXlzKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkU2NoZW1hO1xufVxuXG4vKipcbiAqICdmaXhSZXF1aXJlZEFycmF5UHJvcGVydGllcycgZnVuY3Rpb25cbiAqXG4gKiBGaXhlcyBhbiBpbmNvcnJlY3RseSBwbGFjZWQgcmVxdWlyZWQgbGlzdCBpbnNpZGUgYW4gYXJyYXkgc2NoZW1hLCBieSBtb3ZpbmdcbiAqIGl0IGludG8gaXRlbXMucHJvcGVydGllcyBvciBhZGRpdGlvbmFsSXRlbXMucHJvcGVydGllcywgd2hlcmUgaXQgYmVsb25ncy5cbiAqXG4gKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hIC0gYWxsT2Ygc2NoZW1hIG9iamVjdFxuICogQHJldHVybiB7IGFueSB9IC0gY29udmVydGVkIHNjaGVtYSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpeFJlcXVpcmVkQXJyYXlQcm9wZXJ0aWVzKHNjaGVtYSkge1xuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScgJiYgaXNBcnJheShzY2hlbWEucmVxdWlyZWQpKSB7XG4gICAgY29uc3QgaXRlbXNPYmplY3QgPSBoYXNPd24oc2NoZW1hLml0ZW1zLCAncHJvcGVydGllcycpID8gJ2l0ZW1zJyA6XG4gICAgICBoYXNPd24oc2NoZW1hLmFkZGl0aW9uYWxJdGVtcywgJ3Byb3BlcnRpZXMnKSA/ICdhZGRpdGlvbmFsSXRlbXMnIDogbnVsbDtcbiAgICBpZiAoaXRlbXNPYmplY3QgJiYgIWhhc093bihzY2hlbWFbaXRlbXNPYmplY3RdLCAncmVxdWlyZWQnKSAmJiAoXG4gICAgICBoYXNPd24oc2NoZW1hW2l0ZW1zT2JqZWN0XSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykgfHxcbiAgICAgIHNjaGVtYS5yZXF1aXJlZC5ldmVyeShrZXkgPT4gaGFzT3duKHNjaGVtYVtpdGVtc09iamVjdF0ucHJvcGVydGllcywga2V5KSlcbiAgICApKSB7XG4gICAgICBzY2hlbWEgPSBfLmNsb25lRGVlcChzY2hlbWEpO1xuICAgICAgc2NoZW1hW2l0ZW1zT2JqZWN0XS5yZXF1aXJlZCA9IHNjaGVtYS5yZXF1aXJlZDtcbiAgICAgIGRlbGV0ZSBzY2hlbWEucmVxdWlyZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBzY2hlbWE7XG59XG4iXX0=