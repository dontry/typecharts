import { EChartOption } from "echarts";

export abstract class AbstractChart {
  protected dataset: any[];
  protected colors: string[];

  constructor() {
    this.dataset = [];
    this.colors = [];
  }
  public abstract setDataset(): void;
  public abstract setColors(): void;
  public abstract setDimension(): void;
  public abstract setValues(): void;
  public abstract setSubgroups(): void;
  public abstract setGrids(): void;
  public abstract setSeries(): void;
  public abstract setLengend(): void;
  public abstract setLayout(): void;
  public abstract paginateDataset?(): void;
  public abstract setTooltipFormatter?(): void;
  public abstract setSubTitle?(): void;
  public abstract pipeline(): EChartOption;
}
