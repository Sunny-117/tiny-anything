import zipWith from "../zipWith"

describe('zipWith', () => {
    it('happy path', () => {
        const zipped = zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c)
        expect(zipped).toEqual([111, 222])
    })
})
