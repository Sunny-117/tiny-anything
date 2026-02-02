import takeRightWhile from "../takeRightWhile";

describe('takeRightWhile', () => {
    it('happy path', () => {
        const res1 = takeRightWhile([
            { 'user': 'barney', 'active': false },
            { 'user': 'fred', 'active': true },
            { 'user': 'pebbles', 'active': true }
        ], ({ active }) => active)

        expect(res1).toEqual([{ user: 'fred', active: true }, { user: 'pebbles', active: true }])


    })
})
