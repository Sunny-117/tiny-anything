import isArguments from "../isArguments"


describe('isArguments', () => {
    it('happy path', () => {
        const res1 = isArguments(function () { return arguments; }())
        expect(res1).toEqual(true)
        const res2 = isArguments([1, 2, 3]);
        expect(res2).toEqual(false)
    })
})