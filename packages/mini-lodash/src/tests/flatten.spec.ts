import flatten from "../flatten";

describe('flatten', () => {
    it('happy path', () => {
        const res1 = flatten([1, [2, [3, [4]], 5]]);
        expect(res1).toEqual([1, 2, [3, [4]], 5])
    })
})
