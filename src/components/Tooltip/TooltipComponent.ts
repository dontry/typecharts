import { AbstractComponent } from "../AbstractComponent";
import { EChartOption } from "echarts";
import { Trigger } from "./TooltipConfig";

export type Tooltip = EChartOption.Tooltip;
export type Format = EChartOption.Tooltip.Format;
export type Formatter = EChartOption.Tooltip.Formatter;

export class TooltipComponent extends AbstractComponent<Tooltip> {
  protected _show = false;
  protected _trigger!: Trigger;
  protected _formatter!: Formatter;

  constructor() {
    super();
    this.fieldName = "tooltip";
  }

  public get show(): boolean {
    return this._show;
  }
  public set show(value: boolean) {
    this._show = value;
  }
  public get formatter(): Formatter {
    return this._formatter;
  }
  public set formatter(value: Formatter) {
    this._formatter = value;
  }
  public get trigger(): "item" | "axis" | "none" {
    return this._trigger;
  }
  public set trigger(value: "item" | "axis" | "none") {
    this._trigger = value;
  }

  public toEChartOption(): EChartOption.Tooltip {
    return {
      show: this._show,
      trigger: this._trigger,
      formatter: this._formatter,
    };
  }
}
