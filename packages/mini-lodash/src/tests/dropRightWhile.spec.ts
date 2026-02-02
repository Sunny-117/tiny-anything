
import dropRightWhile from "../dropRightWhile"

describe('dropRightWhile', () => {
    it('happy path', () => {
        const res1 = dropRightWhile([
            { 'user': 'barney', 'active': false },
            { 'user': 'fred', 'active': true },
            { 'user': 'pebbles', 'active': true }
        ], ({ active }) => active)
        expect(res1).toEqual([{ user: 'barney', active: false }])
    })
})

