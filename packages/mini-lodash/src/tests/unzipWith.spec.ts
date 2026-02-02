import unzipWith from "../unzipWith"
import zip from "../zip"

function add(a, v) {
    return a + v
}
describe('unzipWith', () => {
    it('happy path', () => {
        const zipped = zip([1, 2], [10, 20], [100, 200])
        expect(zipped).toEqual([[1, 10, 100], [2, 20, 200]])
        const unziped = unzipWith(zipped, add)
        expect(unziped).toEqual([3, 30, 300])
    })
})
