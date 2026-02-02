import slice from "../slice";

describe('slice', () => {
    it('happy path', () => {
        const res1 = slice([1, 2, 3, 4], 2);
        expect(res1).toEqual([3, 4])
    })
})