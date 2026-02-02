import create from "../create"

function Shape(this: any) {
    this.x = 0
    this.y = 0
}

function Circle(this: any) {
    Shape.call(this)
}

describe('create', () => {
    it('happy path', () => {

        Circle.prototype = create(Shape.prototype, {
            'constructor': Circle
        })
        const circle = new Circle
        expect(circle instanceof Circle).toBe(true)
        expect(circle instanceof Shape).toBe(true)

    })
})
