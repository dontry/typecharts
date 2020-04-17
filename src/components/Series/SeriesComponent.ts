import { Series, SeriesType } from "@/types/Series";
import { AbstractComponent } from "../AbstractComponent";
import { PlotDatasetInfo } from "../Dataset/PlotDataset";
import { Encode } from "@/types/Encode";

export interface SeriesComponentConfig {
  type: SeriesType;
  name: string;
  info: PlotDatasetInfo;
  encode: Encode;
  color?: string;
  axisIndex: number;
  datasetIndex: number;
}

export class SeriesComponent extends AbstractComponent<Series> {
  private _type!: SeriesType;
  private _name = "";
  private _symbolSize = 5;
  private _datasetIndex!: number;
  private _xAxisIndex!: number;
  private _yAxisIndex!: number;
  private _info!: PlotDatasetInfo;
  private _encode!: Encode;
  private _color: string | undefined;

  constructor() {
    super();
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

  toEchartOption(): Series {
    throw new Error("Method not implemented.");
  }
}
