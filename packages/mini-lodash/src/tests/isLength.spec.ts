import isLength from "../isLength"

describe('difference', () => {
    it('isLength', () => {
        const res1 = isLength(3)
        expect(res1).toEqual(true)

        const res2 = isLength(Number.MIN_VALUE);
        expect(res2).toEqual(false)

        const res3 = isLength('3');
        expect(res3).toEqual(false)
    })
})