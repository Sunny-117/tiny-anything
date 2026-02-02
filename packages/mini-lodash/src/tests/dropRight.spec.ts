import dropRight from "../dropRight"

describe('dropRight', () => {
    it('happy path', () => {
        const res1 = dropRight([1, 2, 3])
        expect(res1).toEqual([1, 2])

        const res2 = dropRight([1, 2, 3], 2)
        expect(res2).toEqual([1])

        const res3 = dropRight([1, 2, 3], 5)
        expect(res3).toEqual([])

        const res4 = dropRight([1, 2, 3], 0)
        expect(res4).toEqual([1, 2, 3])
    })
})

