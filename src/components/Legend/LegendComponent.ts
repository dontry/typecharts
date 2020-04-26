import { EChartOption } from "echarts";
import { AbstractComponent } from "../AbstractComponent";

export type Legend = EChartOption.Legend;

export class LegendComponent extends AbstractComponent<Legend> {
  private _data: string[];

  constructor() {
    super();
    this._data = [];
  }

  public get data(): string[] {
    return this._data;
  }
  public set data(value: string[]) {
    this._data = value;
  }
  // TODO: getLegendTitlesFromSeries

  public toEChartOption(): Legend {
    // TODO: EChart option
    return {
      data: this._data,
    };
  }
}
