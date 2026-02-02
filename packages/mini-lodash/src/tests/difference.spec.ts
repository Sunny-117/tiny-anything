import difference from "../difference"

describe('difference', () => {
    it('happy path', () => {
        const res = difference([2, 1], [2, 3])
        expect(res).toEqual([1])
    })
})