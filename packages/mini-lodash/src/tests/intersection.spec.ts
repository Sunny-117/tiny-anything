import intersection from "../intersection"

describe('intersection', () => {
    it('happy path', () => {
        const res = intersection([2, 1], [2, 3])
        expect(res).toEqual([2])
    })
})