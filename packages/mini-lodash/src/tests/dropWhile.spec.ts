import dropWhile from "../dropWhile"

describe('dropRight', () => {
    it('happy path', () => {
        const res1 = dropWhile([
            { 'user': 'barney', 'active': true },
            { 'user': 'fred', 'active': true },
            { 'user': 'pebbles', 'active': false }
        ], ({ active }) => active)
        expect(res1).toEqual([{ user: 'pebbles', active: false }])
    })
})

