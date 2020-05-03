import { VisualMap } from "echarts";
import {
  AbstractVisualMapComponent,
  VisualMapType,
} from "./VisualMapComponent";

export class ContinuousVisualMapComponent extends AbstractVisualMapComponent<
  VisualMap.Continuous
> {
  protected _type: Exclude<VisualMapType, "piecewise"> = "continuous";
  constructor() {
    super();
  }

  public toEChartOption(): VisualMap.Continuous {
    return {
      id: this.id,
      show: this._show,
      type: this._type,
      min: this._min,
      max: this._max,
      range: [this._minRange, this._maxRange],
      precision: this._precision,
      inRange: this.inRange,
      outRange: this.outRange,
      ...this.custom,
    };
  }
}
