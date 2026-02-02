import differenceBy from "../differenceBy";

describe('differenceBy', () => {
    it('happy path', () => {
        const res = differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)
        expect(res).toEqual([1.2])
    })
})