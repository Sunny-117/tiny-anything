import flattenDeep from "../flattenDeep";

describe('flattenDeep', () => {
    it('happy path', () => {
        const res1 = flattenDeep([1, [2, [3, [4]], 5]]);
        expect(res1).toEqual([1, 2, 3, 4, 5])
    })
})
