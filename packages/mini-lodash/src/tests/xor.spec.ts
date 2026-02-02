import xor from "../xor"

describe('xor', () => {
    it('happy path', () => {
        const zipped = xor([2, 1], [2, 3])
        expect(zipped).toEqual([1, 3])
    })
})
