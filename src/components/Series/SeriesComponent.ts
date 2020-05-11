import { AbstractComponent } from "../AbstractComponent";
import { PlotDatasetInfo } from "../Dataset/DatasetComponent";
import { Encode } from "@/types/Encode";
import { IconType } from "@/types/IconType";

export type SeriesType = "bar" | "line" | "pie" | "scatter";
export interface Series {
  id?: string;
  type: SeriesType;
  name: string;
  data?: any[];
  encode?: Encode;
  center?: string[];
  datasetIndex?: number;
  xAxisIndex?: number;
  yAxisIndex?: number;
  symbol?: IconType;
  symbolSize?: number;
  cursor?: "pointer" | "not-allow";
  sampling?: "average" | "max" | "min" | "sum";
}

export interface SeriesComponentConfig extends BaseSeriesComponentConfig {
  axisIndex: number;
  encode: Encode;
}

export interface BaseSeriesComponentConfig {
  type: SeriesType;
  name: string;
  info: PlotDatasetInfo;
  datasetIndex: number;
  color?: string;
  custom?: any;
}

export class SeriesComponent<
  K extends Series = Series
> extends AbstractComponent<K> {
  protected _type!: SeriesType;
  protected _name = "";
  protected _symbolSize = 5;
  protected _datasetIndex!: number;
  protected _xAxisIndex!: number;
  protected _yAxisIndex!: number;
  protected _info!: PlotDatasetInfo;
  protected _encode!: Encode;
  protected _color: string | undefined;

  constructor() {
    super();
    this.fieldName = "series";
  }

  public get type(): SeriesType {
    return this._type;
  }
  public set type(value: SeriesType) {
    this._type = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value) {
    this._name = value;
  }
  public get symbolSize(): number {
    return this._symbolSize;
  }
  public set symbolSize(value) {
    this._symbolSize = value;
  }
  public get datasetIndex(): number {
    return this._datasetIndex;
  }
  public set datasetIndex(value: number) {
    this._datasetIndex = value;
  }
  public get xAxisIndex(): number {
    return this._xAxisIndex;
  }
  public set xAxisIndex(value: number) {
    this._xAxisIndex = value;
  }
  public get yAxisIndex(): number {
    return this._yAxisIndex;
  }
  public set yAxisIndex(value: number) {
    this._yAxisIndex = value;
  }
  public get info(): PlotDatasetInfo {
    return this._info;
  }
  public set info(value: PlotDatasetInfo) {
    this._info = value;
  }
  public get encode(): Encode {
    return this._encode;
  }
  public set encode(value: Encode) {
    this._encode = value;
  }
  public get color(): string | undefined {
    return this._color;
  }
  public set color(value: string | undefined) {
    this._color = value;
  }
  public toEChartOption(): K {
    return {
      id: this.id,
      type: this._type,
      name: this._name,
      encode: this._encode,
      xAxisIndex: this._xAxisIndex,
      yAxisIndex: this._yAxisIndex,
      datasetIndex: this._datasetIndex,
      ...this._custom,
    } as K;
  }
}
