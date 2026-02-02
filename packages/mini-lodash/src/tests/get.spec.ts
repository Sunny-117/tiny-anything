import get from "../get"


describe('get', () => {
    it('happy path', () => {
        const res1 = get({ 'a': [{ 'b': { 'c': 3 } }] }, 'a[0].b.c')
        expect(res1).toEqual(3)

        const res2 = get({ 'a': [{ 'b': { 'c': 3 } }] }, ['a', '0', 'b', 'c'])
        expect(res2).toEqual(3)

        const res3 = get({ 'a': [{ 'b': { 'c': 3 } }] }, 'a.b.c', 'default')
        expect(res3).toEqual('default')

    })
})
