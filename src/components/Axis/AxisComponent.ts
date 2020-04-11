import { AbstractComponent } from "../AbstractComponent";
import { EChartOption } from "echarts";
import { AxisConfig } from "./AxisConfig";
import { Minmax } from "@/types/Minmax";
import { DataValue } from "@/types/DataItem";

export type Axis = EChartOption.BasicComponents.CartesianAxis;
type AxisType = "category" | "time" | "value";
type AxisDimension = "x" | "y";

export interface AxisSettingConfig extends AxisConfig {
  data: DataValue[];
  name: string;
  gridIndex: number;
  type: AxisType;
  scale: boolean;
  count: number;
}

export class AxisComponent extends AbstractComponent<Axis> {
  protected readonly DEFAULT_NAME_GAP = 27;

  protected _data: DataValue[] | undefined = [];
  protected _name = "";
  protected _gridIndex = -1;
  protected _scale = true;
  protected _count = 1;
  protected _nameGap: number | undefined;
  protected _type: AxisType = "value";
  protected _position = "left";
  protected _min: Minmax | undefined = undefined;
  protected _max: Minmax | undefined = undefined;
  protected _show = true;
  private _splitNumber: number | "auto" = "auto";

  constructor() {
    super();
    this.nameGap = this.DEFAULT_NAME_GAP;
  }

  public get count(): number {
    return this._count;
  }
  public set count(value: number) {
    this._count = value;
  }
  public get scale(): boolean {
    return this._scale;
  }
  public set scale(value: boolean) {
    this._scale = value;
  }
  public get gridIndex(): number {
    return this._gridIndex;
  }
  public set gridIndex(value: number) {
    this._gridIndex = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get data(): DataValue[] | undefined {
    return this._data;
  }
  public set data(value: DataValue[] | undefined) {
    this._data = value;
  }
  public get nameGap(): number | undefined {
    return this._nameGap;
  }
  public set nameGap(value: number | undefined) {
    this._nameGap = value;
  }
  public get type(): AxisType {
    return this._type;
  }
  public set type(value: AxisType) {
    this._type = value;
  }
  public get position(): string {
    return this._position;
  }
  public set position(value: string) {
    this._position = value;
  }

  public get min(): Minmax | undefined {
    return this._min;
  }
  public set min(value: Minmax | undefined) {
    this._min = value;
  }
  public get max(): Minmax | undefined {
    return this._max;
  }
  public set max(value: Minmax | undefined) {
    this._max = value;
  }

  public get show(): boolean {
    return this._show;
  }
  public set show(value: boolean) {
    this._show = value;
  }

  protected get boundaryGap(): boolean | number[] {
    return this._type === "category" ? true : [0, 0];
  }

  protected get splitNumber(): number | "auto" {
    return this._splitNumber;
  }
  protected set splitNumber(value: number | "auto") {
    this._splitNumber = value;
  }

  public toEchartOption(): Axis {
    return {
      name: this._name,
      data: this._data,
      nameGap: this._nameGap,
      boundaryGap: this.boundaryGap,
      nameLocation: "center",
      show: this._show,
      scale: this._scale,
      min: this._min,
      max: this._max,
    };
  }
}
