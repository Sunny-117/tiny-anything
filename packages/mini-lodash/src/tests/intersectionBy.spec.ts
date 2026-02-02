import intersectionBy from "../intersectionBy"


describe('intersectionBy', () => {
    it('happy path', () => {
        const res = intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)
        expect(res).toEqual([2.1])
    })
})