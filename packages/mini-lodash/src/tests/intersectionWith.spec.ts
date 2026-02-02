import intersectionWith from "../intersectionWith"
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
}
describe('intersectionWith', () => {

    it('happy path', () => {
        const res = intersectionWith([{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }], [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }], isEqual)
        expect(res).toEqual([{ 'x': 1, 'y': 2 }])
    })
})
