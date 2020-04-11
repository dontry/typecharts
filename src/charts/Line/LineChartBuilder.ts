import { AbstractCartesianChartBuilder } from "@charts/ICartesianChartBuilder";

export class LineChartBuilder extends AbstractCartesianChartBuilder {
  constructor() {
    super();
  }
  public setXAxis(): void {
    throw new Error("Method not implemented.");
  }
  public setYAxis(): void {
    throw new Error("Method not implemented.");
  }
  public setColors(): void {
    throw new Error("Method not implemented.");
  }
  public setGridSetting(): void {
    throw new Error("Method not implemented.");
  }
  public setSeriesFromDataset(): void {
    throw new Error("Method not implemented.");
  }
  public paginateDataset(): void {
    throw new Error("Method not implemented.");
  }
  public setLayout(): void {
    throw new Error("Method not implemented.");
  }
  public build(): import("../AbstractChart").AbstractChart {
    throw new Error("Method not implemented.");
  }
}
