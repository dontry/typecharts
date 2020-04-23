import { LabelFormatter } from "@/types/LabelFormatter";
import { Interval } from "@/types/Interval";
import { Minmax } from "@/types/Minmax";

export interface AxisConfig {
  name?: string;
  scale: boolean;
  show: boolean;
  min?: Minmax;
  max?: Minmax;
  nameGap?: number;
  fontSize?: number;
  label?: {
    visible: boolean;
    formatter: LabelFormatter;
    fontSize: number;
    direction: number;
    interval: Interval;
  };
  tick?: {};
}
