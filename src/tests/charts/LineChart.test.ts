import path from "path";
import { DataItem } from "@/types/DataItem";
import { parseCsvData } from "../fixtures/utils";
import { LineChart } from "@/charts/Line/LineChart";
import { Dataset } from "@/components/Dataset/DatasetComponent";
import { Grid } from "@/components/Grid/GridComponent";
import { Series } from "@/components/Series/SeriesComponent";
import { Axis } from "@/components/Axis/AxisComponent";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";
import { BaseCartesianChartConfig } from "@/charts/BaseCartesianChartConfig";

describe("Line Chart", () => {
  let rawData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    rawData = parsedData.slice(0, 1000);
  });

  test("create a line chart with 1 valueParam & 1 dimensionParam", () => {
    const config: BaseCartesianChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Profit",
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
    const chart = new LineChart(rawData, config);
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
    expect(series[0].type).toBe("line");
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
  });

  test("create a line chart with 2 valueParam & 1 dimensionParam", () => {
    const config: BaseCartesianChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Profit",
        },
        {
          type: "number",
          name: "Quantiy",
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
    const chart = new LineChart(rawData, config);
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
    expect(series.length).toBe(2);
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
  });

  test("create a line chart with 1 valueParam with mean aggregation & 1 dimensionParam & facetParam", () => {
    const config: BaseCartesianChartConfig = {
      valueParams: [
        {
          type: "number",
          name: "Profit",
          aggregation: NUMBER_AGGREGATION.MEAN,
        },
      ],
      dimensionParam: { type: "string", name: "Region" },
      facetParam: { type: "string", name: "State" },
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
      layout: {
        rows: 3,
        cols: 3,
      },
      pageIndex: 0,
    };
    const chart = new LineChart(rawData, config);
    const option = chart.buildEChartOption();
    expect(option).toBeTruthy();

    const grid = option.grid as Grid[];
    const dataset = option.dataset as Dataset[];
    const series = option.series as Series[];
    const xAxis = option.xAxis as Axis[];
    const yAxis = option.yAxis as Axis[];

    expect(Array.isArray(option.dataset)).toBeTruthy();
    expect(dataset.length).toBe(9);
    expect((dataset[0].source as any[]).length).toBeLessThan(4);
    expect(grid.length).toBe(9);
    expect(series.length).toBe(9);
    expect(xAxis.length).toBe(9);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(9);
    expect(yAxis[0].name).toEqual("yAxis");
  });
});
