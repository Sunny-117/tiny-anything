import without from "../without"

describe('without', () => {
    it('happy path', () => {
        const zipped = without([2, 1, 2, 3], 1, 2)
        expect(zipped).toEqual([3])
    })
})
