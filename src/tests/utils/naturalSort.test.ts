import { naturalSort } from "@/utils/misc";

describe("natural sort", () => {
  it("should return number in correct order", () => {
    const sorted = naturalSort([1, 32, 44, 33, 22, 6, 11, 13, 14]);
    expect(sorted).toEqual([1, 6, 11, 13, 14, 22, 32, 33, 44]);
  });

  it("should return number string in correct order", () => {
    const sorted = naturalSort(["11", "02", "20", "21", "23"]);
    expect(sorted).toEqual(["02", "11", "20", "21", "23"]);
  });

  it("should return string in correct order", () => {
    const sorted = naturalSort(["z2", "z1", "z31", "z11"]);
    expect(sorted).toEqual(["z1", "z2", "z11", "z31"]);
  });
});
