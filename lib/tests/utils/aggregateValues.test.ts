import fruits from "../fixtures/fruits.json";
import { aggregateDataByValueParam } from "../../utils/MiscUtil";
import { DataParam } from "@/types/Param";

describe("aggregateValues", () => {
  it("should return count value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "count"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(6);
  });

  it("should return min value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "min"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(10);
  });

  it("should return max value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "max"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(60);
  });

  it("should return mean value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "mean"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(35);
  });

  it("should return sum value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "sum"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(210);
  });

  it("should return sum value when aggregation is undefined", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(210);
  });

  it("should return NaN when aggregation is invalid", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "invalid"
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBeNaN();
  });

  it("should return min value even input has invalid data", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: "min"
    };
    const missingValueFruits = [...fruits, { name: "pineapple" }];
    expect(aggregateDataByValueParam(missingValueFruits, valueParam)).toBe(10);

    const wrongTypedFruits = [...fruits, { name: "pineapple", amount: "fff" }];
    expect(aggregateDataByValueParam(wrongTypedFruits, valueParam)).toBe(10);
  });
});
