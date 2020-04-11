import { AbstractChart } from "./AbstractChart";
import { EChartOption } from "echarts";

export abstract class AbstractCartesianChart extends AbstractChart {
  protected xAxis: number[];
  protected yAxis: number[];
  /**
   *
   */
  constructor() {
    super();
    this.xAxis = [];
    this.yAxis = [];
  }
  public abstract setXAxis(): void;
  public abstract setYAxis(): void;
}
