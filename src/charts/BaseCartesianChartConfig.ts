import { BaseChartConfig } from "./BaseChartConfig";
import { Minmax } from "@/types/Minmax";
import { DataParam } from "@/types/Param";

export interface BaseCartesianChartConfig extends BaseChartConfig {
  dimensionParam: DataParam;
  xAxis: {
    scale: boolean;
    show: boolean;
    onZero: boolean;
    name?: string;
    uniformMinmax?: boolean;
    min?: Minmax;
    max?: Minmax;
    nameGap?: number;
    fontSize?: number;
  };
  yAxis: {
    name?: string;
    scale: boolean;
    onZero: boolean;
    show: boolean;
    uniformMinmax?: boolean;
    min?: Minmax;
    max?: Minmax;
    nameGap?: number;
    fontSize?: number;
  };
}
