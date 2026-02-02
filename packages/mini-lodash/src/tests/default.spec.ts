import defaults from "../defaults"

describe('defaults', () => {
    it('happy path', () => {
        const zipped = defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 })
        expect(zipped).toEqual({ 'a': 1, 'b': 2 })
    })
})
