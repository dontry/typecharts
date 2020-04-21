import { BaseOption } from "./BaseOption";
import { v4 as uuid } from "uuid";
import { Series } from "./Series/SeriesComponent";
import { Dataset } from "./Dataset/DatasetComponent";
import { Axis } from "./Axis/AxisComponent";
import { SingleGrid } from "./Grid/GridComponent";

export type OptionType = Series | Dataset | Axis | SingleGrid[];

export abstract class AbstractComponent<T> implements BaseOption<T> {
  protected id: string;
  protected fieldName!: string;
  constructor() {
    this.id = uuid();
  }
  getFieldName(): string {
    return this.fieldName;
  }
  public abstract toEchartOption(): T;
}
