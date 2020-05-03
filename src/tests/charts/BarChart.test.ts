import { BarChartConfig, BarChart } from "@/charts/Bar/BarChart";
import { DataItem } from "@/types/DataItem";
import path from "path";
import { parseCsvData } from "../fixtures/utils";
import { Grid } from "@/components/Grid/GridComponent";
import { Dataset } from "@/components/Dataset/DatasetComponent";
import { Series } from "@/components/Series/SeriesComponent";
import { Axis } from "@/components/Axis/AxisComponent";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";

describe("BarChart", () => {
  let rawData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    rawData = parsedData.slice(0, 1000);
  });

  test("create a bar chart of 1 valueParam with count aggregation and 1 dimensionParam", () => {
    const config: BarChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Profit",
          aggregation: NUMBER_AGGREGATION.COUNT,
        },
      ],
      dimensionParam: { type: "string", name: "Region" },
      xAxis: {
        name: "xAxis",
        show: true,
        scale: true,
        onZero: true,
      },
      yAxis: {
        name: "yAxis",
        show: true,
        scale: true,
        onZero: true,
      },
    };
    const chart = new BarChart(rawData, config);
    const option = chart.buildEChartOption();
    expect(option).toBeTruthy();

    const grid = option.grid as Grid[];
    const dataset = option.dataset as Dataset[];
    const series = option.series as Series[];
    const xAxis = option.xAxis as Axis[];
    const yAxis = option.yAxis as Axis[];

    expect(Array.isArray(option.dataset)).toBeTruthy();
    expect(dataset.length).toBe(1);
    expect(grid.length).toBe(1);
    expect(series.length).toBe(1);
    expect(series[0].type).toBe("bar");
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
    expect(Array.isArray(option.dataset)).toBeTruthy();
    expect(dataset.length).toBe(1);
    expect((dataset[0].source as any[]).length).toBe(4);
    expect(grid.length).toBe(1);
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
  });
});
