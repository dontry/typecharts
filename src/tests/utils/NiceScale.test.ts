import { NiceScale } from "@/utils/NiceScale";

describe("NiceScale", () => {
  it("should return [-10, 110]", () => {
    const niceScale = new NiceScale(0, 100);
    const [min, max] = niceScale.calculate();

    expect(min).toBe(-10);
    expect(max).toBe(110);
  });

  it("should return [-75, 125]", () => {
    const niceScale = new NiceScale(-20, 100);
    const [min, max] = niceScale.calculate();

    expect(min).toBe(-75);
    expect(max).toBe(125);
  });

  it("should return [750, 3250]", () => {
    const niceScale = new NiceScale(1090, 3000);
    const [min, max] = niceScale.calculate();

    expect(min).toBe(750);
    expect(max).toBe(3250);
  });

  it("should return [-1000, 11000]", () => {
    const niceScale = new NiceScale(270, 10000);
    const [min, max] = niceScale.calculate();

    expect(min).toBe(-1000);
    expect(max).toBe(11000);
  });

  it("should return [NaN, NaN]", () => {
    const niceScale = new NiceScale(-Infinity, 10000);
    const [min, max] = niceScale.calculate();

    expect(min).toBeNaN();
    expect(max).toBeNaN();
  });
});
