import zipObject from "../zipObject"

describe('zipObject', () => {
    it('happy path', () => {
        const zipped = zipObject(['a', 'b'], [1, 2])
        expect(zipped).toEqual({ 'a': 1, 'b': 2 })
    })
})
