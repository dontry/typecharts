import path from "path";
import { parseCsvData } from "../fixtures/utils";
import { PieChartConfig, PieChart } from "@/charts/Pie/PieChart";
import { DataItem } from "@/types/DataItem";
import { Grid } from "@/components/Grid/GridComponent";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";
import { Series } from "@/components/Series/SeriesComponent";

describe("Pie Chart", () => {
  let rawData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    rawData = parsedData;
  });

  test("create a pie chart with 1 valueParam with sum aggregation & 1 categoryParam", () => {
    const config: PieChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Quantity",
          aggregation: NUMBER_AGGREGATION.SUM,
        },
      ],
      categoryParam: {
        type: "string",
        name: "Region",
      },
      pieType: "radar",
      layout: {
        rows: 1,
        cols: 1,
      },
      toggleLabel: true,
    };

    const chart = new PieChart(rawData, config);

    const option = chart.buildEChartOption();
    expect(option).toBeTruthy();

    const grid = option.grid as Grid[];
    const series = option.series as Series[];
    const seriesData = series[0].data as any[];

    expect(grid.length).toBe(1);
    expect(series.length).toBe(1);
    expect(seriesData.length).toBe(4);
    expect(seriesData[0].name).toBe("Central");
    expect(seriesData[1].name).toBe("East");
    expect(seriesData[2].name).toBe("South");
    expect(seriesData[3].name).toBe("West");
  });

  test("create a pie chart with 1 valueParam with sum aggregation, 1 categoryParam & 1 facetParam", () => {
    const config: PieChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Quantity",
          aggregation: NUMBER_AGGREGATION.SUM,
        },
      ],
      categoryParam: {
        type: "string",
        name: "State",
      },
      facetParam: {
        type: "string",
        name: "Region",
      },
      pageIndex: 0,
      pieType: "radar",
      layout: {
        rows: 1,
        cols: 3,
      },
      toggleLabel: true,
    };

    const chart = new PieChart(rawData, config);

    const option = chart.buildEChartOption();
    expect(option).toBeTruthy();

    const grid = option.grid as Grid[];
    const series = option.series as Series[];
    const seriesData = series[0].data as any[];

    expect(grid.length).toBe(3);
    expect(series.length).toBe(3);
    expect(seriesData.length).toBeGreaterThan(4);
  });
});
