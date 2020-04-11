import fruits from "../fixtures/fruits.json";
import { CategoryDataSource } from "@/components/DataSource/CategoryDataSource";
import { DataParam } from "@/types/Param";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";
describe("CategoryDataSource", () => {
  it("should return 3 arrays", () => {
    const valueParams: DataParam[] = [
      {
        title: "amount",
        aggregation: NUMBER_AGGREGATION.COUNT,
        type: "number",
      },
      { title: "price", aggregation: NUMBER_AGGREGATION.MEAN, type: "number" },
    ];
    const dimensionParam: DataParam = { title: "country", type: "string" };
    const sortBy = "country";
    const dataSource = new CategoryDataSource(
      fruits,
      valueParams,
      dimensionParam,
      sortBy,
    );
    const dataArray = dataSource.transformToDataArray();

    expect(dataArray.length).toBe(3);
    expect(dataArray[0]["country"]).toBe("AUS");
    expect(dataArray[0]["amount"]).toBe(2);
    expect(dataArray[0]["price"]).toBe(4.75);
    expect(dataArray[1]["country"]).toBe("UK");
    expect(dataArray[1]["amount"]).toBe(2);
    expect(dataArray[1]["price"]).toBe(16);
    expect(dataArray[2]["country"]).toBe("USA");
    expect(dataArray[2]["amount"]).toBe(2);
    expect(dataArray[2]["price"]).toBe(8.5);
  });
});
