import { AbstractComponent } from "../AbstractComponent";
import { VisualMap } from "echarts";

export type VisualMapType = "continuous" | "piecewise" | undefined;
export type RangeObject = VisualMap.RangeObject;
export type PieceObject = VisualMap.PiecesObject;
export type VisualMap = VisualMap.Continuous | VisualMap.Piecewise;

export interface VisualMapComponentConfig {
  min: number;
  max: number;
  show?: boolean;
  minRange?: number;
  maxRange?: number;
  inRange?: RangeObject;
  outRange?: RangeObject;
  custom?: any;
}

export abstract class AbstractVisualMapComponent<T> extends AbstractComponent<
  T
> {
  protected _min = -Infinity;
  protected _max = +Infinity;
  protected _minRange = -Infinity;
  protected _maxRange = +Infinity;
  protected _precision = 2;
  protected _show = false;
  protected _inRange: RangeObject | undefined = undefined;
  protected _outRange: RangeObject | undefined = undefined;

  constructor() {
    super();
    this.optionName = "visualMap";
  }

  public get min(): number {
    return this._min;
  }

  public set min(value: number) {
    this._min = value;
  }

  public get max(): number {
    return this._max;
  }

  public set max(value: number) {
    this._max = value;
  }

  public get minRange(): number {
    return this._minRange;
  }

  public set minRange(value: number) {
    this._minRange = value;
  }

  public get maxRange(): number {
    return this._maxRange;
  }

  public set maxRange(value: number) {
    this._maxRange = value;
  }

  public get precision(): number {
    return this._precision;
  }

  public set precision(value: number) {
    this._precision = value;
  }

  public get show(): boolean {
    return this._show;
  }
  public set show(value) {
    this._show = value;
  }

  public get inRange(): RangeObject | undefined {
    return this._inRange;
  }
  public set inRange(value: RangeObject | undefined) {
    this._inRange = value;
  }
  public get outRange(): RangeObject | undefined {
    return this._outRange;
  }
  public set outRange(value: RangeObject | undefined) {
    this._outRange = value;
  }
}
