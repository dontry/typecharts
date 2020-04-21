import { AxisComponent } from "../Axis/AxisComponent";
import { DataParam } from "@/types/Param";
import { Color } from "@/types/Color";
import { SeriesType } from "./SeriesComponent";

export interface SeriesGroupConfig {
  axisGroup: AxisComponent[];
  type: SeriesType;
  valueParams: DataParam[];
  dimensionParam: DataParam;
  colors?: Color[];
  custom?: any;
}
