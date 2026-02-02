import isArrayLikeObject from "../isArrayLikeObject"


describe('isArrayLikeObject', () => {
    it('happy path', () => {
        const res1 = isArrayLikeObject([1, 2, 3]);
        expect(res1).toEqual(true)

        const res2 = isArrayLikeObject('abc');
        expect(res2).toEqual(false)

        const res3 = isArrayLikeObject(Math.random);
        expect(res3).toEqual(false)
    })
})