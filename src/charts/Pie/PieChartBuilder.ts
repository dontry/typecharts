import { ChartBuilder } from "../ChartBuilder";

export class PieChartBuilder implements ChartBuilder {
  setGridSetting(): void {
    throw new Error("Method not implemented.");
  }
  setSeriesFromDataset(): void {
    throw new Error("Method not implemented.");
  }
  setLayout(): void {
    throw new Error("Method not implemented.");
  }
  paginateDataset(): void {
    throw new Error("Method not implemented.");
  }
  build(): import("../AbstractChart").AbstractChart {
    throw new Error("Method not implemented.");
  }
  setSeries(): void {}
  setTitle(): void {}
  setLegend(): void {}
  setGrid(): void {}
  setDatasetList?(): void {}
  setColors(): void {}
  setTooltip(): void {}
  pipeline(): void {}
}
