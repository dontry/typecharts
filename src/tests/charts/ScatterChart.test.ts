import { DataItem } from "@/types/DataItem";
import { parseCsvData } from "../fixtures/utils";
import path from "path";
import {
  ScatterChart,
  ScatterChartConfig,
} from "@/charts/Scatter/ScatterChart";
import { Grid } from "@/components/Grid/GridComponent";
import { Dataset } from "@/components/Dataset/DatasetComponent";
import { Series } from "@/components/Series/SeriesComponent";
import { Axis } from "@/components/Axis/AxisComponent";
import { VisualMap } from "@/components/VisualMap/VisualMapComponent";
import { Tooltip } from "@/components/Tooltip/TooltipComponent";

describe("Scatter Chart", () => {
  let rawData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    rawData = parsedData.slice(0, 1000);
  });

  test("create a line chart with 1 valueParam & 1 dimensionParam", () => {
    const config: ScatterChartConfig = {
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
    const chart = new ScatterChart(rawData, config);
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
    expect(series[0].type).toBe("scatter");
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
  });
});

describe("Bubble chart", () => {
  let rawData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    rawData = parsedData.slice(0, 1000);
  });

  test("create a bubble chart with 1 valueParam, 1 dimensionParam and  bubbleSize", () => {
    const config: ScatterChartConfig = {
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
      isBubble: true,
      bubble: {
        size: [1, 30],
      },
      tooltip: {
        show: true,
      },
    };
    const chart = new ScatterChart(rawData, config);
    const option = chart.buildEChartOption();
    expect(option).toBeTruthy();

    const grid = option.grid as Grid[];
    const dataset = option.dataset as Dataset[];
    const series = option.series as Series[];
    const xAxis = option.xAxis as Axis[];
    const yAxis = option.yAxis as Axis[];
    const visualMap = option.visualMap as VisualMap;
    const tooltip = option.tooltip as Tooltip;

    expect(Array.isArray(option.dataset)).toBeTruthy();
    expect(dataset.length).toBe(1);
    expect(grid.length).toBe(1);
    expect(series.length).toBe(1);
    expect(series[0].type).toBe("scatter");
    expect(xAxis.length).toBe(1);
    expect(xAxis[0].name).toBe("xAxis");
    expect(yAxis.length).toBe(1);
    expect(yAxis[0].name).toEqual("yAxis");
    expect(visualMap.type).toBe("continuous");
    expect(visualMap.show).toBe(false);
    expect(visualMap.min).toBe(-5000);
    expect(visualMap.max).toBe(5000);
    expect(tooltip.trigger).toBe("item");
    expect(tooltip.show).toBeTruthy();
  });
});
