import { computeCircumference, computeSquarePerimetter } from "../math.js";

test('we are square ✅', () => {
    let value = computeSquarePerimetter(3);
    expect(value).toEqual(12);

    value = computeSquarePerimetter(0);
    expect(value).toEqual(0)

    value = computeSquarePerimetter(4);
    expect(value).toEqual(16)

    value = computeSquarePerimetter(45);
    expect(value).toEqual(180)
})

test('we are negat', () => {
    expect(() => computeSquarePerimetter(-6).toThrow())
    expect(() => computeSquarePerimetter(-42).toThrow())
    expect(() => computeSquarePerimetter(-13).toThrow())
    expect(() => computeSquarePerimetter(-45).toThrow())
})