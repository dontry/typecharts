import { AxisComponent } from "../Axis/AxisComponent";
import { DataParam } from "@/types/Param";
import { Color } from "@/types/Color";
import { SeriesType } from "./SeriesComponent";

export interface SeriesGroupConfig {
  type: SeriesType;
  valueParams: DataParam[];
}

export interface CartesianSeriesGroupConfig extends SeriesGroupConfig {
  dimensionParam: DataParam;
  axisGroup?: AxisComponent[];
  colors?: Color[];
  custom?: any;
}
