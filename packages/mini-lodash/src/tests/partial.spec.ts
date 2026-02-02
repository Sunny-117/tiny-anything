import partial from "../partial";

var greet = function (greeting, name) {
  return greeting + " " + name;
};

describe("difference", () => {
  it("isObjectLike", () => {
    var sayHelloTo = partial(greet, "hello");
    const res = sayHelloTo("fred");
    expect(res).toEqual("hello fred");
  });
});
