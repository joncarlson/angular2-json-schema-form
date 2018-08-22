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
    const badType = i => !isSet(i) && !isArray(i) && !isString(i);
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    const toSet = i => isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' '));
    const combinedSet = toSet(oldClasses);
    const newSet = toSet(newClasses);
    newSet.forEach(c => combinedSet.add(c));
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
export function copy(object, errors = false) {
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
        return [...object];
    }
    if (isObject(object)) {
        return Object.assign({}, object);
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
export function forEach(object, fn, recurse = false, rootObject = object, errors = false) {
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        for (const key of Object.keys(object)) {
            const value = object[key];
            if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
            fn(value, key, object, rootObject);
            if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
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
export function forEachCopy(object, fn, errors = false) {
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        const newObject = isArray(object) ? [] : {};
        for (const key of Object.keys(object)) {
            newObject[key] = fn(object[key], key, object);
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
export function mergeFilteredObject(targetObject, sourceObject, excludeKeys = [], keyFn = (key) => key, valFn = (val) => val) {
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    for (const key of Object.keys(sourceObject)) {
        if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
            targetObject[keyFn(key)] = valFn(sourceObject[key]);
        }
    }
    return targetObject;
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
export function uniqueItems(...items) {
    const returnItems = [];
    for (const item of items) {
        if (!returnItems.includes(item)) {
            returnItems.push(item);
        }
    }
    return returnItems;
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
export function commonItems(...arrays) {
    let returnItems = null;
    for (let array of arrays) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? [...array] :
            returnItems.filter(item => array.includes(item));
        if (!returnItems.length) {
            return [];
        }
    }
    return returnItems;
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
    let forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = forceWords.split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    const forceArrayLower = forceArray.map(w => w.toLowerCase());
    const noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    let prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, idx) => {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            let newWord;
            const forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uLXNjaGVtYS1mb3JtLyIsInNvdXJjZXMiOlsic3JjL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFDdEUsUUFBUSxFQUNULE1BQU0sdUJBQXVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQi9CLE1BQU0scUJBQ0osVUFBMkMsRUFDM0MsVUFBMkM7SUFFM0MsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztLQUFFO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0tBQUU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLE1BQU0sV0FBVyxHQUFhLEtBQUssQ0FBQyxVQUFVLENB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LENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztxQkFDL0Q7aUJBQ0Y7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDthQUNGO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNSLFNBQVMsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FDdkMsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTTtnQkFDL0MsWUFBWSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlELENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBRWhFLENBQUMsQ0FBQyxDQUFDO2dCQUNELE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzRDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDckI7WUFDRCxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDaEI7S0FDRixDQUFDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGhhc1ZhbHVlLCBpbkFycmF5LCBpc0FycmF5LCBpc0RlZmluZWQsIGlzT2JqZWN0LCBpc0VtcHR5LCBpc01hcCwgaXNTZXQsXG4gIGlzU3RyaW5nLCBQbGFpbk9iamVjdFxufSBmcm9tICcuL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gbGlicmFyeTpcbiAqXG4gKiBhZGRDbGFzc2VzLCBjb3B5LCBmb3JFYWNoLCBmb3JFYWNoQ29weSwgaGFzT3duLCBtZXJnZUZpbHRlcmVkT2JqZWN0LFxuICogdW5pcXVlSXRlbXMsIGNvbW1vbkl0ZW1zLCBmaXhUaXRsZSwgdG9UaXRsZUNhc2VcbiovXG5cbi8qKlxuICogJ2FkZENsYXNzZXMnIGZ1bmN0aW9uXG4gKlxuICogTWVyZ2VzIHR3byBzcGFjZS1kZWxpbWl0ZWQgbGlzdHMgb2YgQ1NTIGNsYXNzZXMgYW5kIHJlbW92ZXMgZHVwbGljYXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IG9sZENsYXNzZXNcbiAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPn0gbmV3Q2xhc3Nlc1xuICogQHJldHVybiB7c3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPn0gLSBDb21iaW5lZCBjbGFzc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRDbGFzc2VzKFxuICBvbGRDbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+LFxuICBuZXdDbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+XG4pOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgYmFkVHlwZSA9IGkgPT4gIWlzU2V0KGkpICYmICFpc0FycmF5KGkpICYmICFpc1N0cmluZyhpKTtcbiAgaWYgKGJhZFR5cGUobmV3Q2xhc3NlcykpIHsgcmV0dXJuIG9sZENsYXNzZXM7IH1cbiAgaWYgKGJhZFR5cGUob2xkQ2xhc3NlcykpIHsgb2xkQ2xhc3NlcyA9ICcnOyB9XG4gIGNvbnN0IHRvU2V0ID0gaSA9PiBpc1NldChpKSA/IGkgOiBpc0FycmF5KGkpID8gbmV3IFNldChpKSA6IG5ldyBTZXQoaS5zcGxpdCgnICcpKTtcbiAgY29uc3QgY29tYmluZWRTZXQ6IFNldDxhbnk+ID0gdG9TZXQob2xkQ2xhc3Nlcyk7XG4gIGNvbnN0IG5ld1NldDogU2V0PGFueT4gPSB0b1NldChuZXdDbGFzc2VzKTtcbiAgbmV3U2V0LmZvckVhY2goYyA9PiBjb21iaW5lZFNldC5hZGQoYykpO1xuICBpZiAoaXNTZXQob2xkQ2xhc3NlcykpIHsgcmV0dXJuIGNvbWJpbmVkU2V0OyB9XG4gIGlmIChpc0FycmF5KG9sZENsYXNzZXMpKSB7IHJldHVybiBBcnJheS5mcm9tKGNvbWJpbmVkU2V0KTsgfVxuICByZXR1cm4gQXJyYXkuZnJvbShjb21iaW5lZFNldCkuam9pbignICcpO1xufVxuXG4vKipcbiAqICdjb3B5JyBmdW5jdGlvblxuICpcbiAqIE1ha2VzIGEgc2hhbGxvdyBjb3B5IG9mIGEgSmF2YVNjcmlwdCBvYmplY3QsIGFycmF5LCBNYXAsIG9yIFNldC5cbiAqIElmIHBhc3NlZCBhIEphdmFTY3JpcHQgcHJpbWl0aXZlIHZhbHVlIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgb3IgbnVsbCksXG4gKiBpdCByZXR1cm5zIHRoZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheXxzdHJpbmd8bnVtYmVyfGJvb2xlYW58bnVsbH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjb3B5XG4gKiBAcGFyYW0ge2Jvb2xlYW4gPSBmYWxzZX0gZXJyb3JzIC0gU2hvdyBlcnJvcnM/XG4gKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl8c3RyaW5nfG51bWJlcnxib29sZWFufG51bGx9IC0gVGhlIGNvcGllZCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHkob2JqZWN0OiBhbnksIGVycm9ycyA9IGZhbHNlKTogYW55IHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8IG9iamVjdCA9PT0gbnVsbCkgeyByZXR1cm4gb2JqZWN0OyB9XG4gIGlmIChpc01hcChvYmplY3QpKSAgICB7IHJldHVybiBuZXcgTWFwKG9iamVjdCk7IH1cbiAgaWYgKGlzU2V0KG9iamVjdCkpICAgIHsgcmV0dXJuIG5ldyBTZXQob2JqZWN0KTsgfVxuICBpZiAoaXNBcnJheShvYmplY3QpKSAgeyByZXR1cm4gWyAuLi5vYmplY3QgXTsgICB9XG4gIGlmIChpc09iamVjdChvYmplY3QpKSB7IHJldHVybiB7IC4uLm9iamVjdCB9OyAgIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2NvcHkgZXJyb3I6IE9iamVjdCB0byBjb3B5IG11c3QgYmUgYSBKYXZhU2NyaXB0IG9iamVjdCBvciB2YWx1ZS4nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqICdmb3JFYWNoJyBmdW5jdGlvblxuICpcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGl0ZW1zIGluIHRoZSBmaXJzdCBsZXZlbCBvZiBhbiBvYmplY3Qgb3IgYXJyYXlcbiAqIGFuZCBjYWxscyBhbiBpdGVyYXRvciBmdW5jaXRvbiBvbiBlYWNoIGl0ZW0uXG4gKlxuICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGZvdXIgdmFsdWVzOlxuICogMS4gVGhlIGN1cnJlbnQgaXRlbSdzIHZhbHVlXG4gKiAyLiBUaGUgY3VycmVudCBpdGVtJ3Mga2V5XG4gKiAzLiBUaGUgcGFyZW50IG9iamVjdCwgd2hpY2ggY29udGFpbnMgdGhlIGN1cnJlbnQgaXRlbVxuICogNC4gVGhlIHJvb3Qgb2JqZWN0XG4gKlxuICogU2V0dGluZyB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIHRvICd0b3AtZG93bicgb3IgJ2JvdHRvbS11cCcgd2lsbCBjYXVzZVxuICogaXQgdG8gYWxzbyByZWN1cnNpdmVseSBpdGVyYXRlIG92ZXIgaXRlbXMgaW4gc3ViLW9iamVjdHMgb3Igc3ViLWFycmF5cyBpbiB0aGVcbiAqIHNwZWNpZmllZCBkaXJlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iamVjdCAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIHRoZSBpdGVyYXRvciBmdW5jaXRvbiB0byBjYWxsIG9uIGVhY2ggaXRlbVxuICogQHBhcmFtIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2goXG4gIG9iamVjdDogYW55LCBmbjogKHY6IGFueSwgaz86IHN0cmluZyB8IG51bWJlciwgYz86IGFueSwgcmM/OiBhbnkpID0+IGFueSxcbiAgcmVjdXJzZTogYm9vbGVhbiB8IHN0cmluZyA9IGZhbHNlLCByb290T2JqZWN0OiBhbnkgPSBvYmplY3QsIGVycm9ycyA9IGZhbHNlXG4pOiB2b2lkIHtcbiAgaWYgKGlzRW1wdHkob2JqZWN0KSkgeyByZXR1cm47IH1cbiAgaWYgKChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkgJiYgdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgIGlmIChyZWN1cnNlID09PSAnYm90dG9tLXVwJyAmJiAoaXNPYmplY3QodmFsdWUpIHx8IGlzQXJyYXkodmFsdWUpKSkge1xuICAgICAgICBmb3JFYWNoKHZhbHVlLCBmbiwgcmVjdXJzZSwgcm9vdE9iamVjdCk7XG4gICAgICB9XG4gICAgICBmbih2YWx1ZSwga2V5LCBvYmplY3QsIHJvb3RPYmplY3QpO1xuICAgICAgaWYgKHJlY3Vyc2UgPT09ICd0b3AtZG93bicgJiYgKGlzT2JqZWN0KHZhbHVlKSB8fCBpc0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgZm9yRWFjaCh2YWx1ZSwgZm4sIHJlY3Vyc2UsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JzKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaCBlcnJvcjogSXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgY29uc29sZS5lcnJvcignZnVuY3Rpb24nLCBmbik7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoIGVycm9yOiBJbnB1dCBvYmplY3QgbXVzdCBiZSBhbiBvYmplY3Qgb3IgYXJyYXkuJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdvYmplY3QnLCBvYmplY3QpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdmb3JFYWNoQ29weScgZnVuY3Rpb25cbiAqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBpdGVtcyBpbiB0aGUgZmlyc3QgbGV2ZWwgb2YgYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBhbmQgY2FsbHMgYW4gaXRlcmF0b3IgZnVuY3Rpb24gb24gZWFjaCBpdGVtLiBSZXR1cm5zIGEgbmV3IG9iamVjdCBvciBhcnJheVxuICogd2l0aCB0aGUgc2FtZSBrZXlzIG9yIGluZGV4ZXMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgdmFsdWVzIHNldCB0byB0aGUgcmVzdWx0c1xuICogb2YgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIERvZXMgTk9UIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgb3ZlciBpdGVtcyBpbiBzdWItb2JqZWN0cyBvciBzdWItYXJyYXlzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0IHwgQXJyYXl9IG9iamVjdCAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIFRoZSBpdGVyYXRvciBmdW5jaXRvbiB0byBjYWxsIG9uIGVhY2ggaXRlbVxuICogQHBhcmFtIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogQHJldHVybiB7T2JqZWN0IHwgQXJyYXl9IC0gVGhlIHJlc3VsdGluZyBvYmplY3Qgb3IgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hDb3B5KFxuICBvYmplY3Q6IGFueSwgZm46ICh2OiBhbnksIGs/OiBzdHJpbmcgfCBudW1iZXIsIG8/OiBhbnksIHA/OiBzdHJpbmcpID0+IGFueSxcbiAgZXJyb3JzID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmICghaGFzVmFsdWUob2JqZWN0KSkgeyByZXR1cm47IH1cbiAgaWYgKChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IG5ld09iamVjdDogYW55ID0gaXNBcnJheShvYmplY3QpID8gW10gOiB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XG4gICAgICBuZXdPYmplY3Rba2V5XSA9IGZuKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbiAgaWYgKGVycm9ycykge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2hDb3B5IGVycm9yOiBJdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdmdW5jdGlvbicsIGZuKTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmplY3QpICYmICFpc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZvckVhY2hDb3B5IGVycm9yOiBJbnB1dCBvYmplY3QgbXVzdCBiZSBhbiBvYmplY3Qgb3IgYXJyYXkuJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdvYmplY3QnLCBvYmplY3QpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdoYXNPd24nIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3Qgb3IgYXJyYXkgaGFzIGEgcGFydGljdWxhciBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gb2JqZWN0IC0gdGhlIG9iamVjdCB0byBjaGVja1xuICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIGxvb2sgZm9yXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIHRydWUgaWYgb2JqZWN0IGhhcyBwcm9wZXJ0eSwgZmFsc2UgaWYgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNPd24ob2JqZWN0OiBhbnksIHByb3BlcnR5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFvYmplY3QgfHwgIVsnbnVtYmVyJywgJ3N0cmluZycsICdzeW1ib2wnXS5pbmNsdWRlcyh0eXBlb2YgcHJvcGVydHkpIHx8XG4gICAgKCFpc09iamVjdChvYmplY3QpICYmICFpc0FycmF5KG9iamVjdCkgJiYgIWlzTWFwKG9iamVjdCkgJiYgIWlzU2V0KG9iamVjdCkpXG4gICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGlzTWFwKG9iamVjdCkgfHwgaXNTZXQob2JqZWN0KSkgeyByZXR1cm4gb2JqZWN0Lmhhcyhwcm9wZXJ0eSk7IH1cbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAoaXNBcnJheShvYmplY3QpKSB7IHJldHVybiBvYmplY3RbPG51bWJlcj5wcm9wZXJ0eV07IH1cbiAgICBwcm9wZXJ0eSA9IHByb3BlcnR5ICsgJyc7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSk7XG59XG5cbi8qKlxuICogJ21lcmdlRmlsdGVyZWRPYmplY3QnIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBTaGFsbG93bHkgbWVyZ2VzIHR3byBvYmplY3RzLCBzZXR0aW5nIGtleSBhbmQgdmFsdWVzIGZyb20gc291cmNlIG9iamVjdFxuICogaW4gdGFyZ2V0IG9iamVjdCwgZXhjbHVkaW5nIHNwZWNpZmllZCBrZXlzLlxuICpcbiAqIE9wdGlvbmFsbHksIGl0IGNhbiBhbHNvIHVzZSBmdW5jdGlvbnMgdG8gdHJhbnNmb3JtIHRoZSBrZXkgbmFtZXMgYW5kL29yXG4gKiB0aGUgdmFsdWVzIG9mIHRoZSBtZXJnaW5nIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1BsYWluT2JqZWN0fSB0YXJnZXRPYmplY3QgLSBUYXJnZXQgb2JqZWN0IHRvIGFkZCBrZXlzIGFuZCB2YWx1ZXMgdG9cbiAqIEBwYXJhbSB7UGxhaW5PYmplY3R9IHNvdXJjZU9iamVjdCAtIFNvdXJjZSBvYmplY3QgdG8gY29weSBrZXlzIGFuZCB2YWx1ZXMgZnJvbVxuICogQHBhcmFtIHtzdHJpbmdbXX0gZXhjbHVkZUtleXMgLSBBcnJheSBvZiBrZXlzIHRvIGV4Y2x1ZGVcbiAqIEBwYXJhbSB7KHN0cmluZzogc3RyaW5nKSA9PiBzdHJpbmcgPSAoaykgPT4ga30ga2V5Rm4gLSBGdW5jdGlvbiB0byBhcHBseSB0byBrZXlzXG4gKiBAcGFyYW0geyhhbnk6IGFueSkgPT4gYW55ID0gKHYpID0+IHZ9IHZhbHVlRm4gLSBGdW5jdGlvbiB0byBhcHBseSB0byB2YWx1ZXNcbiAqIEByZXR1cm4ge1BsYWluT2JqZWN0fSAtIFJldHVybnMgdGFyZ2V0T2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUZpbHRlcmVkT2JqZWN0KFxuICB0YXJnZXRPYmplY3Q6IFBsYWluT2JqZWN0LFxuICBzb3VyY2VPYmplY3Q6IFBsYWluT2JqZWN0LFxuICBleGNsdWRlS2V5cyA9IDxzdHJpbmdbXT5bXSxcbiAga2V5Rm4gPSAoa2V5OiBzdHJpbmcpOiBzdHJpbmcgPT4ga2V5LFxuICB2YWxGbiA9ICh2YWw6IGFueSk6IGFueSA9PiB2YWxcbik6IFBsYWluT2JqZWN0IHtcbiAgaWYgKCFpc09iamVjdChzb3VyY2VPYmplY3QpKSB7IHJldHVybiB0YXJnZXRPYmplY3Q7IH1cbiAgaWYgKCFpc09iamVjdCh0YXJnZXRPYmplY3QpKSB7IHRhcmdldE9iamVjdCA9IHt9OyB9XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNvdXJjZU9iamVjdCkpIHtcbiAgICBpZiAoIWluQXJyYXkoa2V5LCBleGNsdWRlS2V5cykgJiYgaXNEZWZpbmVkKHNvdXJjZU9iamVjdFtrZXldKSkge1xuICAgICAgdGFyZ2V0T2JqZWN0W2tleUZuKGtleSldID0gdmFsRm4oc291cmNlT2JqZWN0W2tleV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0T2JqZWN0O1xufVxuXG4vKipcbiAqICd1bmlxdWVJdGVtcycgZnVuY3Rpb25cbiAqXG4gKiBBY2NlcHRzIGFueSBudW1iZXIgb2Ygc3RyaW5nIHZhbHVlIGlucHV0cyxcbiAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBpbnB1dCB2YXVlcywgZXhjbHVkaW5nIGR1cGxpY2F0ZXMuXG4gKlxuICogQHBhcmFtIHsuLi5zdHJpbmd9IC4uLml0ZW1zIC1cbiAqIEByZXR1cm4ge3N0cmluZ1tdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVJdGVtcyguLi5pdGVtcyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0dXJuSXRlbXMgPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgaWYgKCFyZXR1cm5JdGVtcy5pbmNsdWRlcyhpdGVtKSkgeyByZXR1cm5JdGVtcy5wdXNoKGl0ZW0pOyB9XG4gIH1cbiAgcmV0dXJuIHJldHVybkl0ZW1zO1xufVxuXG4vKipcbiAqICdjb21tb25JdGVtcycgZnVuY3Rpb25cbiAqXG4gKiBBY2NlcHRzIGFueSBudW1iZXIgb2Ygc3RyaW5ncyBvciBhcnJheXMgb2Ygc3RyaW5nIHZhbHVlcyxcbiAqIGFuZCByZXR1cm5zIGEgc2luZ2xlIGFycmF5IGNvbnRhaW5pbmcgb25seSB2YWx1ZXMgcHJlc2VudCBpbiBhbGwgaW5wdXRzLlxuICpcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfHN0cmluZ1tdfSAuLi5hcnJheXMgLVxuICogQHJldHVybiB7c3RyaW5nW119IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbW1vbkl0ZW1zKC4uLmFycmF5cyk6IHN0cmluZ1tdIHtcbiAgbGV0IHJldHVybkl0ZW1zID0gbnVsbDtcbiAgZm9yIChsZXQgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgaWYgKGlzU3RyaW5nKGFycmF5KSkgeyBhcnJheSA9IFthcnJheV07IH1cbiAgICByZXR1cm5JdGVtcyA9IHJldHVybkl0ZW1zID09PSBudWxsID8gWyAuLi5hcnJheSBdIDpcbiAgICAgIHJldHVybkl0ZW1zLmZpbHRlcihpdGVtID0+IGFycmF5LmluY2x1ZGVzKGl0ZW0pKTtcbiAgICBpZiAoIXJldHVybkl0ZW1zLmxlbmd0aCkgeyByZXR1cm4gW107IH1cbiAgfVxuICByZXR1cm4gcmV0dXJuSXRlbXM7XG59XG5cbi8qKlxuICogJ2ZpeFRpdGxlJyBmdW5jdGlvblxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgLVxuICogQHJldHVybiB7c3RyaW5nfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXhUaXRsZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSAmJiB0b1RpdGxlQ2FzZShuYW1lLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnJlcGxhY2UoL18vZywgJyAnKSk7XG59XG5cbi8qKlxuICogJ3RvVGl0bGVDYXNlJyBmdW5jdGlvblxuICpcbiAqIEludGVsbGlnZW50bHkgY29udmVydHMgYW4gaW5wdXQgc3RyaW5nIHRvIFRpdGxlIENhc2UuXG4gKlxuICogQWNjZXB0cyBhbiBvcHRpb25hbCBzZWNvbmQgcGFyYW1ldGVyIHdpdGggYSBsaXN0IG9mIGFkZGl0aW9uYWxcbiAqIHdvcmRzIGFuZCBhYmJyZXZpYXRpb25zIHRvIGZvcmNlIGludG8gYSBwYXJ0aWN1bGFyIGNhc2UuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBidWlsdCBvbiBwcmlvciB3b3JrIGJ5IEpvaG4gR3J1YmVyIGFuZCBEYXZpZCBHb3VjaDpcbiAqIGh0dHA6Ly9kYXJpbmdmaXJlYmFsbC5uZXQvMjAwOC8wOC90aXRsZV9jYXNlX3VwZGF0ZVxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvdWNoL3RvLXRpdGxlLWNhc2VcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgLVxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGZvcmNlV29yZHM/IC1cbiAqIEByZXR1cm4ge3N0cmluZ30gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9UaXRsZUNhc2UoaW5wdXQ6IHN0cmluZywgZm9yY2VXb3Jkcz86IHN0cmluZ3xzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGlmICghaXNTdHJpbmcoaW5wdXQpKSB7IHJldHVybiBpbnB1dDsgfVxuICBsZXQgZm9yY2VBcnJheTogc3RyaW5nW10gPSBbJ2EnLCAnYW4nLCAnYW5kJywgJ2FzJywgJ2F0JywgJ2J1dCcsICdieScsICdlbicsXG4gICAnZm9yJywgJ2lmJywgJ2luJywgJ25vcicsICdvZicsICdvbicsICdvcicsICdwZXInLCAndGhlJywgJ3RvJywgJ3YnLCAndi4nLFxuICAgJ3ZzJywgJ3ZzLicsICd2aWEnXTtcbiAgaWYgKGlzU3RyaW5nKGZvcmNlV29yZHMpKSB7IGZvcmNlV29yZHMgPSAoPHN0cmluZz5mb3JjZVdvcmRzKS5zcGxpdCgnfCcpOyB9XG4gIGlmIChpc0FycmF5KGZvcmNlV29yZHMpKSB7IGZvcmNlQXJyYXkgPSBmb3JjZUFycmF5LmNvbmNhdChmb3JjZVdvcmRzKTsgfVxuICBjb25zdCBmb3JjZUFycmF5TG93ZXI6IHN0cmluZ1tdID0gZm9yY2VBcnJheS5tYXAodyA9PiB3LnRvTG93ZXJDYXNlKCkpO1xuICBjb25zdCBub0luaXRpYWxDYXNlOiBib29sZWFuID1cbiAgICBpbnB1dCA9PT0gaW5wdXQudG9VcHBlckNhc2UoKSB8fCBpbnB1dCA9PT0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgbGV0IHByZXZMYXN0Q2hhciA9ICcnO1xuICBpbnB1dCA9IGlucHV0LnRyaW0oKTtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1tBLVphLXowLTlcXHUwMEMwLVxcdTAwRkZdK1teXFxzLV0qL2csICh3b3JkLCBpZHgpID0+IHtcbiAgICBpZiAoIW5vSW5pdGlhbENhc2UgJiYgd29yZC5zbGljZSgxKS5zZWFyY2goL1tBLVpdfFxcLi4vKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3V29yZDogc3RyaW5nO1xuICAgICAgY29uc3QgZm9yY2VXb3JkOiBzdHJpbmcgPVxuICAgICAgICBmb3JjZUFycmF5W2ZvcmNlQXJyYXlMb3dlci5pbmRleE9mKHdvcmQudG9Mb3dlckNhc2UoKSldO1xuICAgICAgaWYgKCFmb3JjZVdvcmQpIHtcbiAgICAgICAgaWYgKG5vSW5pdGlhbENhc2UpIHtcbiAgICAgICAgICBpZiAod29yZC5zbGljZSgxKS5zZWFyY2goL1xcLi4vKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1dvcmQgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBmb3JjZVdvcmQgPT09IGZvcmNlV29yZC50b0xvd2VyQ2FzZSgpICYmIChcbiAgICAgICAgICBpZHggPT09IDAgfHwgaWR4ICsgd29yZC5sZW5ndGggPT09IGlucHV0Lmxlbmd0aCB8fFxuICAgICAgICAgIHByZXZMYXN0Q2hhciA9PT0gJzonIHx8IGlucHV0W2lkeCAtIDFdLnNlYXJjaCgvW15cXHMtXS8pICE9PSAtMSB8fFxuICAgICAgICAgIChpbnB1dFtpZHggLSAxXSAhPT0gJy0nICYmIGlucHV0W2lkeCArIHdvcmQubGVuZ3RoXSA9PT0gJy0nKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZFswXS50b1VwcGVyQ2FzZSgpICsgZm9yY2VXb3JkLnNsaWNlKDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3V29yZCA9IGZvcmNlV29yZDtcbiAgICAgIH1cbiAgICAgIHByZXZMYXN0Q2hhciA9IHdvcmQuc2xpY2UoLTEpO1xuICAgICAgcmV0dXJuIG5ld1dvcmQ7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==