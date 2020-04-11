import fruits from "../fixtures/fruits.json";
import { aggregateDataByValueParam } from "../../utils/misc";
import { DataParam } from "@/types/Param";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";

describe("aggregateValues", () => {
  it("should return count value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.COUNT,
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(6);
  });

  it("should return min value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.MIN,
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(10);
  });

  it("should return max value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.MAX,
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(60);
  });

  it("should return mean value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.MEAN,
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(35);
  });

  it("should return sum value", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.SUM,
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(210);
  });

  it("should return sum value when aggregation is undefined", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBe(210);
  });

  it("should return NaN when aggregation is invalid", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      // @ts-ignore
      aggregation: "invalid",
    };
    expect(aggregateDataByValueParam(fruits, valueParam)).toBeNaN();
  });

  it("should return min value even input has invalid data", () => {
    const valueParam: DataParam = {
      title: "amount",
      type: "number",
      aggregation: NUMBER_AGGREGATION.MIN,
    };
    const missingValueFruits = [...fruits, { name: "pineapple" }];
    expect(aggregateDataByValueParam(missingValueFruits, valueParam)).toBe(10);

    const wrongTypedFruits = [...fruits, { name: "pineapple", amount: "fff" }];
    expect(aggregateDataByValueParam(wrongTypedFruits, valueParam)).toBe(10);
  });
});
