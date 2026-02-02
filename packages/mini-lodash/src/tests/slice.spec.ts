import drop from "../drop";

describe('drop', () => {
    it('happy path', () => {
        const res1 = drop([1, 2, 3]);
        expect(res1).toEqual([2, 3])

        const res2 = drop([1, 2, 3], 2);
        expect(res2).toEqual([3])

        const res3 = drop([1, 2, 3], 5);
        expect(res3).toEqual([])

        const res4 = drop([1, 2, 3], 0);
        expect(res4).toEqual([1, 2, 3])
    })
})
