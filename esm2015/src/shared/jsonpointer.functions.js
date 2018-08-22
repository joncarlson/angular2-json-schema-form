import { Injectable } from '@angular/core';
import { isDefined, isEmpty, isObject, isArray, isMap, isNumber, isString } from './validator.functions';
import { hasOwn, copy } from './utility.functions';
export class JsonPointer {
    /**
       * 'get' function
       *
       * Uses a JSON Pointer to retrieve a value from an object.
       *
       * @param  { object } object - Object to get value from
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { number = 0 } startSlice - Zero-based index of first Pointer key to use
       * @param  { number } endSlice - Zero-based index of last Pointer key to use
       * @param  { boolean = false } getBoolean - Return only true or false?
       * @param  { boolean = false } errors - Show error if not found?
       * @return { object } - Located value (or true or false if getBoolean = true)
       */
    static get(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        if (object === null) {
            return getBoolean ? false : undefined;
        }
        let keyArray = this.parse(pointer, errors);
        if (typeof object === 'object' && keyArray !== null) {
            let subObject = object;
            if (startSlice >= keyArray.length || endSlice <= -keyArray.length) {
                return object;
            }
            if (startSlice <= -keyArray.length) {
                startSlice = 0;
            }
            if (!isDefined(endSlice) || endSlice >= keyArray.length) {
                endSlice = keyArray.length;
            }
            keyArray = keyArray.slice(startSlice, endSlice);
            for (let key of keyArray) {
                if (key === '-' && isArray(subObject) && subObject.length) {
                    key = subObject.length - 1;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else if (typeof subObject === 'object' && subObject !== null &&
                    hasOwn(subObject, key)) {
                    subObject = subObject[key];
                }
                else {
                    if (errors) {
                        console.error(`get error: "${key}" key not found in object.`);
                        console.error(pointer);
                        console.error(object);
                    }
                    return getBoolean ? false : undefined;
                }
            }
            return getBoolean ? true : subObject;
        }
        if (errors && keyArray === null) {
            console.error(`get error: Invalid JSON Pointer: ${pointer}`);
        }
        if (errors && typeof object !== 'object') {
            console.error('get error: Invalid object:');
            console.error(object);
        }
        return getBoolean ? false : undefined;
    }
    /**
       * 'getCopy' function
       *
       * Uses a JSON Pointer to deeply clone a value from an object.
       *
       * @param  { object } object - Object to get value from
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { number = 0 } startSlice - Zero-based index of first Pointer key to use
       * @param  { number } endSlice - Zero-based index of last Pointer key to use
       * @param  { boolean = false } getBoolean - Return only true or false?
       * @param  { boolean = false } errors - Show error if not found?
       * @return { object } - Located value (or true or false if getBoolean = true)
       */
    static getCopy(object, pointer, startSlice = 0, endSlice = null, getBoolean = false, errors = false) {
        const objectToCopy = this.get(object, pointer, startSlice, endSlice, getBoolean, errors);
        return this.forEachDeepCopy(objectToCopy);
    }
    /**
       * 'getFirst' function
       *
       * Takes an array of JSON Pointers and objects,
       * checks each object for a value specified by the pointer,
       * and returns the first value found.
       *
       * @param  { [object, pointer][] } items - Array of objects and pointers to check
       * @param  { any = null } defaultValue - Value to return if nothing found
       * @param  { boolean = false } getCopy - Return a copy instead?
       * @return { any } - First value found
       */
    static getFirst(items, defaultValue = null, getCopy = false) {
        if (isEmpty(items)) {
            return;
        }
        if (isArray(items)) {
            for (const item of items) {
                if (isEmpty(item)) {
                    continue;
                }
                if (isArray(item) && item.length >= 2) {
                    if (isEmpty(item[0]) || isEmpty(item[1])) {
                        continue;
                    }
                    const value = getCopy ?
                        this.getCopy(item[0], item[1]) :
                        this.get(item[0], item[1]);
                    if (value) {
                        return value;
                    }
                    continue;
                }
                console.error('getFirst error: Input not in correct format.\n' +
                    'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
                return;
            }
            return defaultValue;
        }
        if (isMap(items)) {
            for (const [object, pointer] of items) {
                if (object === null || !this.isJsonPointer(pointer)) {
                    continue;
                }
                const value = getCopy ?
                    this.getCopy(object, pointer) :
                    this.get(object, pointer);
                if (value) {
                    return value;
                }
            }
            return defaultValue;
        }
        console.error('getFirst error: Input not in correct format.\n' +
            'Should be: [ [ object1, pointer1 ], [ object 2, pointer2 ], etc... ]');
        return defaultValue;
    }
    /**
       * 'getFirstCopy' function
       *
       * Similar to getFirst, but always returns a copy.
       *
       * @param  { [object, pointer][] } items - Array of objects and pointers to check
       * @param  { any = null } defaultValue - Value to return if nothing found
       * @return { any } - Copy of first value found
       */
    static getFirstCopy(items, defaultValue = null) {
        const firstCopy = this.getFirst(items, defaultValue, true);
        return firstCopy;
    }
    /**
       * 'set' function
       *
       * Uses a JSON Pointer to set a value on an object.
       * Also creates any missing sub objects or arrays to contain that value.
       *
       * If the optional fourth parameter is TRUE and the inner-most container
       * is an array, the function will insert the value as a new item at the
       * specified location in the array, rather than overwriting the existing
       * value (if any) at that location.
       *
       * So set([1, 2, 3], '/1', 4) => [1, 4, 3]
       * and
       * So set([1, 2, 3], '/1', 4, true) => [1, 4, 2, 3]
       *
       * @param  { object } object - The object to set value in
       * @param  { Pointer } pointer - The JSON Pointer (string or array)
       * @param  { any } value - The new value to set
       * @param  { boolean } insert - insert value?
       * @return { object } - The original object, modified with the set value
       */
    static set(object, pointer, value, insert = false) {
        const keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            let subObject = object;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                let key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject = subObject[key];
                }
            }
            const lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return object;
        }
        console.error(`set error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
    /**
       * 'setCopy' function
       *
       * Copies an object and uses a JSON Pointer to set a value on the copy.
       * Also creates any missing sub objects or arrays to contain that value.
       *
       * If the optional fourth parameter is TRUE and the inner-most container
       * is an array, the function will insert the value as a new item at the
       * specified location in the array, rather than overwriting the existing value.
       *
       * @param  { object } object - The object to copy and set value in
       * @param  { Pointer } pointer - The JSON Pointer (string or array)
       * @param  { any } value - The value to set
       * @param  { boolean } insert - insert value?
       * @return { object } - The new object with the set value
       */
    static setCopy(object, pointer, value, insert = false) {
        const keyArray = this.parse(pointer);
        if (keyArray !== null) {
            const newObject = copy(object);
            let subObject = newObject;
            for (let i = 0; i < keyArray.length - 1; ++i) {
                let key = keyArray[i];
                if (key === '-' && isArray(subObject)) {
                    key = subObject.length;
                }
                if (isMap(subObject) && subObject.has(key)) {
                    subObject.set(key, copy(subObject.get(key)));
                    subObject = subObject.get(key);
                }
                else {
                    if (!hasOwn(subObject, key)) {
                        subObject[key] = (keyArray[i + 1].match(/^(\d+|-)$/)) ? [] : {};
                    }
                    subObject[key] = copy(subObject[key]);
                    subObject = subObject[key];
                }
            }
            const lastKey = keyArray[keyArray.length - 1];
            if (isArray(subObject) && lastKey === '-') {
                subObject.push(value);
            }
            else if (insert && isArray(subObject) && !isNaN(+lastKey)) {
                subObject.splice(lastKey, 0, value);
            }
            else if (isMap(subObject)) {
                subObject.set(lastKey, value);
            }
            else {
                subObject[lastKey] = value;
            }
            return newObject;
        }
        console.error(`setCopy error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
    /**
       * 'insert' function
       *
       * Calls 'set' with insert = TRUE
       *
       * @param  { object } object - object to insert value in
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { any } value - value to insert
       * @return { object }
       */
    static insert(object, pointer, value) {
        const updatedObject = this.set(object, pointer, value, true);
        return updatedObject;
    }
    /**
       * 'insertCopy' function
       *
       * Calls 'setCopy' with insert = TRUE
       *
       * @param  { object } object - object to insert value in
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { any } value - value to insert
       * @return { object }
       */
    static insertCopy(object, pointer, value) {
        const updatedObject = this.setCopy(object, pointer, value, true);
        return updatedObject;
    }
    /**
       * 'remove' function
       *
       * Uses a JSON Pointer to remove a key and its attribute from an object
       *
       * @param  { object } object - object to delete attribute from
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @return { object }
       */
    static remove(object, pointer) {
        const keyArray = this.parse(pointer);
        if (keyArray !== null && keyArray.length) {
            let lastKey = keyArray.pop();
            const parentObject = this.get(object, keyArray);
            if (isArray(parentObject)) {
                if (lastKey === '-') {
                    lastKey = parentObject.length - 1;
                }
                parentObject.splice(lastKey, 1);
            }
            else if (isObject(parentObject)) {
                delete parentObject[lastKey];
            }
            return object;
        }
        console.error(`remove error: Invalid JSON Pointer: ${pointer}`);
        return object;
    }
    /**
       * 'has' function
       *
       * Tests if an object has a value at the location specified by a JSON Pointer
       *
       * @param  { object } object - object to chek for value
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @return { boolean }
       */
    static has(object, pointer) {
        const hasValue = this.get(object, pointer, 0, null, true);
        return hasValue;
    }
    /**
       * 'dict' function
       *
       * Returns a (pointer -> value) dictionary for an object
       *
       * @param  { object } object - The object to create a dictionary from
       * @return { object } - The resulting dictionary object
       */
    static dict(object) {
        const results = {};
        this.forEachDeep(object, (value, pointer) => {
            if (typeof value !== 'object') {
                results[pointer] = value;
            }
        });
        return results;
    }
    /**
       * 'forEachDeep' function
       *
       * Iterates over own enumerable properties of an object or items in an array
       * and invokes an iteratee function for each key/value or index/value pair.
       * By default, iterates over items within objects and arrays after calling
       * the iteratee function on the containing object or array itself.
       *
       * The iteratee is invoked with three arguments: (value, pointer, rootObject),
       * where pointer is a JSON pointer indicating the location of the current
       * value within the root object, and rootObject is the root object initially
       * submitted to th function.
       *
       * If a third optional parameter 'bottomUp' is set to TRUE, the iterator
       * function will be called on sub-objects and arrays after being
       * called on their contents, rather than before, which is the default.
       *
       * This function can also optionally be called directly on a sub-object by
       * including optional 4th and 5th parameterss to specify the initial
       * root object and pointer.
       *
       * @param  { object } object - the initial object or array
       * @param  { (v: any, p?: string, o?: any) => any } function - iteratee function
       * @param  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
       * @param  { object = object } rootObject - optional, root object or array
       * @param  { string = '' } pointer - optional, JSON Pointer to object within rootObject
       * @return { object } - The modified object
       */
    static forEachDeep(object, fn = (v) => v, bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeep error: Iterator is not a function:`, fn);
            return;
        }
        if (!bottomUp) {
            fn(object, pointer, rootObject);
        }
        if (isObject(object) || isArray(object)) {
            for (const key of Object.keys(object)) {
                const newPointer = pointer + '/' + this.escape(key);
                this.forEachDeep(object[key], fn, bottomUp, newPointer, rootObject);
            }
        }
        if (bottomUp) {
            fn(object, pointer, rootObject);
        }
    }
    /**
       * 'forEachDeepCopy' function
       *
       * Similar to forEachDeep, but returns a copy of the original object, with
       * the same keys and indexes, but with values replaced with the result of
       * the iteratee function.
       *
       * @param  { object } object - the initial object or array
       * @param  { (v: any, k?: string, o?: any, p?: any) => any } function - iteratee function
       * @param  { boolean = false } bottomUp - optional, set to TRUE to reverse direction
       * @param  { object = object } rootObject - optional, root object or array
       * @param  { string = '' } pointer - optional, JSON Pointer to object within rootObject
       * @return { object } - The copied object
       */
    static forEachDeepCopy(object, fn = (v) => v, bottomUp = false, pointer = '', rootObject = object) {
        if (typeof fn !== 'function') {
            console.error(`forEachDeepCopy error: Iterator is not a function:`, fn);
            return null;
        }
        if (isObject(object) || isArray(object)) {
            let newObject = isArray(object) ? [...object] : Object.assign({}, object);
            if (!bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            for (const key of Object.keys(newObject)) {
                const newPointer = pointer + '/' + this.escape(key);
                newObject[key] = this.forEachDeepCopy(newObject[key], fn, bottomUp, newPointer, rootObject);
            }
            if (bottomUp) {
                newObject = fn(newObject, pointer, rootObject);
            }
            return newObject;
        }
        else {
            return fn(object, pointer, rootObject);
        }
    }
    /**
       * 'escape' function
       *
       * Escapes a string reference key
       *
       * @param  { string } key - string key to escape
       * @return { string } - escaped key
       */
    static escape(key) {
        const escaped = key.toString().replace(/~/g, '~0').replace(/\//g, '~1');
        return escaped;
    }
    /**
       * 'unescape' function
       *
       * Unescapes a string reference key
       *
       * @param  { string } key - string key to unescape
       * @return { string } - unescaped key
       */
    static unescape(key) {
        const unescaped = key.toString().replace(/~1/g, '/').replace(/~0/g, '~');
        return unescaped;
    }
    /**
       * 'parse' function
       *
       * Converts a string JSON Pointer into a array of keys
       * (if input is already an an array of keys, it is returned unchanged)
       *
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { boolean = false } errors - Show error if invalid pointer?
       * @return { string[] } - JSON Pointer array of keys
       */
    static parse(pointer, errors = false) {
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`parse error: Invalid JSON Pointer: ${pointer}`);
            }
            return null;
        }
        if (isArray(pointer)) {
            return pointer;
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            if (pointer === '' || pointer === '/') {
                return [];
            }
            return pointer.slice(1).split('/').map(this.unescape);
        }
    }
    /**
       * 'compile' function
       *
       * Converts an array of keys into a JSON Pointer string
       * (if input is already a string, it is normalized and returned)
       *
       * The optional second parameter is a default which will replace any empty keys.
       *
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { string | number = '' } defaultValue - Default value
       * @param  { boolean = false } errors - Show error if invalid pointer?
       * @return { string } - JSON Pointer string
       */
    static compile(pointer, defaultValue = '', errors = false) {
        if (pointer === '#') {
            return '';
        }
        if (!this.isJsonPointer(pointer)) {
            if (errors) {
                console.error(`compile error: Invalid JSON Pointer: ${pointer}`);
            }
            return null;
        }
        if (isArray(pointer)) {
            if (pointer.length === 0) {
                return '';
            }
            return '/' + pointer.map(key => key === '' ? defaultValue : this.escape(key)).join('/');
        }
        if (typeof pointer === 'string') {
            if (pointer[0] === '#') {
                pointer = pointer.slice(1);
            }
            return pointer;
        }
    }
    /**
       * 'toKey' function
       *
       * Extracts name of the final key from a JSON Pointer.
       *
       * @param  { Pointer } pointer - JSON Pointer (string or array)
       * @param  { boolean = false } errors - Show error if invalid pointer?
       * @return { string } - the extracted key
       */
    static toKey(pointer, errors = false) {
        const keyArray = this.parse(pointer, errors);
        if (keyArray === null) {
            return null;
        }
        if (!keyArray.length) {
            return '';
        }
        return keyArray[keyArray.length - 1];
    }
    /**
       * 'isJsonPointer' function
       *
       * Checks a string or array value to determine if it is a valid JSON Pointer.
       * Returns true if a string is empty, or starts with '/' or '#/'.
       * Returns true if an array contains only string values.
       *
       * @param  { any } value - value to check
       * @return { boolean } - true if value is a valid JSON Pointer, otherwise false
       */
    static isJsonPointer(value) {
        if (isArray(value)) {
            return value.every(key => typeof key === 'string');
        }
        else if (isString(value)) {
            if (value === '' || value === '#') {
                return true;
            }
            if (value[0] === '/' || value.slice(0, 2) === '#/') {
                return !/(~[^01]|~$)/g.test(value);
            }
        }
        return false;
    }
    /**
       * 'isSubPointer' function
       *
       * Checks whether one JSON Pointer is a subset of another.
       *
       * @param  { Pointer } shortPointer - potential subset JSON Pointer
       * @param  { Pointer } longPointer - potential superset JSON Pointer
       * @param  { boolean = false } trueIfMatching - return true if pointers match?
       * @param  { boolean = false } errors - Show error if invalid pointer?
       * @return { boolean } - true if shortPointer is a subset of longPointer, false if not
       */
    static isSubPointer(shortPointer, longPointer, trueIfMatching = false, errors = false) {
        if (!this.isJsonPointer(shortPointer) || !this.isJsonPointer(longPointer)) {
            if (errors) {
                let invalid = '';
                if (!this.isJsonPointer(shortPointer)) {
                    invalid += ` 1: ${shortPointer}`;
                }
                if (!this.isJsonPointer(longPointer)) {
                    invalid += ` 2: ${longPointer}`;
                }
                console.error(`isSubPointer error: Invalid JSON Pointer ${invalid}`);
            }
            return;
        }
        shortPointer = this.compile(shortPointer, '', errors);
        longPointer = this.compile(longPointer, '', errors);
        return shortPointer === longPointer ? trueIfMatching :
            `${shortPointer}/` === longPointer.slice(0, shortPointer.length + 1);
    }
    /**
       * 'toIndexedPointer' function
       *
       * Merges an array of numeric indexes and a generic pointer to create an
       * indexed pointer for a specific item.
       *
       * For example, merging the generic pointer '/foo/-/bar/-/baz' and
       * the array [4, 2] would result in the indexed pointer '/foo/4/bar/2/baz'
       *
       * @function
       * @param  { Pointer } genericPointer - The generic pointer
       * @param  { number[] } indexArray - The array of numeric indexes
       * @param  { Map<string, number> } arrayMap - An optional array map
       * @return { string } - The merged pointer with indexes
       */
    static toIndexedPointer(genericPointer, indexArray, arrayMap = null) {
        if (this.isJsonPointer(genericPointer) && isArray(indexArray)) {
            let indexedPointer = this.compile(genericPointer);
            if (isMap(arrayMap)) {
                let arrayIndex = 0;
                return indexedPointer.replace(/\/\-(?=\/|$)/g, (key, stringIndex) => arrayMap.has(indexedPointer.slice(0, stringIndex)) ?
                    '/' + indexArray[arrayIndex++] : key);
            }
            else {
                for (const pointerIndex of indexArray) {
                    indexedPointer = indexedPointer.replace('/-', '/' + pointerIndex);
                }
                return indexedPointer;
            }
        }
        if (!this.isJsonPointer(genericPointer)) {
            console.error(`toIndexedPointer error: Invalid JSON Pointer: ${genericPointer}`);
        }
        if (!isArray(indexArray)) {
            console.error(`toIndexedPointer error: Invalid indexArray: ${indexArray}`);
        }
    }
    /**
       * 'toGenericPointer' function
       *
       * Compares an indexed pointer to an array map and removes list array
       * indexes (but leaves tuple arrray indexes and all object keys, including
       * numeric keys) to create a generic pointer.
       *
       * For example, using the indexed pointer '/foo/1/bar/2/baz/3' and
       * the arrayMap [['/foo', 0], ['/foo/-/bar', 3], ['/foo/-/bar/-/baz', 0]]
       * would result in the generic pointer '/foo/-/bar/2/baz/-'
       * Using the indexed pointer '/foo/1/bar/4/baz/3' and the same arrayMap
       * would result in the generic pointer '/foo/-/bar/-/baz/-'
       * (the bar array has 3 tuple items, so index 2 is retained, but 4 is removed)
       *
       * The structure of the arrayMap is: [['path to array', number of tuple items]...]
       *
       * @function
       * @param  { Pointer } indexedPointer - The indexed pointer (array or string)
       * @param  { Map<string, number> } arrayMap - The optional array map (for preserving tuple indexes)
       * @return { string } - The generic pointer with indexes removed
       */
    static toGenericPointer(indexedPointer, arrayMap = new Map()) {
        if (this.isJsonPointer(indexedPointer) && isMap(arrayMap)) {
            const pointerArray = this.parse(indexedPointer);
            for (let i = 1; i < pointerArray.length; i++) {
                const subPointer = this.compile(pointerArray.slice(0, i));
                if (arrayMap.has(subPointer) &&
                    arrayMap.get(subPointer) <= +pointerArray[i]) {
                    pointerArray[i] = '-';
                }
            }
            return this.compile(pointerArray);
        }
        if (!this.isJsonPointer(indexedPointer)) {
            console.error(`toGenericPointer error: invalid JSON Pointer: ${indexedPointer}`);
        }
        if (!isMap(arrayMap)) {
            console.error(`toGenericPointer error: invalid arrayMap: ${arrayMap}`);
        }
    }
    /**
       * 'toControlPointer' function
       *
       * Accepts a JSON Pointer for a data object and returns a JSON Pointer for the
       * matching control in an Angular FormGroup.
       *
       * @param  { Pointer } dataPointer - JSON Pointer (string or array) to a data object
       * @param  { FormGroup } formGroup - Angular FormGroup to get value from
       * @param  { boolean = false } controlMustExist - Only return if control exists?
       * @return { Pointer } - JSON Pointer (string) to the formGroup object
       */
    static toControlPointer(dataPointer, formGroup, controlMustExist = false) {
        const dataPointerArray = this.parse(dataPointer);
        const controlPointerArray = [];
        let subGroup = formGroup;
        if (dataPointerArray !== null) {
            for (const key of dataPointerArray) {
                if (hasOwn(subGroup, 'controls')) {
                    controlPointerArray.push('controls');
                    subGroup = subGroup.controls;
                }
                if (isArray(subGroup) && (key === '-')) {
                    controlPointerArray.push((subGroup.length - 1).toString());
                    subGroup = subGroup[subGroup.length - 1];
                }
                else if (hasOwn(subGroup, key)) {
                    controlPointerArray.push(key);
                    subGroup = subGroup[key];
                }
                else if (controlMustExist) {
                    console.error(`toControlPointer error: Unable to find "${key}" item in FormGroup.`);
                    console.error(dataPointer);
                    console.error(formGroup);
                    return;
                }
                else {
                    controlPointerArray.push(key);
                    subGroup = { controls: {} };
                }
            }
            return this.compile(controlPointerArray);
        }
        console.error(`toControlPointer error: Invalid JSON Pointer: ${dataPointer}`);
    }
    /**
       * 'toSchemaPointer' function
       *
       * Accepts a JSON Pointer to a value inside a data object and a JSON schema
       * for that object.
       *
       * Returns a Pointer to the sub-schema for the value inside the object's schema.
       *
       * @param  { Pointer } dataPointer - JSON Pointer (string or array) to an object
       * @param  { any } schema - JSON schema for the object
       * @return { Pointer } - JSON Pointer (string) to the object's schema
       */
    static toSchemaPointer(dataPointer, schema) {
        if (this.isJsonPointer(dataPointer) && typeof schema === 'object') {
            const pointerArray = this.parse(dataPointer);
            if (!pointerArray.length) {
                return '';
            }
            const firstKey = pointerArray.shift();
            if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
                if ((schema.properties || {})[firstKey]) {
                    return `/properties/${this.escape(firstKey)}` +
                        this.toSchemaPointer(pointerArray, schema.properties[firstKey]);
                }
                else if (schema.additionalProperties) {
                    return '/additionalProperties' +
                        this.toSchemaPointer(pointerArray, schema.additionalProperties);
                }
            }
            if ((schema.type === 'array' || schema.items) &&
                (isNumber(firstKey) || firstKey === '-' || firstKey === '')) {
                const arrayItem = firstKey === '-' || firstKey === '' ? 0 : +firstKey;
                if (isArray(schema.items)) {
                    if (arrayItem < schema.items.length) {
                        return '/items/' + arrayItem +
                            this.toSchemaPointer(pointerArray, schema.items[arrayItem]);
                    }
                    else if (schema.additionalItems) {
                        return '/additionalItems' +
                            this.toSchemaPointer(pointerArray, schema.additionalItems);
                    }
                }
                else if (isObject(schema.items)) {
                    return '/items' + this.toSchemaPointer(pointerArray, schema.items);
                }
                else if (isObject(schema.additionalItems)) {
                    return '/additionalItems' +
                        this.toSchemaPointer(pointerArray, schema.additionalItems);
                }
            }
            console.error(`toSchemaPointer error: Data pointer ${dataPointer} ` +
                `not compatible with schema ${schema}`);
            return null;
        }
        if (!this.isJsonPointer(dataPointer)) {
            console.error(`toSchemaPointer error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (typeof schema !== 'object') {
            console.error(`toSchemaPointer error: Invalid JSON Schema: ${schema}`);
        }
        return null;
    }
    /**
       * 'toDataPointer' function
       *
       * Accepts a JSON Pointer to a sub-schema inside a JSON schema and the schema.
       *
       * If possible, returns a generic Pointer to the corresponding value inside
       * the data object described by the JSON schema.
       *
       * Returns null if the sub-schema is in an ambiguous location (such as
       * definitions or additionalProperties) where the corresponding value
       * location cannot be determined.
       *
       * @param  { Pointer } schemaPointer - JSON Pointer (string or array) to a JSON schema
       * @param  { any } schema - the JSON schema
       * @param  { boolean = false } errors - Show errors?
       * @return { Pointer } - JSON Pointer (string) to the value in the data object
       */
    static toDataPointer(schemaPointer, schema, errors = false) {
        if (this.isJsonPointer(schemaPointer) && typeof schema === 'object' &&
            this.has(schema, schemaPointer)) {
            const pointerArray = this.parse(schemaPointer);
            if (!pointerArray.length) {
                return '';
            }
            const dataPointer = '';
            const firstKey = pointerArray.shift();
            if (firstKey === 'properties' ||
                (firstKey === 'items' && isArray(schema.items))) {
                const secondKey = pointerArray.shift();
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
                return pointerSuffix === null ? null : '/' + secondKey + pointerSuffix;
            }
            else if (firstKey === 'additionalItems' ||
                (firstKey === 'items' && isObject(schema.items))) {
                const pointerSuffix = this.toDataPointer(pointerArray, schema[firstKey]);
                return pointerSuffix === null ? null : '/-' + pointerSuffix;
            }
            else if (['allOf', 'anyOf', 'oneOf'].includes(firstKey)) {
                const secondKey = pointerArray.shift();
                return this.toDataPointer(pointerArray, schema[firstKey][secondKey]);
            }
            else if (firstKey === 'not') {
                return this.toDataPointer(pointerArray, schema[firstKey]);
            }
            else if (['contains', 'definitions', 'dependencies', 'additionalItems',
                'additionalProperties', 'patternProperties', 'propertyNames'].includes(firstKey)) {
                if (errors) {
                    console.error(`toDataPointer error: Ambiguous location`);
                }
            }
            return '';
        }
        if (errors) {
            if (!this.isJsonPointer(schemaPointer)) {
                console.error(`toDataPointer error: Invalid JSON Pointer: ${schemaPointer}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Invalid JSON Schema: ${schema}`);
            }
            if (typeof schema !== 'object') {
                console.error(`toDataPointer error: Pointer ${schemaPointer} invalid for Schema: ${schema}`);
            }
        }
        return null;
    }
    /**
       * 'parseObjectPath' function
       *
       * Parses a JavaScript object path into an array of keys, which
       * can then be passed to compile() to convert into a string JSON Pointer.
       *
       * Based on mike-marcacci's excellent objectpath parse function:
       * https://github.com/mike-marcacci/objectpath
       *
       * @param  { Pointer } path - The object path to parse
       * @return { string[] } - The resulting array of keys
       */
    static parseObjectPath(path) {
        if (isArray(path)) {
            return path;
        }
        if (this.isJsonPointer(path)) {
            return this.parse(path);
        }
        if (typeof path === 'string') {
            let index = 0;
            const parts = [];
            while (index < path.length) {
                const nextDot = path.indexOf('.', index);
                const nextOB = path.indexOf('[', index); // next open bracket
                if (nextDot === -1 && nextOB === -1) {
                    // last item
                    parts.push(path.slice(index));
                    index = path.length;
                }
                else if (nextDot !== -1 && (nextDot < nextOB || nextOB === -1)) {
                    // dot notation
                    parts.push(path.slice(index, nextDot));
                    index = nextDot + 1;
                }
                else {
                    // bracket notation
                    if (nextOB > index) {
                        parts.push(path.slice(index, nextOB));
                        index = nextOB;
                    }
                    const quote = path.charAt(nextOB + 1);
                    if (quote === '"' || quote === '\'') {
                        // enclosing quotes
                        let nextCB = path.indexOf(quote + ']', nextOB); // next close bracket
                        while (nextCB !== -1 && path.charAt(nextCB - 1) === '\\') {
                            nextCB = path.indexOf(quote + ']', nextCB + 2);
                        }
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 2, nextCB)
                            .replace(new RegExp('\\' + quote, 'g'), quote));
                        index = nextCB + 2;
                    }
                    else {
                        // no enclosing quotes
                        let nextCB = path.indexOf(']', nextOB); // next close bracket
                        if (nextCB === -1) {
                            nextCB = path.length;
                        }
                        parts.push(path.slice(index + 1, nextCB));
                        index = nextCB + 1;
                    }
                    if (path.charAt(index) === '.') {
                        index++;
                    }
                }
            }
            return parts;
        }
        console.error('parseObjectPath error: Input object path must be a string.');
    }
}
JsonPointer.decorators = [
    { type: Injectable },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBvaW50ZXIuZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbi1zY2hlbWEtZm9ybS8iLCJzb3VyY2VzIjpbInNyYy9zaGFyZWQvanNvbnBvaW50ZXIuZnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUNMLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDakUsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBbUJuRCxNQUFNOzs7Ozs7Ozs7Ozs7OztJQWVKLE1BQU0sQ0FBQyxHQUFHLENBQ1IsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFdBQW1CLElBQUksRUFDeEQsVUFBVSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsS0FBSztRQUVsQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQUU7UUFDL0QsSUFBSSxRQUFRLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFB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QUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUFDLEtBQUssRUFBRSxDQUFDO3FCQUFFO2lCQUM3QzthQUNGO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0tBQzdFOzs7WUFqMkJGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIGlzRGVmaW5lZCwgaXNFbXB0eSwgaXNPYmplY3QsIGlzQXJyYXksIGlzTWFwLCBpc051bWJlciwgaXNTdHJpbmdcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGhhc093biwgY29weSB9IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuXG4vKipcbiAqICdKc29uUG9pbnRlcicgY2xhc3NcbiAqXG4gKiBTb21lIHV0aWxpdGllcyBmb3IgdXNpbmcgSlNPTiBQb2ludGVycyB3aXRoIEpTT04gb2JqZWN0c1xuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY5MDFcbiAqXG4gKiBnZXQsIGdldENvcHksIGdldEZpcnN0LCBzZXQsIHNldENvcHksIGluc2VydCwgaW5zZXJ0Q29weSwgcmVtb3ZlLCBoYXMsIGRpY3QsXG4gKiBmb3JFYWNoRGVlcCwgZm9yRWFjaERlZXBDb3B5LCBlc2NhcGUsIHVuZXNjYXBlLCBwYXJzZSwgY29tcGlsZSwgdG9LZXksXG4gKiBpc0pzb25Qb2ludGVyLCBpc1N1YlBvaW50ZXIsIHRvSW5kZXhlZFBvaW50ZXIsIHRvR2VuZXJpY1BvaW50ZXIsXG4gKiB0b0NvbnRyb2xQb2ludGVyLCB0b1NjaGVtYVBvaW50ZXIsIHRvRGF0YVBvaW50ZXIsIHBhcnNlT2JqZWN0UGF0aFxuICpcbiAqIFNvbWUgZnVuY3Rpb25zIGJhc2VkIG9uIG1hbnVlbHN0b2ZlcidzIGpzb24tcG9pbnRlciB1dGlsaXRpZXNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYW51ZWxzdG9mZXIvanNvbi1wb2ludGVyXG4gKi9cbmV4cG9ydCB0eXBlIFBvaW50ZXIgPSBzdHJpbmcgfCBzdHJpbmdbXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpzb25Qb2ludGVyIHtcblxuICAvKipcbiAgICogJ2dldCcgZnVuY3Rpb25cbiAgICpcbiAgICogVXNlcyBhIEpTT04gUG9pbnRlciB0byByZXRyaWV2ZSBhIHZhbHVlIGZyb20gYW4gb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gIHsgb2JqZWN0IH0gb2JqZWN0IC0gT2JqZWN0IHRvIGdldCB2YWx1ZSBmcm9tXG4gICAqIEBwYXJhbSAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiBAcGFyYW0gIHsgbnVtYmVyID0gMCB9IHN0YXJ0U2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGZpcnN0IFBvaW50ZXIga2V5IHRvIHVzZVxuICAgKiBAcGFyYW0gIHsgbnVtYmVyIH0gZW5kU2xpY2UgLSBaZXJvLWJhc2VkIGluZGV4IG9mIGxhc3QgUG9pbnRlciBrZXkgdG8gdXNlXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBnZXRCb29sZWFuIC0gUmV0dXJuIG9ubHkgdHJ1ZSBvciBmYWxzZT9cbiAgICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgbm90IGZvdW5kP1xuICAgKiBAcmV0dXJuIHsgb2JqZWN0IH0gLSBMb2NhdGVkIHZhbHVlIChvciB0cnVlIG9yIGZhbHNlIGlmIGdldEJvb2xlYW4gPSB0cnVlKVxuICAgKi9cbiAgc3RhdGljIGdldChcbiAgICBvYmplY3QsIHBvaW50ZXIsIHN0YXJ0U2xpY2UgPSAwLCBlbmRTbGljZTogbnVtYmVyID0gbnVsbCxcbiAgICBnZXRCb29sZWFuID0gZmFsc2UsIGVycm9ycyA9IGZhbHNlXG4gICkge1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIHsgcmV0dXJuIGdldEJvb2xlYW4gPyBmYWxzZSA6IHVuZGVmaW5lZDsgfVxuICAgIGxldCBrZXlBcnJheTogYW55W10gPSB0aGlzLnBhcnNlKHBvaW50ZXIsIGVycm9ycyk7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIGtleUFycmF5ICE9PSBudWxsKSB7XG4gICAgICBsZXQgc3ViT2JqZWN0ID0gb2JqZWN0O1xuICAgICAgaWYgKHN0YXJ0U2xpY2UgPj0ga2V5QXJyYXkubGVuZ3RoIHx8IGVuZFNsaWNlIDw9IC1rZXlBcnJheS5sZW5ndGgpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgICAgaWYgKHN0YXJ0U2xpY2UgPD0gLWtleUFycmF5Lmxlbmd0aCkgeyBzdGFydFNsaWNlID0gMDsgfVxuICAgICAgaWYgKCFpc0RlZmluZWQoZW5kU2xpY2UpIHx8IGVuZFNsaWNlID49IGtleUFycmF5Lmxlbmd0aCkgeyBlbmRTbGljZSA9IGtleUFycmF5Lmxlbmd0aDsgfVxuICAgICAga2V5QXJyYXkgPSBrZXlBcnJheS5zbGljZShzdGFydFNsaWNlLCBlbmRTbGljZSk7XG4gICAgICBmb3IgKGxldCBrZXkgb2Yga2V5QXJyYXkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSAmJiBzdWJPYmplY3QubGVuZ3RoKSB7XG4gICAgICAgICAga2V5ID0gc3ViT2JqZWN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdWJPYmplY3QgPT09ICdvYmplY3QnICYmIHN1Yk9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIGhhc093bihzdWJPYmplY3QsIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgZ2V0IGVycm9yOiBcIiR7a2V5fVwiIGtleSBub3QgZm91bmQgaW4gb2JqZWN0LmApO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihwb2ludGVyKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iob2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGdldEJvb2xlYW4gPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGdldEJvb2xlYW4gPyB0cnVlIDogc3ViT2JqZWN0O1xuICAgIH1cbiAgICBpZiAoZXJyb3JzICYmIGtleUFycmF5ID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXQgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmIChlcnJvcnMgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldCBlcnJvcjogSW52YWxpZCBvYmplY3Q6Jyk7XG4gICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBnZXRCb29sZWFuID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogJ2dldENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIFVzZXMgYSBKU09OIFBvaW50ZXIgdG8gZGVlcGx5IGNsb25lIGEgdmFsdWUgZnJvbSBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSAgeyBvYmplY3QgfSBvYmplY3QgLSBPYmplY3QgdG8gZ2V0IHZhbHVlIGZyb21cbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBudW1iZXIgPSAwIH0gc3RhcnRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgZmlyc3QgUG9pbnRlciBrZXkgdG8gdXNlXG4gICAqIEBwYXJhbSAgeyBudW1iZXIgfSBlbmRTbGljZSAtIFplcm8tYmFzZWQgaW5kZXggb2YgbGFzdCBQb2ludGVyIGtleSB0byB1c2VcbiAgICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IGdldEJvb2xlYW4gLSBSZXR1cm4gb25seSB0cnVlIG9yIGZhbHNlP1xuICAgKiBAcGFyYW0gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZXJyb3JzIC0gU2hvdyBlcnJvciBpZiBub3QgZm91bmQ/XG4gICAqIEByZXR1cm4geyBvYmplY3QgfSAtIExvY2F0ZWQgdmFsdWUgKG9yIHRydWUgb3IgZmFsc2UgaWYgZ2V0Qm9vbGVhbiA9IHRydWUpXG4gICAqL1xuICBzdGF0aWMgZ2V0Q29weShcbiAgICBvYmplY3QsIHBvaW50ZXIsIHN0YXJ0U2xpY2UgPSAwLCBlbmRTbGljZTogbnVtYmVyID0gbnVsbCxcbiAgICBnZXRCb29sZWFuID0gZmFsc2UsIGVycm9ycyA9IGZhbHNlXG4gICkge1xuICAgIGNvbnN0IG9iamVjdFRvQ29weSA9XG4gICAgICB0aGlzLmdldChvYmplY3QsIHBvaW50ZXIsIHN0YXJ0U2xpY2UsIGVuZFNsaWNlLCBnZXRCb29sZWFuLCBlcnJvcnMpO1xuICAgIHJldHVybiB0aGlzLmZvckVhY2hEZWVwQ29weShvYmplY3RUb0NvcHkpO1xuICB9XG5cbiAgLyoqXG4gICAqICdnZXRGaXJzdCcgZnVuY3Rpb25cbiAgICpcbiAgICogVGFrZXMgYW4gYXJyYXkgb2YgSlNPTiBQb2ludGVycyBhbmQgb2JqZWN0cyxcbiAgICogY2hlY2tzIGVhY2ggb2JqZWN0IGZvciBhIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgcG9pbnRlcixcbiAgICogYW5kIHJldHVybnMgdGhlIGZpcnN0IHZhbHVlIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0gIHsgW29iamVjdCwgcG9pbnRlcl1bXSB9IGl0ZW1zIC0gQXJyYXkgb2Ygb2JqZWN0cyBhbmQgcG9pbnRlcnMgdG8gY2hlY2tcbiAgICogQHBhcmFtICB7IGFueSA9IG51bGwgfSBkZWZhdWx0VmFsdWUgLSBWYWx1ZSB0byByZXR1cm4gaWYgbm90aGluZyBmb3VuZFxuICAgKiBAcGFyYW0gIHsgYm9vbGVhbiA9IGZhbHNlIH0gZ2V0Q29weSAtIFJldHVybiBhIGNvcHkgaW5zdGVhZD9cbiAgICogQHJldHVybiB7IGFueSB9IC0gRmlyc3QgdmFsdWUgZm91bmRcbiAgICovXG4gIHN0YXRpYyBnZXRGaXJzdChpdGVtcywgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsLCBnZXRDb3B5ID0gZmFsc2UpIHtcbiAgICBpZiAoaXNFbXB0eShpdGVtcykpIHsgcmV0dXJuOyB9XG4gICAgaWYgKGlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKGlzRW1wdHkoaXRlbSkpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKGlzQXJyYXkoaXRlbSkgJiYgaXRlbS5sZW5ndGggPj0gMikge1xuICAgICAgICAgIGlmIChpc0VtcHR5KGl0ZW1bMF0pIHx8IGlzRW1wdHkoaXRlbVsxXSkpIHsgY29udGludWU7IH1cbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldENvcHkgP1xuICAgICAgICAgICAgdGhpcy5nZXRDb3B5KGl0ZW1bMF0sIGl0ZW1bMV0pIDpcbiAgICAgICAgICAgIHRoaXMuZ2V0KGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICAgIGlmICh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKCdnZXRGaXJzdCBlcnJvcjogSW5wdXQgbm90IGluIGNvcnJlY3QgZm9ybWF0LlxcbicgK1xuICAgICAgICAgICdTaG91bGQgYmU6IFsgWyBvYmplY3QxLCBwb2ludGVyMSBdLCBbIG9iamVjdCAyLCBwb2ludGVyMiBdLCBldGMuLi4gXScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNNYXAoaXRlbXMpKSB7XG4gICAgICBmb3IgKGNvbnN0IFtvYmplY3QsIHBvaW50ZXJdIG9mIGl0ZW1zKSB7XG4gICAgICAgIGlmIChvYmplY3QgPT09IG51bGwgfHwgIXRoaXMuaXNKc29uUG9pbnRlcihwb2ludGVyKSkgeyBjb250aW51ZTsgfVxuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldENvcHkgP1xuICAgICAgICAgIHRoaXMuZ2V0Q29weShvYmplY3QsIHBvaW50ZXIpIDpcbiAgICAgICAgICB0aGlzLmdldChvYmplY3QsIHBvaW50ZXIpO1xuICAgICAgICBpZiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKCdnZXRGaXJzdCBlcnJvcjogSW5wdXQgbm90IGluIGNvcnJlY3QgZm9ybWF0LlxcbicgK1xuICAgICAgJ1Nob3VsZCBiZTogWyBbIG9iamVjdDEsIHBvaW50ZXIxIF0sIFsgb2JqZWN0IDIsIHBvaW50ZXIyIF0sIGV0Yy4uLiBdJyk7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZ2V0Rmlyc3RDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBTaW1pbGFyIHRvIGdldEZpcnN0LCBidXQgYWx3YXlzIHJldHVybnMgYSBjb3B5LlxuICAgKlxuICAgKiBAcGFyYW0gIHsgW29iamVjdCwgcG9pbnRlcl1bXSB9IGl0ZW1zIC0gQXJyYXkgb2Ygb2JqZWN0cyBhbmQgcG9pbnRlcnMgdG8gY2hlY2tcbiAgICogQHBhcmFtICB7IGFueSA9IG51bGwgfSBkZWZhdWx0VmFsdWUgLSBWYWx1ZSB0byByZXR1cm4gaWYgbm90aGluZyBmb3VuZFxuICAgKiBAcmV0dXJuIHsgYW55IH0gLSBDb3B5IG9mIGZpcnN0IHZhbHVlIGZvdW5kXG4gICAqL1xuICBzdGF0aWMgZ2V0Rmlyc3RDb3B5KGl0ZW1zLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwpIHtcbiAgICBjb25zdCBmaXJzdENvcHkgPSB0aGlzLmdldEZpcnN0KGl0ZW1zLCBkZWZhdWx0VmFsdWUsIHRydWUpO1xuICAgIHJldHVybiBmaXJzdENvcHk7XG4gIH1cblxuICAvKipcbiAgICogJ3NldCcgZnVuY3Rpb25cbiAgICpcbiAgICogVXNlcyBhIEpTT04gUG9pbnRlciB0byBzZXQgYSB2YWx1ZSBvbiBhbiBvYmplY3QuXG4gICAqIEFsc28gY3JlYXRlcyBhbnkgbWlzc2luZyBzdWIgb2JqZWN0cyBvciBhcnJheXMgdG8gY29udGFpbiB0aGF0IHZhbHVlLlxuICAgKlxuICAgKiBJZiB0aGUgb3B0aW9uYWwgZm91cnRoIHBhcmFtZXRlciBpcyBUUlVFIGFuZCB0aGUgaW5uZXItbW9zdCBjb250YWluZXJcbiAgICogaXMgYW4gYXJyYXksIHRoZSBmdW5jdGlvbiB3aWxsIGluc2VydCB0aGUgdmFsdWUgYXMgYSBuZXcgaXRlbSBhdCB0aGVcbiAgICogc3BlY2lmaWVkIGxvY2F0aW9uIGluIHRoZSBhcnJheSwgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nXG4gICAqIHZhbHVlIChpZiBhbnkpIGF0IHRoYXQgbG9jYXRpb24uXG4gICAqXG4gICAqIFNvIHNldChbMSwgMiwgM10sICcvMScsIDQpID0+IFsxLCA0LCAzXVxuICAgKiBhbmRcbiAgICogU28gc2V0KFsxLCAyLCAzXSwgJy8xJywgNCwgdHJ1ZSkgPT4gWzEsIDQsIDIsIDNdXG4gICAqXG4gICAqIEBwYXJhbSAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIHNldCB2YWx1ZSBpblxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBUaGUgSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBhbnkgfSB2YWx1ZSAtIFRoZSBuZXcgdmFsdWUgdG8gc2V0XG4gICAqIEBwYXJhbSAgeyBib29sZWFuIH0gaW5zZXJ0IC0gaW5zZXJ0IHZhbHVlP1xuICAgKiBAcmV0dXJuIHsgb2JqZWN0IH0gLSBUaGUgb3JpZ2luYWwgb2JqZWN0LCBtb2RpZmllZCB3aXRoIHRoZSBzZXQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBzZXQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgaW5zZXJ0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrZXlBcnJheSA9IHRoaXMucGFyc2UocG9pbnRlcik7XG4gICAgaWYgKGtleUFycmF5ICE9PSBudWxsICYmIGtleUFycmF5Lmxlbmd0aCkge1xuICAgICAgbGV0IHN1Yk9iamVjdCA9IG9iamVjdDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5QXJyYXkubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlBcnJheVtpXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJy0nICYmIGlzQXJyYXkoc3ViT2JqZWN0KSkge1xuICAgICAgICAgIGtleSA9IHN1Yk9iamVjdC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTWFwKHN1Yk9iamVjdCkgJiYgc3ViT2JqZWN0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0LmdldChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaGFzT3duKHN1Yk9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgc3ViT2JqZWN0W2tleV0gPSAoa2V5QXJyYXlbaSArIDFdLm1hdGNoKC9eKFxcZCt8LSkkLykpID8gW10gOiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3ViT2JqZWN0ID0gc3ViT2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGxhc3RLZXkgPSBrZXlBcnJheVtrZXlBcnJheS5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChpc0FycmF5KHN1Yk9iamVjdCkgJiYgbGFzdEtleSA9PT0gJy0nKSB7XG4gICAgICAgIHN1Yk9iamVjdC5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0ICYmIGlzQXJyYXkoc3ViT2JqZWN0KSAmJiAhaXNOYU4oK2xhc3RLZXkpKSB7XG4gICAgICAgIHN1Yk9iamVjdC5zcGxpY2UobGFzdEtleSwgMCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpc01hcChzdWJPYmplY3QpKSB7XG4gICAgICAgIHN1Yk9iamVjdC5zZXQobGFzdEtleSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViT2JqZWN0W2xhc3RLZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKGBzZXQgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAnc2V0Q29weScgZnVuY3Rpb25cbiAgICpcbiAgICogQ29waWVzIGFuIG9iamVjdCBhbmQgdXNlcyBhIEpTT04gUG9pbnRlciB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgY29weS5cbiAgICogQWxzbyBjcmVhdGVzIGFueSBtaXNzaW5nIHN1YiBvYmplY3RzIG9yIGFycmF5cyB0byBjb250YWluIHRoYXQgdmFsdWUuXG4gICAqXG4gICAqIElmIHRoZSBvcHRpb25hbCBmb3VydGggcGFyYW1ldGVyIGlzIFRSVUUgYW5kIHRoZSBpbm5lci1tb3N0IGNvbnRhaW5lclxuICAgKiBpcyBhbiBhcnJheSwgdGhlIGZ1bmN0aW9uIHdpbGwgaW5zZXJ0IHRoZSB2YWx1ZSBhcyBhIG5ldyBpdGVtIGF0IHRoZVxuICAgKiBzcGVjaWZpZWQgbG9jYXRpb24gaW4gdGhlIGFycmF5LCByYXRoZXIgdGhhbiBvdmVyd3JpdGluZyB0aGUgZXhpc3RpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSAgeyBvYmplY3QgfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIGNvcHkgYW5kIHNldCB2YWx1ZSBpblxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBUaGUgSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBhbnkgfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXRcbiAgICogQHBhcmFtICB7IGJvb2xlYW4gfSBpbnNlcnQgLSBpbnNlcnQgdmFsdWU/XG4gICAqIEByZXR1cm4geyBvYmplY3QgfSAtIFRoZSBuZXcgb2JqZWN0IHdpdGggdGhlIHNldCB2YWx1ZVxuICAgKi9cbiAgc3RhdGljIHNldENvcHkob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSwgaW5zZXJ0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBrZXlBcnJheSA9IHRoaXMucGFyc2UocG9pbnRlcik7XG4gICAgaWYgKGtleUFycmF5ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBuZXdPYmplY3QgPSBjb3B5KG9iamVjdCk7XG4gICAgICBsZXQgc3ViT2JqZWN0ID0gbmV3T2JqZWN0O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlBcnJheS5sZW5ndGggLSAxOyArK2kpIHtcbiAgICAgICAgbGV0IGtleSA9IGtleUFycmF5W2ldO1xuICAgICAgICBpZiAoa2V5ID09PSAnLScgJiYgaXNBcnJheShzdWJPYmplY3QpKSB7XG4gICAgICAgICAga2V5ID0gc3ViT2JqZWN0Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNYXAoc3ViT2JqZWN0KSAmJiBzdWJPYmplY3QuaGFzKGtleSkpIHtcbiAgICAgICAgICBzdWJPYmplY3Quc2V0KGtleSwgY29weShzdWJPYmplY3QuZ2V0KGtleSkpKTtcbiAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3QuZ2V0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFoYXNPd24oc3ViT2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBzdWJPYmplY3Rba2V5XSA9IChrZXlBcnJheVtpICsgMV0ubWF0Y2goL14oXFxkK3wtKSQvKSkgPyBbXSA6IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJPYmplY3Rba2V5XSA9IGNvcHkoc3ViT2JqZWN0W2tleV0pO1xuICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBsYXN0S2V5ID0ga2V5QXJyYXlba2V5QXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoaXNBcnJheShzdWJPYmplY3QpICYmIGxhc3RLZXkgPT09ICctJykge1xuICAgICAgICBzdWJPYmplY3QucHVzaCh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluc2VydCAmJiBpc0FycmF5KHN1Yk9iamVjdCkgJiYgIWlzTmFOKCtsYXN0S2V5KSkge1xuICAgICAgICBzdWJPYmplY3Quc3BsaWNlKGxhc3RLZXksIDAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYXAoc3ViT2JqZWN0KSkge1xuICAgICAgICBzdWJPYmplY3Quc2V0KGxhc3RLZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Yk9iamVjdFtsYXN0S2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcihgc2V0Q29weSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdpbnNlcnQnIGZ1bmN0aW9uXG4gICAqXG4gICAqIENhbGxzICdzZXQnIHdpdGggaW5zZXJ0ID0gVFJVRVxuICAgKlxuICAgKiBAcGFyYW0gIHsgb2JqZWN0IH0gb2JqZWN0IC0gb2JqZWN0IHRvIGluc2VydCB2YWx1ZSBpblxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogQHBhcmFtICB7IGFueSB9IHZhbHVlIC0gdmFsdWUgdG8gaW5zZXJ0XG4gICAqIEByZXR1cm4geyBvYmplY3QgfVxuICAgKi9cbiAgc3RhdGljIGluc2VydChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSB7XG4gICAgY29uc3QgdXBkYXRlZE9iamVjdCA9IHRoaXMuc2V0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUsIHRydWUpO1xuICAgIHJldHVybiB1cGRhdGVkT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdpbnNlcnRDb3B5JyBmdW5jdGlvblxuICAgKlxuICAgKiBDYWxscyAnc2V0Q29weScgd2l0aCBpbnNlcnQgPSBUUlVFXG4gICAqXG4gICAqIEBwYXJhbSAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gaW5zZXJ0IHZhbHVlIGluXG4gICAqIEBwYXJhbSAgeyBQb2ludGVyIH0gcG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KVxuICAgKiBAcGFyYW0gIHsgYW55IH0gdmFsdWUgLSB2YWx1ZSB0byBpbnNlcnRcbiAgICogQHJldHVybiB7IG9iamVjdCB9XG4gICAqL1xuICBzdGF0aWMgaW5zZXJ0Q29weShvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSB7XG4gICAgY29uc3QgdXBkYXRlZE9iamVjdCA9IHRoaXMuc2V0Q29weShvYmplY3QsIHBvaW50ZXIsIHZhbHVlLCB0cnVlKTtcbiAgICByZXR1cm4gdXBkYXRlZE9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAncmVtb3ZlJyBmdW5jdGlvblxuICAgKlxuICAgKiBVc2VzIGEgSlNPTiBQb2ludGVyIHRvIHJlbW92ZSBhIGtleSBhbmQgaXRzIGF0dHJpYnV0ZSBmcm9tIGFuIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gIHsgb2JqZWN0IH0gb2JqZWN0IC0gb2JqZWN0IHRvIGRlbGV0ZSBhdHRyaWJ1dGUgZnJvbVxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAgICogQHJldHVybiB7IG9iamVjdCB9XG4gICAqL1xuICBzdGF0aWMgcmVtb3ZlKG9iamVjdCwgcG9pbnRlcikge1xuICAgIGNvbnN0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyKTtcbiAgICBpZiAoa2V5QXJyYXkgIT09IG51bGwgJiYga2V5QXJyYXkubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFzdEtleSA9IGtleUFycmF5LnBvcCgpO1xuICAgICAgY29uc3QgcGFyZW50T2JqZWN0ID0gdGhpcy5nZXQob2JqZWN0LCBrZXlBcnJheSk7XG4gICAgICBpZiAoaXNBcnJheShwYXJlbnRPYmplY3QpKSB7XG4gICAgICAgIGlmIChsYXN0S2V5ID09PSAnLScpIHsgbGFzdEtleSA9IHBhcmVudE9iamVjdC5sZW5ndGggLSAxOyB9XG4gICAgICAgIHBhcmVudE9iamVjdC5zcGxpY2UobGFzdEtleSwgMSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHBhcmVudE9iamVjdCkpIHtcbiAgICAgICAgZGVsZXRlIHBhcmVudE9iamVjdFtsYXN0S2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGNvbnNvbGUuZXJyb3IoYHJlbW92ZSBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7cG9pbnRlcn1gKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqICdoYXMnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRlc3RzIGlmIGFuIG9iamVjdCBoYXMgYSB2YWx1ZSBhdCB0aGUgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IGEgSlNPTiBQb2ludGVyXG4gICAqXG4gICAqIEBwYXJhbSAgeyBvYmplY3QgfSBvYmplY3QgLSBvYmplY3QgdG8gY2hlayBmb3IgdmFsdWVcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEByZXR1cm4geyBib29sZWFuIH1cbiAgICovXG4gIHN0YXRpYyBoYXMob2JqZWN0LCBwb2ludGVyKSB7XG4gICAgY29uc3QgaGFzVmFsdWUgPSB0aGlzLmdldChvYmplY3QsIHBvaW50ZXIsIDAsIG51bGwsIHRydWUpO1xuICAgIHJldHVybiBoYXNWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnZGljdCcgZnVuY3Rpb25cbiAgICpcbiAgICogUmV0dXJucyBhIChwb2ludGVyIC0+IHZhbHVlKSBkaWN0aW9uYXJ5IGZvciBhbiBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtICB7IG9iamVjdCB9IG9iamVjdCAtIFRoZSBvYmplY3QgdG8gY3JlYXRlIGEgZGljdGlvbmFyeSBmcm9tXG4gICAqIEByZXR1cm4geyBvYmplY3QgfSAtIFRoZSByZXN1bHRpbmcgZGljdGlvbmFyeSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBkaWN0KG9iamVjdCkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IHt9O1xuICAgIHRoaXMuZm9yRWFjaERlZXAob2JqZWN0LCAodmFsdWUsIHBvaW50ZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJlc3VsdHNbcG9pbnRlcl0gPSB2YWx1ZTsgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLyoqXG4gICAqICdmb3JFYWNoRGVlcCcgZnVuY3Rpb25cbiAgICpcbiAgICogSXRlcmF0ZXMgb3ZlciBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBvciBpdGVtcyBpbiBhbiBhcnJheVxuICAgKiBhbmQgaW52b2tlcyBhbiBpdGVyYXRlZSBmdW5jdGlvbiBmb3IgZWFjaCBrZXkvdmFsdWUgb3IgaW5kZXgvdmFsdWUgcGFpci5cbiAgICogQnkgZGVmYXVsdCwgaXRlcmF0ZXMgb3ZlciBpdGVtcyB3aXRoaW4gb2JqZWN0cyBhbmQgYXJyYXlzIGFmdGVyIGNhbGxpbmdcbiAgICogdGhlIGl0ZXJhdGVlIGZ1bmN0aW9uIG9uIHRoZSBjb250YWluaW5nIG9iamVjdCBvciBhcnJheSBpdHNlbGYuXG4gICAqXG4gICAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIHBvaW50ZXIsIHJvb3RPYmplY3QpLFxuICAgKiB3aGVyZSBwb2ludGVyIGlzIGEgSlNPTiBwb2ludGVyIGluZGljYXRpbmcgdGhlIGxvY2F0aW9uIG9mIHRoZSBjdXJyZW50XG4gICAqIHZhbHVlIHdpdGhpbiB0aGUgcm9vdCBvYmplY3QsIGFuZCByb290T2JqZWN0IGlzIHRoZSByb290IG9iamVjdCBpbml0aWFsbHlcbiAgICogc3VibWl0dGVkIHRvIHRoIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBJZiBhIHRoaXJkIG9wdGlvbmFsIHBhcmFtZXRlciAnYm90dG9tVXAnIGlzIHNldCB0byBUUlVFLCB0aGUgaXRlcmF0b3JcbiAgICogZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb24gc3ViLW9iamVjdHMgYW5kIGFycmF5cyBhZnRlciBiZWluZ1xuICAgKiBjYWxsZWQgb24gdGhlaXIgY29udGVudHMsIHJhdGhlciB0aGFuIGJlZm9yZSwgd2hpY2ggaXMgdGhlIGRlZmF1bHQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2FuIGFsc28gb3B0aW9uYWxseSBiZSBjYWxsZWQgZGlyZWN0bHkgb24gYSBzdWItb2JqZWN0IGJ5XG4gICAqIGluY2x1ZGluZyBvcHRpb25hbCA0dGggYW5kIDV0aCBwYXJhbWV0ZXJzcyB0byBzcGVjaWZ5IHRoZSBpbml0aWFsXG4gICAqIHJvb3Qgb2JqZWN0IGFuZCBwb2ludGVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHsgb2JqZWN0IH0gb2JqZWN0IC0gdGhlIGluaXRpYWwgb2JqZWN0IG9yIGFycmF5XG4gICAqIEBwYXJhbSAgeyAodjogYW55LCBwPzogc3RyaW5nLCBvPzogYW55KSA9PiBhbnkgfSBmdW5jdGlvbiAtIGl0ZXJhdGVlIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBib3R0b21VcCAtIG9wdGlvbmFsLCBzZXQgdG8gVFJVRSB0byByZXZlcnNlIGRpcmVjdGlvblxuICAgKiBAcGFyYW0gIHsgb2JqZWN0ID0gb2JqZWN0IH0gcm9vdE9iamVjdCAtIG9wdGlvbmFsLCByb290IG9iamVjdCBvciBhcnJheVxuICAgKiBAcGFyYW0gIHsgc3RyaW5nID0gJycgfSBwb2ludGVyIC0gb3B0aW9uYWwsIEpTT04gUG9pbnRlciB0byBvYmplY3Qgd2l0aGluIHJvb3RPYmplY3RcbiAgICogQHJldHVybiB7IG9iamVjdCB9IC0gVGhlIG1vZGlmaWVkIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGZvckVhY2hEZWVwKFxuICAgIG9iamVjdCwgZm46ICh2OiBhbnksIHA/OiBzdHJpbmcsIG8/OiBhbnkpID0+IGFueSA9ICh2KSA9PiB2LFxuICAgIGJvdHRvbVVwID0gZmFsc2UsIHBvaW50ZXIgPSAnJywgcm9vdE9iamVjdCA9IG9iamVjdFxuICApIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBmb3JFYWNoRGVlcCBlcnJvcjogSXRlcmF0b3IgaXMgbm90IGEgZnVuY3Rpb246YCwgZm4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWJvdHRvbVVwKSB7IGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7IH1cbiAgICBpZiAoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgICAgY29uc3QgbmV3UG9pbnRlciA9IHBvaW50ZXIgKyAnLycgKyB0aGlzLmVzY2FwZShrZXkpO1xuICAgICAgICB0aGlzLmZvckVhY2hEZWVwKG9iamVjdFtrZXldLCBmbiwgYm90dG9tVXAsIG5ld1BvaW50ZXIsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm90dG9tVXApIHsgZm4ob2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICB9XG5cbiAgLyoqXG4gICAqICdmb3JFYWNoRGVlcENvcHknIGZ1bmN0aW9uXG4gICAqXG4gICAqIFNpbWlsYXIgdG8gZm9yRWFjaERlZXAsIGJ1dCByZXR1cm5zIGEgY29weSBvZiB0aGUgb3JpZ2luYWwgb2JqZWN0LCB3aXRoXG4gICAqIHRoZSBzYW1lIGtleXMgYW5kIGluZGV4ZXMsIGJ1dCB3aXRoIHZhbHVlcyByZXBsYWNlZCB3aXRoIHRoZSByZXN1bHQgb2ZcbiAgICogdGhlIGl0ZXJhdGVlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHsgb2JqZWN0IH0gb2JqZWN0IC0gdGhlIGluaXRpYWwgb2JqZWN0IG9yIGFycmF5XG4gICAqIEBwYXJhbSAgeyAodjogYW55LCBrPzogc3RyaW5nLCBvPzogYW55LCBwPzogYW55KSA9PiBhbnkgfSBmdW5jdGlvbiAtIGl0ZXJhdGVlIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBib3R0b21VcCAtIG9wdGlvbmFsLCBzZXQgdG8gVFJVRSB0byByZXZlcnNlIGRpcmVjdGlvblxuICAgKiBAcGFyYW0gIHsgb2JqZWN0ID0gb2JqZWN0IH0gcm9vdE9iamVjdCAtIG9wdGlvbmFsLCByb290IG9iamVjdCBvciBhcnJheVxuICAgKiBAcGFyYW0gIHsgc3RyaW5nID0gJycgfSBwb2ludGVyIC0gb3B0aW9uYWwsIEpTT04gUG9pbnRlciB0byBvYmplY3Qgd2l0aGluIHJvb3RPYmplY3RcbiAgICogQHJldHVybiB7IG9iamVjdCB9IC0gVGhlIGNvcGllZCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBmb3JFYWNoRGVlcENvcHkoXG4gICAgb2JqZWN0LCBmbjogKHY6IGFueSwgcD86IHN0cmluZywgbz86IGFueSkgPT4gYW55ID0gKHYpID0+IHYsXG4gICAgYm90dG9tVXAgPSBmYWxzZSwgcG9pbnRlciA9ICcnLCByb290T2JqZWN0ID0gb2JqZWN0XG4gICkge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYGZvckVhY2hEZWVwQ29weSBlcnJvcjogSXRlcmF0b3IgaXMgbm90IGEgZnVuY3Rpb246YCwgZm4pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgbGV0IG5ld09iamVjdCA9IGlzQXJyYXkob2JqZWN0KSA/IFsgLi4ub2JqZWN0IF0gOiB7IC4uLm9iamVjdCB9O1xuICAgICAgaWYgKCFib3R0b21VcCkgeyBuZXdPYmplY3QgPSBmbihuZXdPYmplY3QsIHBvaW50ZXIsIHJvb3RPYmplY3QpOyB9XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhuZXdPYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld1BvaW50ZXIgPSBwb2ludGVyICsgJy8nICsgdGhpcy5lc2NhcGUoa2V5KTtcbiAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB0aGlzLmZvckVhY2hEZWVwQ29weShcbiAgICAgICAgICBuZXdPYmplY3Rba2V5XSwgZm4sIGJvdHRvbVVwLCBuZXdQb2ludGVyLCByb290T2JqZWN0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoYm90dG9tVXApIHsgbmV3T2JqZWN0ID0gZm4obmV3T2JqZWN0LCBwb2ludGVyLCByb290T2JqZWN0KTsgfVxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKG9iamVjdCwgcG9pbnRlciwgcm9vdE9iamVjdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdlc2NhcGUnIGZ1bmN0aW9uXG4gICAqXG4gICAqIEVzY2FwZXMgYSBzdHJpbmcgcmVmZXJlbmNlIGtleVxuICAgKlxuICAgKiBAcGFyYW0gIHsgc3RyaW5nIH0ga2V5IC0gc3RyaW5nIGtleSB0byBlc2NhcGVcbiAgICogQHJldHVybiB7IHN0cmluZyB9IC0gZXNjYXBlZCBrZXlcbiAgICovXG4gIHN0YXRpYyBlc2NhcGUoa2V5KSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpO1xuICAgIHJldHVybiBlc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICd1bmVzY2FwZScgZnVuY3Rpb25cbiAgICpcbiAgICogVW5lc2NhcGVzIGEgc3RyaW5nIHJlZmVyZW5jZSBrZXlcbiAgICpcbiAgICogQHBhcmFtICB7IHN0cmluZyB9IGtleSAtIHN0cmluZyBrZXkgdG8gdW5lc2NhcGVcbiAgICogQHJldHVybiB7IHN0cmluZyB9IC0gdW5lc2NhcGVkIGtleVxuICAgKi9cbiAgc3RhdGljIHVuZXNjYXBlKGtleSkge1xuICAgIGNvbnN0IHVuZXNjYXBlZCA9IGtleS50b1N0cmluZygpLnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKTtcbiAgICByZXR1cm4gdW5lc2NhcGVkO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZScgZnVuY3Rpb25cbiAgICpcbiAgICogQ29udmVydHMgYSBzdHJpbmcgSlNPTiBQb2ludGVyIGludG8gYSBhcnJheSBvZiBrZXlzXG4gICAqIChpZiBpbnB1dCBpcyBhbHJlYWR5IGFuIGFuIGFycmF5IG9mIGtleXMsIGl0IGlzIHJldHVybmVkIHVuY2hhbmdlZClcbiAgICpcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9yIGlmIGludmFsaWQgcG9pbnRlcj9cbiAgICogQHJldHVybiB7IHN0cmluZ1tdIH0gLSBKU09OIFBvaW50ZXIgYXJyYXkgb2Yga2V5c1xuICAgKi9cbiAgc3RhdGljIHBhcnNlKHBvaW50ZXIsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIocG9pbnRlcikpIHtcbiAgICAgIGlmIChlcnJvcnMpIHsgY29uc29sZS5lcnJvcihgcGFyc2UgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7IH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShwb2ludGVyKSkgeyByZXR1cm4gPHN0cmluZ1tdPnBvaW50ZXI7IH1cbiAgICBpZiAodHlwZW9mIHBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoKDxzdHJpbmc+cG9pbnRlcilbMF0gPT09ICcjJykgeyBwb2ludGVyID0gcG9pbnRlci5zbGljZSgxKTsgfVxuICAgICAgaWYgKDxzdHJpbmc+cG9pbnRlciA9PT0gJycgfHwgPHN0cmluZz5wb2ludGVyID09PSAnLycpIHsgcmV0dXJuIFtdOyB9XG4gICAgICByZXR1cm4gKDxzdHJpbmc+cG9pbnRlcikuc2xpY2UoMSkuc3BsaXQoJy8nKS5tYXAodGhpcy51bmVzY2FwZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICdjb21waWxlJyBmdW5jdGlvblxuICAgKlxuICAgKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBrZXlzIGludG8gYSBKU09OIFBvaW50ZXIgc3RyaW5nXG4gICAqIChpZiBpbnB1dCBpcyBhbHJlYWR5IGEgc3RyaW5nLCBpdCBpcyBub3JtYWxpemVkIGFuZCByZXR1cm5lZClcbiAgICpcbiAgICogVGhlIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgaXMgYSBkZWZhdWx0IHdoaWNoIHdpbGwgcmVwbGFjZSBhbnkgZW1wdHkga2V5cy5cbiAgICpcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBzdHJpbmcgfCBudW1iZXIgPSAnJyB9IGRlZmF1bHRWYWx1ZSAtIERlZmF1bHQgdmFsdWVcbiAgICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IGVycm9ycyAtIFNob3cgZXJyb3IgaWYgaW52YWxpZCBwb2ludGVyP1xuICAgKiBAcmV0dXJuIHsgc3RyaW5nIH0gLSBKU09OIFBvaW50ZXIgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29tcGlsZShwb2ludGVyLCBkZWZhdWx0VmFsdWUgPSAnJywgZXJyb3JzID0gZmFsc2UpIHtcbiAgICBpZiAocG9pbnRlciA9PT0gJyMnKSB7IHJldHVybiAnJzsgfVxuICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHBvaW50ZXIpKSB7XG4gICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYGNvbXBpbGUgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3BvaW50ZXJ9YCk7IH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShwb2ludGVyKSkge1xuICAgICAgaWYgKCg8c3RyaW5nW10+cG9pbnRlcikubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuICAgICAgcmV0dXJuICcvJyArICg8c3RyaW5nW10+cG9pbnRlcikubWFwKFxuICAgICAgICBrZXkgPT4ga2V5ID09PSAnJyA/IGRlZmF1bHRWYWx1ZSA6IHRoaXMuZXNjYXBlKGtleSlcbiAgICAgICkuam9pbignLycpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBvaW50ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAocG9pbnRlclswXSA9PT0gJyMnKSB7IHBvaW50ZXIgPSBwb2ludGVyLnNsaWNlKDEpOyB9XG4gICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ3RvS2V5JyBmdW5jdGlvblxuICAgKlxuICAgKiBFeHRyYWN0cyBuYW1lIG9mIHRoZSBmaW5hbCBrZXkgZnJvbSBhIEpTT04gUG9pbnRlci5cbiAgICpcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBwb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9yIGlmIGludmFsaWQgcG9pbnRlcj9cbiAgICogQHJldHVybiB7IHN0cmluZyB9IC0gdGhlIGV4dHJhY3RlZCBrZXlcbiAgICovXG4gIHN0YXRpYyB0b0tleShwb2ludGVyLCBlcnJvcnMgPSBmYWxzZSkge1xuICAgIGNvbnN0IGtleUFycmF5ID0gdGhpcy5wYXJzZShwb2ludGVyLCBlcnJvcnMpO1xuICAgIGlmIChrZXlBcnJheSA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICgha2V5QXJyYXkubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgIHJldHVybiBrZXlBcnJheVtrZXlBcnJheS5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaXNKc29uUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQ2hlY2tzIGEgc3RyaW5nIG9yIGFycmF5IHZhbHVlIHRvIGRldGVybWluZSBpZiBpdCBpcyBhIHZhbGlkIEpTT04gUG9pbnRlci5cbiAgICogUmV0dXJucyB0cnVlIGlmIGEgc3RyaW5nIGlzIGVtcHR5LCBvciBzdGFydHMgd2l0aCAnLycgb3IgJyMvJy5cbiAgICogUmV0dXJucyB0cnVlIGlmIGFuIGFycmF5IGNvbnRhaW5zIG9ubHkgc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtICB7IGFueSB9IHZhbHVlIC0gdmFsdWUgdG8gY2hlY2tcbiAgICogQHJldHVybiB7IGJvb2xlYW4gfSAtIHRydWUgaWYgdmFsdWUgaXMgYSB2YWxpZCBKU09OIFBvaW50ZXIsIG90aGVyd2lzZSBmYWxzZVxuICAgKi9cbiAgc3RhdGljIGlzSnNvblBvaW50ZXIodmFsdWUpIHtcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5ldmVyeShrZXkgPT4gdHlwZW9mIGtleSA9PT0gJ3N0cmluZycpO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnIycpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gJy8nIHx8IHZhbHVlLnNsaWNlKDAsIDIpID09PSAnIy8nKSB7XG4gICAgICAgIHJldHVybiAhLyh+W14wMV18fiQpL2cudGVzdCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAnaXNTdWJQb2ludGVyJyBmdW5jdGlvblxuICAgKlxuICAgKiBDaGVja3Mgd2hldGhlciBvbmUgSlNPTiBQb2ludGVyIGlzIGEgc3Vic2V0IG9mIGFub3RoZXIuXG4gICAqXG4gICAqIEBwYXJhbSAgeyBQb2ludGVyIH0gc2hvcnRQb2ludGVyIC0gcG90ZW50aWFsIHN1YnNldCBKU09OIFBvaW50ZXJcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBsb25nUG9pbnRlciAtIHBvdGVudGlhbCBzdXBlcnNldCBKU09OIFBvaW50ZXJcbiAgICogQHBhcmFtICB7IGJvb2xlYW4gPSBmYWxzZSB9IHRydWVJZk1hdGNoaW5nIC0gcmV0dXJuIHRydWUgaWYgcG9pbnRlcnMgbWF0Y2g/XG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9yIGlmIGludmFsaWQgcG9pbnRlcj9cbiAgICogQHJldHVybiB7IGJvb2xlYW4gfSAtIHRydWUgaWYgc2hvcnRQb2ludGVyIGlzIGEgc3Vic2V0IG9mIGxvbmdQb2ludGVyLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIHN0YXRpYyBpc1N1YlBvaW50ZXIoXG4gICAgc2hvcnRQb2ludGVyLCBsb25nUG9pbnRlciwgdHJ1ZUlmTWF0Y2hpbmcgPSBmYWxzZSwgZXJyb3JzID0gZmFsc2VcbiAgKSB7XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoc2hvcnRQb2ludGVyKSB8fCAhdGhpcy5pc0pzb25Qb2ludGVyKGxvbmdQb2ludGVyKSkge1xuICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICBsZXQgaW52YWxpZCA9ICcnO1xuICAgICAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihzaG9ydFBvaW50ZXIpKSB7IGludmFsaWQgKz0gYCAxOiAke3Nob3J0UG9pbnRlcn1gOyB9XG4gICAgICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKGxvbmdQb2ludGVyKSkgeyBpbnZhbGlkICs9IGAgMjogJHtsb25nUG9pbnRlcn1gOyB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYGlzU3ViUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXIgJHtpbnZhbGlkfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaG9ydFBvaW50ZXIgPSB0aGlzLmNvbXBpbGUoc2hvcnRQb2ludGVyLCAnJywgZXJyb3JzKTtcbiAgICBsb25nUG9pbnRlciA9IHRoaXMuY29tcGlsZShsb25nUG9pbnRlciwgJycsIGVycm9ycyk7XG4gICAgcmV0dXJuIHNob3J0UG9pbnRlciA9PT0gbG9uZ1BvaW50ZXIgPyB0cnVlSWZNYXRjaGluZyA6XG4gICAgICBgJHtzaG9ydFBvaW50ZXJ9L2AgPT09IGxvbmdQb2ludGVyLnNsaWNlKDAsIHNob3J0UG9pbnRlci5sZW5ndGggKyAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAndG9JbmRleGVkUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogTWVyZ2VzIGFuIGFycmF5IG9mIG51bWVyaWMgaW5kZXhlcyBhbmQgYSBnZW5lcmljIHBvaW50ZXIgdG8gY3JlYXRlIGFuXG4gICAqIGluZGV4ZWQgcG9pbnRlciBmb3IgYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgbWVyZ2luZyB0aGUgZ2VuZXJpYyBwb2ludGVyICcvZm9vLy0vYmFyLy0vYmF6JyBhbmRcbiAgICogdGhlIGFycmF5IFs0LCAyXSB3b3VsZCByZXN1bHQgaW4gdGhlIGluZGV4ZWQgcG9pbnRlciAnL2Zvby80L2Jhci8yL2JheidcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSAgeyBQb2ludGVyIH0gZ2VuZXJpY1BvaW50ZXIgLSBUaGUgZ2VuZXJpYyBwb2ludGVyXG4gICAqIEBwYXJhbSAgeyBudW1iZXJbXSB9IGluZGV4QXJyYXkgLSBUaGUgYXJyYXkgb2YgbnVtZXJpYyBpbmRleGVzXG4gICAqIEBwYXJhbSAgeyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXAgLSBBbiBvcHRpb25hbCBhcnJheSBtYXBcbiAgICogQHJldHVybiB7IHN0cmluZyB9IC0gVGhlIG1lcmdlZCBwb2ludGVyIHdpdGggaW5kZXhlc1xuICAgKi9cbiAgc3RhdGljIHRvSW5kZXhlZFBvaW50ZXIoXG4gICAgZ2VuZXJpY1BvaW50ZXIsIGluZGV4QXJyYXksIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbnVsbFxuICApIHtcbiAgICBpZiAodGhpcy5pc0pzb25Qb2ludGVyKGdlbmVyaWNQb2ludGVyKSAmJiBpc0FycmF5KGluZGV4QXJyYXkpKSB7XG4gICAgICBsZXQgaW5kZXhlZFBvaW50ZXIgPSB0aGlzLmNvbXBpbGUoZ2VuZXJpY1BvaW50ZXIpO1xuICAgICAgaWYgKGlzTWFwKGFycmF5TWFwKSkge1xuICAgICAgICBsZXQgYXJyYXlJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBpbmRleGVkUG9pbnRlci5yZXBsYWNlKC9cXC9cXC0oPz1cXC98JCkvZywgKGtleSwgc3RyaW5nSW5kZXgpID0+XG4gICAgICAgICAgYXJyYXlNYXAuaGFzKCg8c3RyaW5nPmluZGV4ZWRQb2ludGVyKS5zbGljZSgwLCBzdHJpbmdJbmRleCkpID9cbiAgICAgICAgICAgICcvJyArIGluZGV4QXJyYXlbYXJyYXlJbmRleCsrXSA6IGtleVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBwb2ludGVySW5kZXggb2YgaW5kZXhBcnJheSkge1xuICAgICAgICAgIGluZGV4ZWRQb2ludGVyID0gaW5kZXhlZFBvaW50ZXIucmVwbGFjZSgnLy0nLCAnLycgKyBwb2ludGVySW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleGVkUG9pbnRlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzSnNvblBvaW50ZXIoZ2VuZXJpY1BvaW50ZXIpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0luZGV4ZWRQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gUG9pbnRlcjogJHtnZW5lcmljUG9pbnRlcn1gKTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KGluZGV4QXJyYXkpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGB0b0luZGV4ZWRQb2ludGVyIGVycm9yOiBJbnZhbGlkIGluZGV4QXJyYXk6ICR7aW5kZXhBcnJheX1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ3RvR2VuZXJpY1BvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIENvbXBhcmVzIGFuIGluZGV4ZWQgcG9pbnRlciB0byBhbiBhcnJheSBtYXAgYW5kIHJlbW92ZXMgbGlzdCBhcnJheVxuICAgKiBpbmRleGVzIChidXQgbGVhdmVzIHR1cGxlIGFycnJheSBpbmRleGVzIGFuZCBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGluZ1xuICAgKiBudW1lcmljIGtleXMpIHRvIGNyZWF0ZSBhIGdlbmVyaWMgcG9pbnRlci5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHVzaW5nIHRoZSBpbmRleGVkIHBvaW50ZXIgJy9mb28vMS9iYXIvMi9iYXovMycgYW5kXG4gICAqIHRoZSBhcnJheU1hcCBbWycvZm9vJywgMF0sIFsnL2Zvby8tL2JhcicsIDNdLCBbJy9mb28vLS9iYXIvLS9iYXonLCAwXV1cbiAgICogd291bGQgcmVzdWx0IGluIHRoZSBnZW5lcmljIHBvaW50ZXIgJy9mb28vLS9iYXIvMi9iYXovLSdcbiAgICogVXNpbmcgdGhlIGluZGV4ZWQgcG9pbnRlciAnL2Zvby8xL2Jhci80L2Jhei8zJyBhbmQgdGhlIHNhbWUgYXJyYXlNYXBcbiAgICogd291bGQgcmVzdWx0IGluIHRoZSBnZW5lcmljIHBvaW50ZXIgJy9mb28vLS9iYXIvLS9iYXovLSdcbiAgICogKHRoZSBiYXIgYXJyYXkgaGFzIDMgdHVwbGUgaXRlbXMsIHNvIGluZGV4IDIgaXMgcmV0YWluZWQsIGJ1dCA0IGlzIHJlbW92ZWQpXG4gICAqXG4gICAqIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGFycmF5TWFwIGlzOiBbWydwYXRoIHRvIGFycmF5JywgbnVtYmVyIG9mIHR1cGxlIGl0ZW1zXS4uLl1cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSAgeyBQb2ludGVyIH0gaW5kZXhlZFBvaW50ZXIgLSBUaGUgaW5kZXhlZCBwb2ludGVyIChhcnJheSBvciBzdHJpbmcpXG4gICAqIEBwYXJhbSAgeyBNYXA8c3RyaW5nLCBudW1iZXI+IH0gYXJyYXlNYXAgLSBUaGUgb3B0aW9uYWwgYXJyYXkgbWFwIChmb3IgcHJlc2VydmluZyB0dXBsZSBpbmRleGVzKVxuICAgKiBAcmV0dXJuIHsgc3RyaW5nIH0gLSBUaGUgZ2VuZXJpYyBwb2ludGVyIHdpdGggaW5kZXhlcyByZW1vdmVkXG4gICAqL1xuICBzdGF0aWMgdG9HZW5lcmljUG9pbnRlcihpbmRleGVkUG9pbnRlciwgYXJyYXlNYXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihpbmRleGVkUG9pbnRlcikgJiYgaXNNYXAoYXJyYXlNYXApKSB7XG4gICAgICBjb25zdCBwb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKGluZGV4ZWRQb2ludGVyKTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRlckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHN1YlBvaW50ZXIgPSB0aGlzLmNvbXBpbGUocG9pbnRlckFycmF5LnNsaWNlKDAsIGkpKTtcbiAgICAgICAgaWYgKGFycmF5TWFwLmhhcyhzdWJQb2ludGVyKSAmJlxuICAgICAgICAgIGFycmF5TWFwLmdldChzdWJQb2ludGVyKSA8PSArcG9pbnRlckFycmF5W2ldXG4gICAgICAgICkge1xuICAgICAgICAgIHBvaW50ZXJBcnJheVtpXSA9ICctJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZShwb2ludGVyQXJyYXkpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihpbmRleGVkUG9pbnRlcikpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvR2VuZXJpY1BvaW50ZXIgZXJyb3I6IGludmFsaWQgSlNPTiBQb2ludGVyOiAke2luZGV4ZWRQb2ludGVyfWApO1xuICAgIH1cbiAgICBpZiAoIWlzTWFwKGFycmF5TWFwKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9HZW5lcmljUG9pbnRlciBlcnJvcjogaW52YWxpZCBhcnJheU1hcDogJHthcnJheU1hcH1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogJ3RvQ29udHJvbFBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIEFjY2VwdHMgYSBKU09OIFBvaW50ZXIgZm9yIGEgZGF0YSBvYmplY3QgYW5kIHJldHVybnMgYSBKU09OIFBvaW50ZXIgZm9yIHRoZVxuICAgKiBtYXRjaGluZyBjb250cm9sIGluIGFuIEFuZ3VsYXIgRm9ybUdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IGRhdGFQb2ludGVyIC0gSlNPTiBQb2ludGVyIChzdHJpbmcgb3IgYXJyYXkpIHRvIGEgZGF0YSBvYmplY3RcbiAgICogQHBhcmFtICB7IEZvcm1Hcm91cCB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBjb250cm9sTXVzdEV4aXN0IC0gT25seSByZXR1cm4gaWYgY29udHJvbCBleGlzdHM/XG4gICAqIEByZXR1cm4geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIGZvcm1Hcm91cCBvYmplY3RcbiAgICovXG4gIHN0YXRpYyB0b0NvbnRyb2xQb2ludGVyKGRhdGFQb2ludGVyLCBmb3JtR3JvdXAsIGNvbnRyb2xNdXN0RXhpc3QgPSBmYWxzZSkge1xuICAgIGNvbnN0IGRhdGFQb2ludGVyQXJyYXkgPSB0aGlzLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgICBjb25zdCBjb250cm9sUG9pbnRlckFycmF5OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgICBpZiAoZGF0YVBvaW50ZXJBcnJheSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgZGF0YVBvaW50ZXJBcnJheSkge1xuICAgICAgICBpZiAoaGFzT3duKHN1Ykdyb3VwLCAnY29udHJvbHMnKSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaCgnY29udHJvbHMnKTtcbiAgICAgICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwLmNvbnRyb2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHN1Ykdyb3VwKSAmJiAoa2V5ID09PSAnLScpKSB7XG4gICAgICAgICAgY29udHJvbFBvaW50ZXJBcnJheS5wdXNoKChzdWJHcm91cC5sZW5ndGggLSAxKS50b1N0cmluZygpKTtcbiAgICAgICAgICBzdWJHcm91cCA9IHN1Ykdyb3VwW3N1Ykdyb3VwLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2UgaWYgKGhhc093bihzdWJHcm91cCwga2V5KSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaChrZXkpO1xuICAgICAgICAgIHN1Ykdyb3VwID0gc3ViR3JvdXBba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250cm9sTXVzdEV4aXN0KSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgdG9Db250cm9sUG9pbnRlciBlcnJvcjogVW5hYmxlIHRvIGZpbmQgXCIke2tleX1cIiBpdGVtIGluIEZvcm1Hcm91cC5gKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGRhdGFQb2ludGVyKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1Hcm91cCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRyb2xQb2ludGVyQXJyYXkucHVzaChrZXkpO1xuICAgICAgICAgIHN1Ykdyb3VwID0geyBjb250cm9sczoge30gfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZShjb250cm9sUG9pbnRlckFycmF5KTtcbiAgICB9XG4gICAgY29uc29sZS5lcnJvcihgdG9Db250cm9sUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gIH1cblxuICAvKipcbiAgICogJ3RvU2NoZW1hUG9pbnRlcicgZnVuY3Rpb25cbiAgICpcbiAgICogQWNjZXB0cyBhIEpTT04gUG9pbnRlciB0byBhIHZhbHVlIGluc2lkZSBhIGRhdGEgb2JqZWN0IGFuZCBhIEpTT04gc2NoZW1hXG4gICAqIGZvciB0aGF0IG9iamVjdC5cbiAgICpcbiAgICogUmV0dXJucyBhIFBvaW50ZXIgdG8gdGhlIHN1Yi1zY2hlbWEgZm9yIHRoZSB2YWx1ZSBpbnNpZGUgdGhlIG9iamVjdCdzIHNjaGVtYS5cbiAgICpcbiAgICogQHBhcmFtICB7IFBvaW50ZXIgfSBkYXRhUG9pbnRlciAtIEpTT04gUG9pbnRlciAoc3RyaW5nIG9yIGFycmF5KSB0byBhbiBvYmplY3RcbiAgICogQHBhcmFtICB7IGFueSB9IHNjaGVtYSAtIEpTT04gc2NoZW1hIGZvciB0aGUgb2JqZWN0XG4gICAqIEByZXR1cm4geyBQb2ludGVyIH0gLSBKU09OIFBvaW50ZXIgKHN0cmluZykgdG8gdGhlIG9iamVjdCdzIHNjaGVtYVxuICAgKi9cbiAgc3RhdGljIHRvU2NoZW1hUG9pbnRlcihkYXRhUG9pbnRlciwgc2NoZW1hKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikgJiYgdHlwZW9mIHNjaGVtYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJBcnJheSA9IHRoaXMucGFyc2UoZGF0YVBvaW50ZXIpO1xuICAgICAgaWYgKCFwb2ludGVyQXJyYXkubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgICAgY29uc3QgZmlyc3RLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcgfHwgc2NoZW1hLnByb3BlcnRpZXMgfHwgc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmICgoc2NoZW1hLnByb3BlcnRpZXMgfHwge30pW2ZpcnN0S2V5XSkge1xuICAgICAgICAgIHJldHVybiBgL3Byb3BlcnRpZXMvJHt0aGlzLmVzY2FwZShmaXJzdEtleSl9YCArXG4gICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5wcm9wZXJ0aWVzW2ZpcnN0S2V5XSk7XG4gICAgICAgIH0gZWxzZSAgaWYgKHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcykge1xuICAgICAgICAgIHJldHVybiAnL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyArXG4gICAgICAgICAgICB0aGlzLnRvU2NoZW1hUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoc2NoZW1hLnR5cGUgPT09ICdhcnJheScgfHwgc2NoZW1hLml0ZW1zKSAmJlxuICAgICAgICAoaXNOdW1iZXIoZmlyc3RLZXkpIHx8IGZpcnN0S2V5ID09PSAnLScgfHwgZmlyc3RLZXkgPT09ICcnKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGFycmF5SXRlbSA9IGZpcnN0S2V5ID09PSAnLScgfHwgZmlyc3RLZXkgPT09ICcnID8gMCA6ICtmaXJzdEtleTtcbiAgICAgICAgaWYgKGlzQXJyYXkoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIGlmIChhcnJheUl0ZW0gPCBzY2hlbWEuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJy9pdGVtcy8nICsgYXJyYXlJdGVtICtcbiAgICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuaXRlbXNbYXJyYXlJdGVtXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJy9hZGRpdGlvbmFsSXRlbXMnICtcbiAgICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgICAgIHJldHVybiAnL2l0ZW1zJyArIHRoaXMudG9TY2hlbWFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hLml0ZW1zKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICAgIHJldHVybiAnL2FkZGl0aW9uYWxJdGVtcycgK1xuICAgICAgICAgICAgdGhpcy50b1NjaGVtYVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihgdG9TY2hlbWFQb2ludGVyIGVycm9yOiBEYXRhIHBvaW50ZXIgJHtkYXRhUG9pbnRlcn0gYCArXG4gICAgICAgIGBub3QgY29tcGF0aWJsZSB3aXRoIHNjaGVtYSAke3NjaGVtYX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYHRvU2NoZW1hUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc2NoZW1hICE9PSAnb2JqZWN0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihgdG9TY2hlbWFQb2ludGVyIGVycm9yOiBJbnZhbGlkIEpTT04gU2NoZW1hOiAke3NjaGVtYX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogJ3RvRGF0YVBvaW50ZXInIGZ1bmN0aW9uXG4gICAqXG4gICAqIEFjY2VwdHMgYSBKU09OIFBvaW50ZXIgdG8gYSBzdWItc2NoZW1hIGluc2lkZSBhIEpTT04gc2NoZW1hIGFuZCB0aGUgc2NoZW1hLlxuICAgKlxuICAgKiBJZiBwb3NzaWJsZSwgcmV0dXJucyBhIGdlbmVyaWMgUG9pbnRlciB0byB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbnNpZGVcbiAgICogdGhlIGRhdGEgb2JqZWN0IGRlc2NyaWJlZCBieSB0aGUgSlNPTiBzY2hlbWEuXG4gICAqXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgc3ViLXNjaGVtYSBpcyBpbiBhbiBhbWJpZ3VvdXMgbG9jYXRpb24gKHN1Y2ggYXNcbiAgICogZGVmaW5pdGlvbnMgb3IgYWRkaXRpb25hbFByb3BlcnRpZXMpIHdoZXJlIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlXG4gICAqIGxvY2F0aW9uIGNhbm5vdCBiZSBkZXRlcm1pbmVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHNjaGVtYVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSkgdG8gYSBKU09OIHNjaGVtYVxuICAgKiBAcGFyYW0gIHsgYW55IH0gc2NoZW1hIC0gdGhlIEpTT04gc2NoZW1hXG4gICAqIEBwYXJhbSAgeyBib29sZWFuID0gZmFsc2UgfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAgICogQHJldHVybiB7IFBvaW50ZXIgfSAtIEpTT04gUG9pbnRlciAoc3RyaW5nKSB0byB0aGUgdmFsdWUgaW4gdGhlIGRhdGEgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgdG9EYXRhUG9pbnRlcihzY2hlbWFQb2ludGVyLCBzY2hlbWEsIGVycm9ycyA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNKc29uUG9pbnRlcihzY2hlbWFQb2ludGVyKSAmJiB0eXBlb2Ygc2NoZW1hID09PSAnb2JqZWN0JyAmJlxuICAgICAgdGhpcy5oYXMoc2NoZW1hLCBzY2hlbWFQb2ludGVyKVxuICAgICkge1xuICAgICAgY29uc3QgcG9pbnRlckFycmF5ID0gdGhpcy5wYXJzZShzY2hlbWFQb2ludGVyKTtcbiAgICAgIGlmICghcG9pbnRlckFycmF5Lmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICAgIGNvbnN0IGRhdGFQb2ludGVyID0gJyc7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSAncHJvcGVydGllcycgfHxcbiAgICAgICAgKGZpcnN0S2V5ID09PSAnaXRlbXMnICYmIGlzQXJyYXkoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzZWNvbmRLZXkgPSBwb2ludGVyQXJyYXkuc2hpZnQoKTtcbiAgICAgICAgY29uc3QgcG9pbnRlclN1ZmZpeCA9IHRoaXMudG9EYXRhUG9pbnRlcihwb2ludGVyQXJyYXksIHNjaGVtYVtmaXJzdEtleV1bc2Vjb25kS2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvJyArIHNlY29uZEtleSArIHBvaW50ZXJTdWZmaXg7XG4gICAgICB9IGVsc2UgaWYgKGZpcnN0S2V5ID09PSAnYWRkaXRpb25hbEl0ZW1zJyB8fFxuICAgICAgICAoZmlyc3RLZXkgPT09ICdpdGVtcycgJiYgaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBwb2ludGVyU3VmZml4ID0gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XSk7XG4gICAgICAgIHJldHVybiBwb2ludGVyU3VmZml4ID09PSBudWxsID8gbnVsbCA6ICcvLScgKyBwb2ludGVyU3VmZml4O1xuICAgICAgfSBlbHNlIGlmIChbJ2FsbE9mJywgJ2FueU9mJywgJ29uZU9mJ10uaW5jbHVkZXMoZmlyc3RLZXkpKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZEtleSA9IHBvaW50ZXJBcnJheS5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50b0RhdGFQb2ludGVyKHBvaW50ZXJBcnJheSwgc2NoZW1hW2ZpcnN0S2V5XVtzZWNvbmRLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoZmlyc3RLZXkgPT09ICdub3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvRGF0YVBvaW50ZXIocG9pbnRlckFycmF5LCBzY2hlbWFbZmlyc3RLZXldKTtcbiAgICAgIH0gZWxzZSBpZiAoWydjb250YWlucycsICdkZWZpbml0aW9ucycsICdkZXBlbmRlbmNpZXMnLCAnYWRkaXRpb25hbEl0ZW1zJyxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ3Byb3BlcnR5TmFtZXMnXS5pbmNsdWRlcyhmaXJzdEtleSlcbiAgICAgICkge1xuICAgICAgICBpZiAoZXJyb3JzKSB7IGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEFtYmlndW91cyBsb2NhdGlvbmApOyB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIGlmICghdGhpcy5pc0pzb25Qb2ludGVyKHNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHRvRGF0YVBvaW50ZXIgZXJyb3I6IEludmFsaWQgSlNPTiBQb2ludGVyOiAke3NjaGVtYVBvaW50ZXJ9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogSW52YWxpZCBKU09OIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdG9EYXRhUG9pbnRlciBlcnJvcjogUG9pbnRlciAke3NjaGVtYVBvaW50ZXJ9IGludmFsaWQgZm9yIFNjaGVtYTogJHtzY2hlbWF9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICdwYXJzZU9iamVjdFBhdGgnIGZ1bmN0aW9uXG4gICAqXG4gICAqIFBhcnNlcyBhIEphdmFTY3JpcHQgb2JqZWN0IHBhdGggaW50byBhbiBhcnJheSBvZiBrZXlzLCB3aGljaFxuICAgKiBjYW4gdGhlbiBiZSBwYXNzZWQgdG8gY29tcGlsZSgpIHRvIGNvbnZlcnQgaW50byBhIHN0cmluZyBKU09OIFBvaW50ZXIuXG4gICAqXG4gICAqIEJhc2VkIG9uIG1pa2UtbWFyY2FjY2kncyBleGNlbGxlbnQgb2JqZWN0cGF0aCBwYXJzZSBmdW5jdGlvbjpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL21pa2UtbWFyY2FjY2kvb2JqZWN0cGF0aFxuICAgKlxuICAgKiBAcGFyYW0gIHsgUG9pbnRlciB9IHBhdGggLSBUaGUgb2JqZWN0IHBhdGggdG8gcGFyc2VcbiAgICogQHJldHVybiB7IHN0cmluZ1tdIH0gLSBUaGUgcmVzdWx0aW5nIGFycmF5IG9mIGtleXNcbiAgICovXG4gIHN0YXRpYyBwYXJzZU9iamVjdFBhdGgocGF0aCkge1xuICAgIGlmIChpc0FycmF5KHBhdGgpKSB7IHJldHVybiA8c3RyaW5nW10+cGF0aDsgfVxuICAgIGlmICh0aGlzLmlzSnNvblBvaW50ZXIocGF0aCkpIHsgcmV0dXJuIHRoaXMucGFyc2UocGF0aCk7IH1cbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gICAgICB3aGlsZSAoaW5kZXggPCBwYXRoLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBuZXh0RG90ID0gcGF0aC5pbmRleE9mKCcuJywgaW5kZXgpO1xuICAgICAgICBjb25zdCBuZXh0T0IgPSBwYXRoLmluZGV4T2YoJ1snLCBpbmRleCk7IC8vIG5leHQgb3BlbiBicmFja2V0XG4gICAgICAgIGlmIChuZXh0RG90ID09PSAtMSAmJiBuZXh0T0IgPT09IC0xKSB7IC8vIGxhc3QgaXRlbVxuICAgICAgICAgIHBhcnRzLnB1c2gocGF0aC5zbGljZShpbmRleCkpO1xuICAgICAgICAgIGluZGV4ID0gcGF0aC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSBpZiAobmV4dERvdCAhPT0gLTEgJiYgKG5leHREb3QgPCBuZXh0T0IgfHwgbmV4dE9CID09PSAtMSkpIHsgLy8gZG90IG5vdGF0aW9uXG4gICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4LCBuZXh0RG90KSk7XG4gICAgICAgICAgaW5kZXggPSBuZXh0RG90ICsgMTtcbiAgICAgICAgfSBlbHNlIHsgLy8gYnJhY2tldCBub3RhdGlvblxuICAgICAgICAgIGlmIChuZXh0T0IgPiBpbmRleCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4LCBuZXh0T0IpKTtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dE9CO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBxdW90ZSA9IHBhdGguY2hhckF0KG5leHRPQiArIDEpO1xuICAgICAgICAgIGlmIChxdW90ZSA9PT0gJ1wiJyB8fCBxdW90ZSA9PT0gJ1xcJycpIHsgLy8gZW5jbG9zaW5nIHF1b3Rlc1xuICAgICAgICAgICAgbGV0IG5leHRDQiA9IHBhdGguaW5kZXhPZihxdW90ZSArICddJywgbmV4dE9CKTsgLy8gbmV4dCBjbG9zZSBicmFja2V0XG4gICAgICAgICAgICB3aGlsZSAobmV4dENCICE9PSAtMSAmJiBwYXRoLmNoYXJBdChuZXh0Q0IgLSAxKSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgIG5leHRDQiA9IHBhdGguaW5kZXhPZihxdW90ZSArICddJywgbmV4dENCICsgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV4dENCID09PSAtMSkgeyBuZXh0Q0IgPSBwYXRoLmxlbmd0aDsgfVxuICAgICAgICAgICAgcGFydHMucHVzaChwYXRoLnNsaWNlKGluZGV4ICsgMiwgbmV4dENCKVxuICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcJyArIHF1b3RlLCAnZycpLCBxdW90ZSkpO1xuICAgICAgICAgICAgaW5kZXggPSBuZXh0Q0IgKyAyO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIG5vIGVuY2xvc2luZyBxdW90ZXNcbiAgICAgICAgICAgIGxldCBuZXh0Q0IgPSBwYXRoLmluZGV4T2YoJ10nLCBuZXh0T0IpOyAvLyBuZXh0IGNsb3NlIGJyYWNrZXRcbiAgICAgICAgICAgIGlmIChuZXh0Q0IgPT09IC0xKSB7IG5leHRDQiA9IHBhdGgubGVuZ3RoOyB9XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHBhdGguc2xpY2UoaW5kZXggKyAxLCBuZXh0Q0IpKTtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dENCICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhdGguY2hhckF0KGluZGV4KSA9PT0gJy4nKSB7IGluZGV4Kys7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnRzO1xuICAgIH1cbiAgICBjb25zb2xlLmVycm9yKCdwYXJzZU9iamVjdFBhdGggZXJyb3I6IElucHV0IG9iamVjdCBwYXRoIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gIH1cbn1cbiJdfQ==