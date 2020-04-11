import { AbstractCartesianChart } from "@charts/AbstractCartesianChart";

export class LineChart extends AbstractCartesianChart {
  constructor() {
    super();
  }
  public setXAxis(): void {
    throw new Error("Method not implemented.");
  }
  public setYAxis(): void {
    throw new Error("Method not implemented.");
  }
  public setDataset(): void {
    throw new Error("Method not implemented.");
  }
  public setColors(): void {
    throw new Error("Method not implemented.");
  }
  public setDimension(): void {
    throw new Error("Method not implemented.");
  }
  public setValues(): void {
    throw new Error("Method not implemented.");
  }
  public setSubgroups(): void {
    throw new Error("Method not implemented.");
  }
  public setGrids(): void {
    throw new Error("Method not implemented.");
  }
  public setSeries(): void {
    throw new Error("Method not implemented.");
  }
  public setLengend(): void {
    throw new Error("Method not implemented.");
  }
  public setLayout(): void {
    throw new Error("Method not implemented.");
  }
  public pipeline(): echarts.EChartOption<echarts.EChartOption.Series> {
    throw new Error("Method not implemented.");
  }
}
