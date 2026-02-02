/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

function arrayIncludesWith(array: any[], target: any, comparator: (target, value) => boolean) {
    if (array == null) {
        return false
    }
    for (const value of array) {
        if (comparator(target, value)) {
            return true
        }
    }
    return false
}

export default arrayIncludesWith
