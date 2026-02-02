import unzip from "../unzip";
import zip from "../zip";

describe('zip-unzip', () => {
    it('happy path', () => {
        it('happy path', () => {
            const zipped = zip(['a', 'b'], [1, 2], [true, false])
            expect(zipped).toEqual([['a', 1, true], ['b', 2, false]])
            const unziped = unzip(zipped)
            expect(unziped).toEqual([['a', 'b'], [1, 2], [true, false]])

        })
    })
})
