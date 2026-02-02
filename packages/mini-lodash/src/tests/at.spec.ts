import at from "../at"

describe('at', () => {
    it('happy path', () => {
        const zipped = at({ 'a': [{ 'b': { 'c': 3 } }, 4] }, ['a[0].b.c', 'a[1]'])
        expect(zipped).toEqual([3, 4])
    })
})
