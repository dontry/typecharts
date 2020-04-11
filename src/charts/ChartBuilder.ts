import { AbstractChart } from "./AbstractChart";

export interface ChartBuilder {
  setColors(): void;
  setGridSetting(): void;
  setSeriesFromDataset(): void;
  setLayout(): void;
  paginateDataset(): void;
  setTooltipFormatter?(): void;
  setSubTitle?(): void;
  build(): AbstractChart;
}
