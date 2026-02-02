import xorBy from "../xorBy"

describe('xorBy', () => {
    it('happy path', () => {
        const zipped = xorBy([2.1, 1.2], [2.3, 3.4], Math.floor)
        expect(zipped).toEqual([1.2, 3.4])
    })
})
