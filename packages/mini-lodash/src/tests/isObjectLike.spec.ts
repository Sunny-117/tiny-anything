import isObjectLike from "../isObjectLike";


describe('difference', () => {
    it('isObjectLike', () => {
        const res1 = isObjectLike({});
        expect(res1).toEqual(true)

        const res2 = isObjectLike([1, 2, 3]);
        expect(res2).toEqual(true)

        const res3 = isObjectLike(Math.round);
        expect(res3).toEqual(false)

        const res4 = isObjectLike(null);
        expect(res4).toEqual(false)

    })
})