import * as tslib_1 from "tslib";
import { hasValue, inArray, isArray, isDefined, isObject, isEmpty, isMap, isSet, isString } from './validator.functions';
/**
 * Utility function library:
 *
 * addClasses, copy, forEach, forEachCopy, hasOwn, mergeFilteredObject,
 * uniqueItems, commonItems, fixTitle, toTitleCase
*/
/**
 * 'addClasses' function
 *
 * Merges two space-delimited lists of CSS classes and removes duplicates.
 *
 * @param {string | string[] | Set<string>} oldClasses
 * @param {string | string[] | Set<string>} newClasses
 * @return {string | string[] | Set<string>} - Combined classes
 */
export function addClasses(oldClasses, newClasses) {
    var badType = function (i) { return !isSet(i) && !isArray(i) && !isString(i); };
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    var toSet = function (i) { return isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' ')); };
    var combinedSet = toSet(oldClasses);
    var newSet = toSet(newClasses);
    newSet.forEach(function (c) { return combinedSet.add(c); });
    if (isSet(oldClasses)) {
        return combinedSet;
    }
    if (isArray(oldClasses)) {
        return Array.from(combinedSet);
    }
    return Array.from(combinedSet).join(' ');
}
/**
 * 'copy' function
 *
 * Makes a shallow copy of a JavaScript object, array, Map, or Set.
 * If passed a JavaScript primitive value (string, number, boolean, or null),
 * it returns the value.
 *
 * @param {Object|Array|string|number|boolean|null} object - The object to copy
 * @param {boolean = false} errors - Show errors?
 * @return {Object|Array|string|number|boolean|null} - The copied object
 */
export function copy(object, errors) {
    if (errors === void 0) { errors = false; }
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (isMap(object)) {
        return new Map(object);
    }
    if (isSet(object)) {
        return new Set(object);
    }
    if (isArray(object)) {
        return tslib_1.__spread(object);
    }
    if (isObject(object)) {
        return tslib_1.__assign({}, object);
    }
    if (errors) {
        console.error('copy error: Object to copy must be a JavaScript object or value.');
    }
    return object;
}
/**
 * 'forEach' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator funciton on each item.
 *
 * The iterator function is called with four values:
 * 1. The current item's value
 * 2. The current item's key
 * 3. The parent object, which contains the current item
 * 4. The root object
 *
 * Setting the optional third parameter to 'top-down' or 'bottom-up' will cause
 * it to also recursively iterate over items in sub-objects or sub-arrays in the
 * specified direction.
 *
 * @param {Object|Array} object - The object or array to iterate over
 * @param {function} fn - the iterator funciton to call on each item
 * @param {boolean = false} errors - Show errors?
 * @return {void}
 */
