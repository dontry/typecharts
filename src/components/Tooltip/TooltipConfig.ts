import { EChartOption } from "echarts";
import { Formatter } from "./TooltipComponent";

export type Trigger = "item" | "axis" | "none";

export interface TooltipConfig {
  show: boolean;
  trigger: Trigger;
  formatter?: Formatter;
  axisPointer?: EChartOption.AxisPointer;
  showContent?: boolean;
}
