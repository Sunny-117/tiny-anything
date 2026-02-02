import xorWith from "../xorWith"
function isEqual(a, v) {
    return JSON.stringify(a) === JSON.stringify(v)
}

describe('xorWith', () => {
    it('happy path', () => {
        const zipped = xorWith([{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }], [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }], isEqual)
        expect(zipped).toEqual([{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }])
    })
})
