import { IconType } from "./IconType";

export type SeriesType = "bar" | "line" | "pie";
export interface Series {
  type: SeriesType;
  name: string;
  xAxisIndex: number;
  yAxisIndex: number;
  id?: string;
  symbol?: IconType;
  symbolSize?: number;
  cursor?: "pointer" | "not-allow";
  sampling?: "average" | "max" | "min" | "sum";
}
