import arrayIncludesWith from '../.internal/arrayIncludesWith'
import arrayIncludes from '../.internal/arrayIncludes'
/**
 * The base implementation of methods like `difference` without support
 * for excluding multiple arrays.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */

function baseDifference(array, values, iteratee?, comparator?) {

    let includes: any = arrayIncludes
    let isCommon = true
    const result: any[] = []
    const valuesLength = values.length

    if (!array.length) {
        return result
    }

    if (iteratee) {
        values = values.map((value: any) => iteratee(value))
    }
    if (comparator) {
        includes = arrayIncludesWith
        isCommon = false
    }
    // TODO：SetCache 优化
    outer:
    for (let value of array) {
        const computed = iteratee == null ? value : iteratee(value)

        value = (comparator || value !== 0) ? value : 0
        if (isCommon && !isNaN(computed)) {
            let valuesIndex = valuesLength
            while (valuesIndex--) {
                if (values[valuesIndex] === computed) {
                    continue outer
                }
            }
            result.push(value)
        } else if (!includes(values, computed, comparator)) {
            result.push(value)
        }
    }
    return result
}
export default baseDifference