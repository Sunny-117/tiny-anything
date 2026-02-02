import isArrayLike from "../isArrayLike"


// 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。

describe('isArrayLike', () => {
    it('happy path', () => {

        const res1 = isArrayLike([1, 2, 3]);
        expect(res1).toEqual(true)

        const res2 = isArrayLike('abc');
        expect(res2).toEqual(true)

        const res3 = isArrayLike(Math.random);
        expect(res3).toEqual(false)

    })
})