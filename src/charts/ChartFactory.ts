import { DataItem } from "@/types/DataItem";
import { BaseChartConfig } from "./BaseChartConfig";
import { BarChartConfig, BarChart } from "./Bar/BarChart";
import { LineChartConfig, LineChart } from "./Line/LineChart";
import { ScatterChartConfig, ScatterChart } from "./Scatter/ScatterChart";
import { PieChartConfig, PieChart } from "./Pie/PieChart";
import { AbstractChart } from "./AbstractChart";

export enum ChartType {
  Bar = "bar",
  Scatter = "scatter",
  Pie = "pie",
  Line = "line",
}

export type ChartConfig =
  | BarChartConfig
  | LineChartConfig
  | ScatterChartConfig
  | PieChartConfig;

export class ChartFactory {
  public createChart(
    type: ChartType,
    data: DataItem[],
    config: ChartConfig,
  ): AbstractChart {
    switch (type) {
      case ChartType.Bar:
        return new BarChart(data, config as BarChartConfig);
      case ChartType.Line:
        return new LineChart(data, config as LineChartConfig);
      case ChartType.Scatter:
        return new ScatterChart(data, config as LineChartConfig);
      case ChartType.Pie:
        return new PieChart(data, config as PieChartConfig);
      default:
        throw Error("Input chart type is invalid");
    }
  }
}
