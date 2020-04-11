import { ChartBuilder } from "./ChartBuilder";
import { AbstractChart } from "./AbstractChart";

export interface CartesianChartBuilderInterface extends ChartBuilder {
  setXAxis(): void;
  setYAxis(): void;
}

export abstract class AbstractCartesianChartBuilder
  implements CartesianChartBuilderInterface {
  public abstract setXAxis(): void;
  public abstract setYAxis(): void;
  public abstract setColors(): void;
  public abstract setGridSetting(): void;
  public abstract setSeriesFromDataset(): void;
  public abstract paginateDataset(): void;
  public abstract setLayout(): void;
  public abstract build(): AbstractChart;
}