export function forEach(object, fn, recurse, rootObject, errors) {
    if (recurse === void 0) { recurse = false; }
    if (rootObject === void 0) { rootObject = object; }
    if (errors === void 0) { errors = false; }
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        try {
            for (var _a = tslib_1.__values(Object.keys(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                var value = object[key];
                if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                    forEach(value, fn, recurse, rootObject);
                }
                fn(value, key, object, rootObject);
                if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                    forEach(value, fn, recurse, rootObject);
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
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEach error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEach error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
    var e_1, _c;
}
/**
 * 'forEachCopy' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator function on each item. Returns a new object or array
 * with the same keys or indexes as the original, and values set to the results
 * of the iterator function.
 *
 * Does NOT recursively iterate over items in sub-objects or sub-arrays.
 *
 * @param {Object | Array} object - The object or array to iterate over
 * @param {function} fn - The iterator funciton to call on each item
 * @param {boolean = false} errors - Show errors?
 * @return {Object | Array} - The resulting object or array
 */
export function forEachCopy(object, fn, errors) {
    if (errors === void 0) { errors = false; }
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        var newObject = isArray(object) ? [] : {};
        try {
            for (var _a = tslib_1.__values(Object.keys(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                newObject[key] = fn(object[key], key, object);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return newObject;
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEachCopy error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEachCopy error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
    var e_2, _c;
}
/**
 * 'hasOwn' utility function
 *
 * Checks whether an object or array has a particular property.
 *
 * @param {any} object - the object to check
 * @param {string} property - the property to look for
 * @return {boolean} - true if object has property, false if not
 */
export function hasOwn(object, property) {
    if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
        (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))) {
        return false;
    }
    if (isMap(object) || isSet(object)) {
        return object.has(property);
    }
    if (typeof property === 'number') {
        if (isArray(object)) {
            return object[property];
        }
        property = property + '';
    }
    return object.hasOwnProperty(property);
}
/**
 * 'mergeFilteredObject' utility function
 *
 * Shallowly merges two objects, setting key and values from source object
 * in target object, excluding specified keys.
 *
 * Optionally, it can also use functions to transform the key names and/or
 * the values of the merging object.
 *
 * @param {PlainObject} targetObject - Target object to add keys and values to
 * @param {PlainObject} sourceObject - Source object to copy keys and values from
 * @param {string[]} excludeKeys - Array of keys to exclude
 * @param {(string: string) => string = (k) => k} keyFn - Function to apply to keys
 * @param {(any: any) => any = (v) => v} valueFn - Function to apply to values
 * @return {PlainObject} - Returns targetObject
 */
export function mergeFilteredObject(targetObject, sourceObject, excludeKeys, keyFn, valFn) {
    if (excludeKeys === void 0) { excludeKeys = []; }
    if (keyFn === void 0) { keyFn = function (key) { return key; }; }
    if (valFn === void 0) { valFn = function (val) { return val; }; }
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    try {
        for (var _a = tslib_1.__values(Object.keys(sourceObject)), _b = _a.next(); !_b.done; _b = _a.next()) {
            var key = _b.value;
            if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
                targetObject[keyFn(key)] = valFn(sourceObject[key]);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return targetObject;
    var e_3, _c;
}
/**
 * 'uniqueItems' function
 *
 * Accepts any number of string value inputs,
 * and returns an array of all input vaues, excluding duplicates.
 *
 * @param {...string} ...items -
 * @return {string[]} -
 */
export function uniqueItems() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var returnItems = [];
    try {
        for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            if (!returnItems.includes(item)) {
                returnItems.push(item);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return returnItems;
    var e_4, _a;
}
/**
 * 'commonItems' function
 *
 * Accepts any number of strings or arrays of string values,
 * and returns a single array containing only values present in all inputs.
 *
 * @param {...string|string[]} ...arrays -
 * @return {string[]} -
 */
export function commonItems() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var returnItems = null;
    var _loop_1 = function (array) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? tslib_1.__spread(array) :
            returnItems.filter(function (item) { return array.includes(item); });
        if (!returnItems.length) {
            return { value: [] };
        }
    };
    try {
        for (var arrays_1 = tslib_1.__values(arrays), arrays_1_1 = arrays_1.next(); !arrays_1_1.done; arrays_1_1 = arrays_1.next()) {
            var array = arrays_1_1.value;
            var state_1 = _loop_1(array);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (arrays_1_1 && !arrays_1_1.done && (_a = arrays_1.return)) _a.call(arrays_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return returnItems;
    var e_5, _a;
}
/**
 * 'fixTitle' function
 *
 *
 * @param {string} input -
 * @return {string} -
 */
export function fixTitle(name) {
    return name && toTitleCase(name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '));
}
/**
 * 'toTitleCase' function
 *
 * Intelligently converts an input string to Title Case.
 *
 * Accepts an optional second parameter with a list of additional
 * words and abbreviations to force into a particular case.
 *
 * This function is built on prior work by John Gruber and David Gouch:
 * http://daringfireball.net/2008/08/title_case_update
 * https://github.com/gouch/to-title-case
 *
 * @param {string} input -
 * @param {string|string[]} forceWords? -
 * @return {string} -
 */
export function toTitleCase(input, forceWords) {
    if (!isString(input)) {
        return input;
    }
    var forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = forceWords.split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    var forceArrayLower = forceArray.map(function (w) { return w.toLowerCase(); });
    var noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    var prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (word, idx) {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            var newWord = void 0;
            var forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
            if (!forceWord) {
                if (noInitialCase) {
                    if (word.slice(1).search(/\../) !== -1) {
                        newWord = word.toLowerCase();
                    }
                    else {
                        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                    }
                }
                else {
                    newWord = word[0].toUpperCase() + word.slice(1);
                }
            }
            else if (forceWord === forceWord.toLowerCase() && (idx === 0 || idx + word.length === input.length ||
                prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
                (input[idx - 1] !== '-' && input[idx + word.length] === '-'))) {
                newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
            }
            else {
                newWord = forceWord;
            }
            prevLastChar = word.slice(-1);
            return newWord;
        }
    });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQ3RFLFFBQVEsRUFDVCxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBa0IvQixNQUFNLHFCQUNKLFVBQTJDLEVBQzNDLFVBQTJDO0lBRTNDLElBQU0sT0FBTyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQXhDLENBQXdDLENBQUM7SUFDOUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7S0FBRTtJQUMvQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztLQUFFO0lBQzdDLElBQU0sS0FBSyxHQUFHLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBOUQsQ0FBOEQsQ0FBQztJQUNsRixJQUFNLFdB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QUFDLENBQUMsQ0FBQztnQkFDRCxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0Q7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixPQUFPLEdBQUcsU0FBUyxDQUFDO2FBQ3JCO1lBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBoYXNWYWx1ZSwgaW5BcnJheSwgaXNBcnJheSwgaXNEZWZpbmVkLCBpc09iamVjdCwgaXNFbXB0eSwgaXNNYXAsIGlzU2V0LFxuICBpc1N0cmluZywgUGxhaW5PYmplY3Rcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYWRkQ2xhc3NlcywgY29weSwgZm9yRWFjaCwgZm9yRWFjaENvcHksIGhhc093biwgbWVyZ2VGaWx0ZXJlZE9iamVjdCxcbiAqIHVuaXF1ZUl0ZW1zLCBjb21tb25JdGVtcywgZml4VGl0bGUsIHRvVGl0bGVDYXNlXG4qL1xuXG4vKipcbiAqICdhZGRDbGFzc2VzJyBmdW5jdGlvblxuICpcbiAqIE1lcmdlcyB0d28gc3BhY2UtZGVsaW1pdGVkIGxpc3RzIG9mIENTUyBjbGFzc2VzIGFuZCByZW1vdmVzIGR1cGxpY2F0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+fSBvbGRDbGFzc2VzXG4gKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IG5ld0NsYXNzZXNcbiAqIEByZXR1cm4ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IC0gQ29tYmluZWQgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3NlcyhcbiAgb2xkQ2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPixcbiAgbmV3Q2xhc3Nlczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPlxuKTogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGJhZFR5cGUgPSBpID0+ICFpc1NldChpKSAmJiAhaXNBcnJheShpKSAmJiAhaXNTdHJpbmcoaSk7XG4gIGlmIChiYWRUeXBlKG5ld0NsYXNzZXMpKSB7IHJldHVybiBvbGRDbGFzc2VzOyB9XG4gIGlmIChiYWRUeXBlKG9sZENsYXNzZXMpKSB7IG9sZENsYXNzZXMgPSAnJzsgfVxuICBjb25zdCB0b1NldCA9IGkgPT4gaXNTZXQoaSkgPyBpIDogaXNBcnJheShpKSA/IG5ldyBTZXQoaSkgOiBuZXcgU2V0KGkuc3BsaXQoJyAnKSk7XG4gIGNvbnN0IGNvbWJpbmVkU2V0OiBTZXQ8YW55PiA9IHRvU2V0KG9sZENsYXNzZXMpO1xuICBjb25zdCBuZXdTZXQ6IFNldDxhbnk+ID0gdG9TZXQobmV3Q2xhc3Nlcyk7XG4gIG5ld1NldC5mb3JFYWNoKGMgPT4gY29tYmluZWRTZXQuYWRkKGMpKTtcbiAgaWYgKGlzU2V0KG9sZENsYXNzZXMpKSB7IHJldHVybiBjb21iaW5lZFNldDsgfVxuICBpZiAoaXNBcnJheShvbGRDbGFzc2VzKSkgeyByZXR1cm4gQXJyYXkuZnJvbShjb21iaW5lZFNldCk7IH1cbiAgcmV0dXJuIEFycmF5LmZyb20oY29tYmluZWRTZXQpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiAnY29weScgZnVuY3Rpb25cbiAqXG4gKiBNYWtlcyBhIHNoYWxsb3cgY29weSBvZiBhIEphdmFTY3JpcHQgb2JqZWN0LCBhcnJheSwgTWFwLCBvciBTZXQuXG4gKiBJZiBwYXNzZWQgYSBKYXZhU2NyaXB0IHByaW1pdGl2ZSB2YWx1ZSAoc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIG9yIG51bGwpLFxuICogaXQgcmV0dXJucyB0aGUgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl8c3RyaW5nfG51bWJlcnxib29sZWFufG51bGx9IG9iamVjdCAtIFRoZSBvYmplY3QgdG8gY29weVxuICogQHBhcmFtIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogQHJldHVybiB7T2JqZWN0fEFycmF5fHN0cmluZ3xudW1iZXJ8Ym9vbGVhbnxudWxsfSAtIFRoZSBjb3BpZWQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5KG9iamVjdDogYW55LCBlcnJvcnMgPSBmYWxzZSk6IGFueSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0JyB8fCBvYmplY3QgPT09IG51bGwpIHsgcmV0dXJuIG9iamVjdDsgfVxuICBpZiAoaXNNYXAob2JqZWN0KSkgICAgeyByZXR1cm4gbmV3IE1hcChvYmplY3QpOyB9XG4gIGlmIChpc1NldChvYmplY3QpKSAgICB7IHJldHVybiBuZXcgU2V0KG9iamVjdCk7IH1cbiAgaWYgKGlzQXJyYXkob2JqZWN0KSkgIHsgcmV0dXJuIFsgLi4ub2JqZWN0IF07ICAgfVxuICBpZiAoaXNPYmplY3Qob2JqZWN0KSkgeyByZXR1cm4geyAuLi5vYmplY3QgfTsgICB9XG4gIGlmIChlcnJvcnMpIHtcbiAgICBjb25zb2xlLmVycm9yKCdjb3B5IGVycm9yOiBPYmplY3QgdG8gY29weSBtdXN0IGJlIGEgSmF2YVNjcmlwdCBvYmplY3Qgb3IgdmFsdWUuJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLyoqXG4gKiAnZm9yRWFjaCcgZnVuY3Rpb25cbiAqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBpdGVtcyBpbiB0aGUgZmlyc3QgbGV2ZWwgb2YgYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBhbmQgY2FsbHMgYW4gaXRlcmF0b3IgZnVuY2l0b24gb24gZWFjaCBpdGVtLlxuICpcbiAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBmb3VyIHZhbHVlczpcbiAqIDEuIFRoZSBjdXJyZW50IGl0ZW0ncyB2YWx1ZVxuICogMi4gVGhlIGN1cnJlbnQgaXRlbSdzIGtleVxuICogMy4gVGhlIHBhcmVudCBvYmplY3QsIHdoaWNoIGNvbnRhaW5zIHRoZSBjdXJyZW50IGl0ZW1cbiAqIDQuIFRoZSByb290IG9iamVjdFxuICpcbiAqIFNldHRpbmcgdGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciB0byAndG9wLWRvd24nIG9yICdib3R0b20tdXAnIHdpbGwgY2F1c2VcbiAqIGl0IHRvIGFsc28gcmVjdXJzaXZlbHkgaXRlcmF0ZSBvdmVyIGl0ZW1zIGluIHN1Yi1vYmplY3RzIG9yIHN1Yi1hcnJheXMgaW4gdGhlXG4gKiBzcGVjaWZpZWQgZGlyZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmplY3QgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSB0aGUgaXRlcmF0b3IgZnVuY2l0b24gdG8gY2FsbCBvbiBlYWNoIGl0ZW1cbiAqIEBwYXJhbSB7Ym9vbGVhbiA9IGZhbHNlfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKFxuICBvYmplY3Q6IGFueSwgZm46ICh2OiBhbnksIGs/OiBzdHJpbmcgfCBudW1iZXIsIGM/OiBhbnksIHJjPzogYW55KSA9PiBhbnksXG4gIHJlY3Vyc2U6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZSwgcm9vdE9iamVjdDogYW55ID0gb2JqZWN0LCBlcnJvcnMgPSBmYWxzZVxuKTogdm9pZCB7XG4gIGlmIChpc0VtcHR5KG9iamVjdCkpIHsgcmV0dXJuOyB9XG4gIGlmICgoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpICYmIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdCkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICBpZiAocmVjdXJzZSA9PT0gJ2JvdHRvbS11cCcgJiYgKGlzT2JqZWN0KHZhbHVlKSB8fCBpc0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgZm9yRWFjaCh2YWx1ZSwgZm4sIHJlY3Vyc2UsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgICAgZm4odmFsdWUsIGtleSwgb2JqZWN0LCByb290T2JqZWN0KTtcbiAgICAgIGlmIChyZWN1cnNlID09PSAndG9wLWRvd24nICYmIChpc09iamVjdCh2YWx1ZSkgfHwgaXNBcnJheSh2YWx1ZSkpKSB7XG4gICAgICAgIGZvckVhY2godmFsdWUsIGZuLCByZWN1cnNlLCByb290T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2ggZXJyb3I6IEl0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Z1bmN0aW9uJywgZm4pO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iamVjdCkgJiYgIWlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaCBlcnJvcjogSW5wdXQgb2JqZWN0IG11c3QgYmUgYW4gb2JqZWN0IG9yIGFycmF5LicpO1xuICAgICAgY29uc29sZS5lcnJvcignb2JqZWN0Jywgb2JqZWN0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnZm9yRWFjaENvcHknIGZ1bmN0aW9uXG4gKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgaXRlbXMgaW4gdGhlIGZpcnN0IGxldmVsIG9mIGFuIG9iamVjdCBvciBhcnJheVxuICogYW5kIGNhbGxzIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIG9uIGVhY2ggaXRlbS4gUmV0dXJucyBhIG5ldyBvYmplY3Qgb3IgYXJyYXlcbiAqIHdpdGggdGhlIHNhbWUga2V5cyBvciBpbmRleGVzIGFzIHRoZSBvcmlnaW5hbCwgYW5kIHZhbHVlcyBzZXQgdG8gdGhlIHJlc3VsdHNcbiAqIG9mIHRoZSBpdGVyYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBEb2VzIE5PVCByZWN1cnNpdmVseSBpdGVyYXRlIG92ZXIgaXRlbXMgaW4gc3ViLW9iamVjdHMgb3Igc3ViLWFycmF5cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdCB8IEFycmF5fSBvYmplY3QgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBUaGUgaXRlcmF0b3IgZnVuY2l0b24gdG8gY2FsbCBvbiBlYWNoIGl0ZW1cbiAqIEBwYXJhbSB7Ym9vbGVhbiA9IGZhbHNlfSBlcnJvcnMgLSBTaG93IGVycm9ycz9cbiAqIEByZXR1cm4ge09iamVjdCB8IEFycmF5fSAtIFRoZSByZXN1bHRpbmcgb2JqZWN0IG9yIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoQ29weShcbiAgb2JqZWN0OiBhbnksIGZuOiAodjogYW55LCBrPzogc3RyaW5nIHwgbnVtYmVyLCBvPzogYW55LCBwPzogc3RyaW5nKSA9PiBhbnksXG4gIGVycm9ycyA9IGZhbHNlXG4pOiBhbnkge1xuICBpZiAoIWhhc1ZhbHVlKG9iamVjdCkpIHsgcmV0dXJuOyB9XG4gIGlmICgoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpICYmIHR5cGVvZiBvYmplY3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBuZXdPYmplY3Q6IGFueSA9IGlzQXJyYXkob2JqZWN0KSA/IFtdIDoge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KSkge1xuICAgICAgbmV3T2JqZWN0W2tleV0gPSBmbihvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG4gIGlmIChlcnJvcnMpIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoQ29weSBlcnJvcjogSXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgY29uc29sZS5lcnJvcignZnVuY3Rpb24nLCBmbik7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoQ29weSBlcnJvcjogSW5wdXQgb2JqZWN0IG11c3QgYmUgYW4gb2JqZWN0IG9yIGFycmF5LicpO1xuICAgICAgY29uc29sZS5lcnJvcignb2JqZWN0Jywgb2JqZWN0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnaGFzT3duJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IG9yIGFycmF5IGhhcyBhIHBhcnRpY3VsYXIgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHthbnl9IG9iamVjdCAtIHRoZSBvYmplY3QgdG8gY2hlY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSB0byBsb29rIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSB0cnVlIGlmIG9iamVjdCBoYXMgcHJvcGVydHksIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzT3duKG9iamVjdDogYW55LCBwcm9wZXJ0eTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghb2JqZWN0IHx8ICFbJ251bWJlcicsICdzdHJpbmcnLCAnc3ltYm9sJ10uaW5jbHVkZXModHlwZW9mIHByb3BlcnR5KSB8fFxuICAgICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpICYmICFpc01hcChvYmplY3QpICYmICFpc1NldChvYmplY3QpKVxuICApIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChpc01hcChvYmplY3QpIHx8IGlzU2V0KG9iamVjdCkpIHsgcmV0dXJuIG9iamVjdC5oYXMocHJvcGVydHkpOyB9XG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKGlzQXJyYXkob2JqZWN0KSkgeyByZXR1cm4gb2JqZWN0WzxudW1iZXI+cHJvcGVydHldOyB9XG4gICAgcHJvcGVydHkgPSBwcm9wZXJ0eSArICcnO1xuICB9XG4gIHJldHVybiBvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpO1xufVxuXG4vKipcbiAqICdtZXJnZUZpbHRlcmVkT2JqZWN0JyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogU2hhbGxvd2x5IG1lcmdlcyB0d28gb2JqZWN0cywgc2V0dGluZyBrZXkgYW5kIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RcbiAqIGluIHRhcmdldCBvYmplY3QsIGV4Y2x1ZGluZyBzcGVjaWZpZWQga2V5cy5cbiAqXG4gKiBPcHRpb25hbGx5LCBpdCBjYW4gYWxzbyB1c2UgZnVuY3Rpb25zIHRvIHRyYW5zZm9ybSB0aGUga2V5IG5hbWVzIGFuZC9vclxuICogdGhlIHZhbHVlcyBvZiB0aGUgbWVyZ2luZyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtQbGFpbk9iamVjdH0gdGFyZ2V0T2JqZWN0IC0gVGFyZ2V0IG9iamVjdCB0byBhZGQga2V5cyBhbmQgdmFsdWVzIHRvXG4gKiBAcGFyYW0ge1BsYWluT2JqZWN0fSBzb3VyY2VPYmplY3QgLSBTb3VyY2Ugb2JqZWN0IHRvIGNvcHkga2V5cyBhbmQgdmFsdWVzIGZyb21cbiAqIEBwYXJhbSB7c3RyaW5nW119IGV4Y2x1ZGVLZXlzIC0gQXJyYXkgb2Yga2V5cyB0byBleGNsdWRlXG4gKiBAcGFyYW0geyhzdHJpbmc6IHN0cmluZykgPT4gc3RyaW5nID0gKGspID0+IGt9IGtleUZuIC0gRnVuY3Rpb24gdG8gYXBwbHkgdG8ga2V5c1xuICogQHBhcmFtIHsoYW55OiBhbnkpID0+IGFueSA9ICh2KSA9PiB2fSB2YWx1ZUZuIC0gRnVuY3Rpb24gdG8gYXBwbHkgdG8gdmFsdWVzXG4gKiBAcmV0dXJuIHtQbGFpbk9iamVjdH0gLSBSZXR1cm5zIHRhcmdldE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VGaWx0ZXJlZE9iamVjdChcbiAgdGFyZ2V0T2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgc291cmNlT2JqZWN0OiBQbGFpbk9iamVjdCxcbiAgZXhjbHVkZUtleXMgPSA8c3RyaW5nW10+W10sXG4gIGtleUZuID0gKGtleTogc3RyaW5nKTogc3RyaW5nID0+IGtleSxcbiAgdmFsRm4gPSAodmFsOiBhbnkpOiBhbnkgPT4gdmFsXG4pOiBQbGFpbk9iamVjdCB7XG4gIGlmICghaXNPYmplY3Qoc291cmNlT2JqZWN0KSkgeyByZXR1cm4gdGFyZ2V0T2JqZWN0OyB9XG4gIGlmICghaXNPYmplY3QodGFyZ2V0T2JqZWN0KSkgeyB0YXJnZXRPYmplY3QgPSB7fTsgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2VPYmplY3QpKSB7XG4gICAgaWYgKCFpbkFycmF5KGtleSwgZXhjbHVkZUtleXMpICYmIGlzRGVmaW5lZChzb3VyY2VPYmplY3Rba2V5XSkpIHtcbiAgICAgIHRhcmdldE9iamVjdFtrZXlGbihrZXkpXSA9IHZhbEZuKHNvdXJjZU9iamVjdFtrZXldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldE9iamVjdDtcbn1cblxuLyoqXG4gKiAndW5pcXVlSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZyB2YWx1ZSBpbnB1dHMsXG4gKiBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhbGwgaW5wdXQgdmF1ZXMsIGV4Y2x1ZGluZyBkdXBsaWNhdGVzLlxuICpcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSAuLi5pdGVtcyAtXG4gKiBAcmV0dXJuIHtzdHJpbmdbXX0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlSXRlbXMoLi4uaXRlbXMpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJldHVybkl0ZW1zID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGlmICghcmV0dXJuSXRlbXMuaW5jbHVkZXMoaXRlbSkpIHsgcmV0dXJuSXRlbXMucHVzaChpdGVtKTsgfVxuICB9XG4gIHJldHVybiByZXR1cm5JdGVtcztcbn1cblxuLyoqXG4gKiAnY29tbW9uSXRlbXMnIGZ1bmN0aW9uXG4gKlxuICogQWNjZXB0cyBhbnkgbnVtYmVyIG9mIHN0cmluZ3Mgb3IgYXJyYXlzIG9mIHN0cmluZyB2YWx1ZXMsXG4gKiBhbmQgcmV0dXJucyBhIHNpbmdsZSBhcnJheSBjb250YWluaW5nIG9ubHkgdmFsdWVzIHByZXNlbnQgaW4gYWxsIGlucHV0cy5cbiAqXG4gKiBAcGFyYW0gey4uLnN0cmluZ3xzdHJpbmdbXX0gLi4uYXJyYXlzIC1cbiAqIEByZXR1cm4ge3N0cmluZ1tdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21tb25JdGVtcyguLi5hcnJheXMpOiBzdHJpbmdbXSB7XG4gIGxldCByZXR1cm5JdGVtcyA9IG51bGw7XG4gIGZvciAobGV0IGFycmF5IG9mIGFycmF5cykge1xuICAgIGlmIChpc1N0cmluZyhhcnJheSkpIHsgYXJyYXkgPSBbYXJyYXldOyB9XG4gICAgcmV0dXJuSXRlbXMgPSByZXR1cm5JdGVtcyA9PT0gbnVsbCA/IFsgLi4uYXJyYXkgXSA6XG4gICAgICByZXR1cm5JdGVtcy5maWx0ZXIoaXRlbSA9PiBhcnJheS5pbmNsdWRlcyhpdGVtKSk7XG4gICAgaWYgKCFyZXR1cm5JdGVtcy5sZW5ndGgpIHsgcmV0dXJuIFtdOyB9XG4gIH1cbiAgcmV0dXJuIHJldHVybkl0ZW1zO1xufVxuXG4vKipcbiAqICdmaXhUaXRsZScgZnVuY3Rpb25cbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IC1cbiAqIEByZXR1cm4ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gZml4VGl0bGUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUgJiYgdG9UaXRsZUNhc2UobmFtZS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS5yZXBsYWNlKC9fL2csICcgJykpO1xufVxuXG4vKipcbiAqICd0b1RpdGxlQ2FzZScgZnVuY3Rpb25cbiAqXG4gKiBJbnRlbGxpZ2VudGx5IGNvbnZlcnRzIGFuIGlucHV0IHN0cmluZyB0byBUaXRsZSBDYXNlLlxuICpcbiAqIEFjY2VwdHMgYW4gb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciB3aXRoIGEgbGlzdCBvZiBhZGRpdGlvbmFsXG4gKiB3b3JkcyBhbmQgYWJicmV2aWF0aW9ucyB0byBmb3JjZSBpbnRvIGEgcGFydGljdWxhciBjYXNlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgYnVpbHQgb24gcHJpb3Igd29yayBieSBKb2huIEdydWJlciBhbmQgRGF2aWQgR291Y2g6XG4gKiBodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0LzIwMDgvMDgvdGl0bGVfY2FzZV91cGRhdGVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb3VjaC90by10aXRsZS1jYXNlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IC1cbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBmb3JjZVdvcmRzPyAtXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvVGl0bGVDYXNlKGlucHV0OiBzdHJpbmcsIGZvcmNlV29yZHM/OiBzdHJpbmd8c3RyaW5nW10pOiBzdHJpbmcge1xuICBpZiAoIWlzU3RyaW5nKGlucHV0KSkgeyByZXR1cm4gaW5wdXQ7IH1cbiAgbGV0IGZvcmNlQXJyYXk6IHN0cmluZ1tdID0gWydhJywgJ2FuJywgJ2FuZCcsICdhcycsICdhdCcsICdidXQnLCAnYnknLCAnZW4nLFxuICAgJ2ZvcicsICdpZicsICdpbicsICdub3InLCAnb2YnLCAnb24nLCAnb3InLCAncGVyJywgJ3RoZScsICd0bycsICd2JywgJ3YuJyxcbiAgICd2cycsICd2cy4nLCAndmlhJ107XG4gIGlmIChpc1N0cmluZyhmb3JjZVdvcmRzKSkgeyBmb3JjZVdvcmRzID0gKDxzdHJpbmc+Zm9yY2VXb3Jkcykuc3BsaXQoJ3wnKTsgfVxuICBpZiAoaXNBcnJheShmb3JjZVdvcmRzKSkgeyBmb3JjZUFycmF5ID0gZm9yY2VBcnJheS5jb25jYXQoZm9yY2VXb3Jkcyk7IH1cbiAgY29uc3QgZm9yY2VBcnJheUxvd2VyOiBzdHJpbmdbXSA9IGZvcmNlQXJyYXkubWFwKHcgPT4gdy50b0xvd2VyQ2FzZSgpKTtcbiAgY29uc3Qgbm9Jbml0aWFsQ2FzZTogYm9vbGVhbiA9XG4gICAgaW5wdXQgPT09IGlucHV0LnRvVXBwZXJDYXNlKCkgfHwgaW5wdXQgPT09IGlucHV0LnRvTG93ZXJDYXNlKCk7XG4gIGxldCBwcmV2TGFzdENoYXIgPSAnJztcbiAgaW5wdXQgPSBpbnB1dC50cmltKCk7XG4gIHJldHVybiBpbnB1dC5yZXBsYWNlKC9bQS1aYS16MC05XFx1MDBDMC1cXHUwMEZGXStbXlxccy1dKi9nLCAod29yZCwgaWR4KSA9PiB7XG4gICAgaWYgKCFub0luaXRpYWxDYXNlICYmIHdvcmQuc2xpY2UoMSkuc2VhcmNoKC9bQS1aXXxcXC4uLykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gd29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld1dvcmQ6IHN0cmluZztcbiAgICAgIGNvbnN0IGZvcmNlV29yZDogc3RyaW5nID1cbiAgICAgICAgZm9yY2VBcnJheVtmb3JjZUFycmF5TG93ZXIuaW5kZXhPZih3b3JkLnRvTG93ZXJDYXNlKCkpXTtcbiAgICAgIGlmICghZm9yY2VXb3JkKSB7XG4gICAgICAgIGlmIChub0luaXRpYWxDYXNlKSB7XG4gICAgICAgICAgaWYgKHdvcmQuc2xpY2UoMSkuc2VhcmNoKC9cXC4uLykgIT09IC0xKSB7XG4gICAgICAgICAgICBuZXdXb3JkID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdXb3JkID0gd29yZFswXS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdXb3JkID0gd29yZFswXS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgZm9yY2VXb3JkID09PSBmb3JjZVdvcmQudG9Mb3dlckNhc2UoKSAmJiAoXG4gICAgICAgICAgaWR4ID09PSAwIHx8IGlkeCArIHdvcmQubGVuZ3RoID09PSBpbnB1dC5sZW5ndGggfHxcbiAgICAgICAgICBwcmV2TGFzdENoYXIgPT09ICc6JyB8fCBpbnB1dFtpZHggLSAxXS5zZWFyY2goL1teXFxzLV0vKSAhPT0gLTEgfHxcbiAgICAgICAgICAoaW5wdXRbaWR4IC0gMV0gIT09ICctJyAmJiBpbnB1dFtpZHggKyB3b3JkLmxlbmd0aF0gPT09ICctJylcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIG5ld1dvcmQgPSBmb3JjZVdvcmRbMF0udG9VcHBlckNhc2UoKSArIGZvcmNlV29yZC5zbGljZSgxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1dvcmQgPSBmb3JjZVdvcmQ7XG4gICAgICB9XG4gICAgICBwcmV2TGFzdENoYXIgPSB3b3JkLnNsaWNlKC0xKTtcbiAgICAgIHJldHVybiBuZXdXb3JkO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=