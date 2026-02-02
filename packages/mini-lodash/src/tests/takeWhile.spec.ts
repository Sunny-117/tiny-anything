import takeWhile from "../takeWhile";

describe('takeRightWhile', () => {
    it('happy path', () => {
        const res1 = takeWhile([
            { 'user': 'barney', 'active': true },
            { 'user': 'fred', 'active': true },
            { 'user': 'pebbles', 'active': false }
        ], ({ active }) => active)
        expect(res1).toEqual([{ user: 'barney', active: true }, { user: 'fred', active: true }])


    })
})
