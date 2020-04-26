import fruits from "../fixtures/fruits.json";
import { CategoryDataSource } from "@/components/DataSource/CategoryDataSource";
import { DataParam } from "@/types/Param";
import { NUMBER_AGGREGATION, FREQUENCY } from "@/types/Aggregation";
import { parseCsvData } from "../fixtures/utils";
import { DateTimeDataSource } from "@/components/DataSource/DateTimeDataSource";
import path from "path";

describe("CategoryDataSource", () => {
  it("should return 3 arrays", () => {
    const valueParams: DataParam[] = [
      {
        name: "amount",
        aggregation: NUMBER_AGGREGATION.COUNT,
        type: "number",
      },
      { name: "price", aggregation: NUMBER_AGGREGATION.MEAN, type: "number" },
    ];
    const dimensionParam: DataParam = { name: "country", type: "string" };
    const sortBy = "country";
    const dataSource = new CategoryDataSource(
      fruits,
      valueParams,
      dimensionParam.name,
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

describe("DateTimeDataSource", () => {
  test("value: profit, aggregation: mean; dimension: order date, frequency: year;", () => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    const valueParams: DataParam[] = [
      {
        type: "number",
        name: "Profit",
        aggregation: NUMBER_AGGREGATION.MEAN,
      },
    ];
    const dimensionParam: DataParam = {
      type: "date",
      name: "Order Date",
      aggregation: FREQUENCY.YEAR,
    };

    const dataSource = new DateTimeDataSource(
      parsedData,
      valueParams,
      dimensionParam,
      "DD/MM/YY",
    );
    const dataArray = dataSource.transformToDataArray();

    expect(dataArray.length).toBe(4);
    expect(dataArray[0]["Order Date"]).toBe("2014");
    expect(typeof dataArray[0]["Profit"]).toBe("number");
    expect(typeof dataArray[0]["__timestamp__"]).toBe("number");
    expect(typeof dataArray[0]["__formattedTimestamp__"]).toBe("number");
  });
});
