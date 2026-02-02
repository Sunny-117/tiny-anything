import takeRight from "../takeRight";

describe('takeRight', () => {
    it('happy path', () => {
        const res1 = takeRight([1, 2, 3])
        expect(res1).toEqual([3])

        const res2 = takeRight([1, 2, 3], 2)
        expect(res2).toEqual([2, 3])

        const res3 = takeRight([1, 2, 3], 5)
        expect(res3).toEqual([1, 2, 3])

        const res4 = takeRight([1, 2, 3], 0)
        expect(res4).toEqual([])

    })
})
