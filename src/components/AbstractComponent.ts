import { BaseOption } from "./BaseOption";
import { v4 as uuid } from "uuid";
import { Series } from "./Series/SeriesComponent";
import { Dataset } from "./Dataset/DatasetComponent";
import { Axis } from "./Axis/AxisComponent";
import { Grid } from "./Grid/GridComponent";

export type ChartOption = Series | Dataset | Axis | Grid[];

export abstract class AbstractComponent<T> implements BaseOption<T> {
  protected id: string;
  protected optionName!: string;
  protected _custom: any = {};

  constructor() {
    this.id = uuid();
  }
  public get custom(): any {
    return this._custom;
  }
  public set custom(value: any) {
    this._custom = value;
  }
  public getOptionName(): string {
    return this.optionName;
  }
  public abstract toEChartOption(): T;
}
