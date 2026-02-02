import flattenDeep from "../flattenDeep";
import flattenDepth from "../flattenDepth";

describe('flattenDepth', () => {
    it('happy path', () => {
        const res1 = flattenDepth([1, [2, [3, [4]], 5]], 2);
        expect(res1).toEqual([1, 2, 3, [4], 5])
    })
})
