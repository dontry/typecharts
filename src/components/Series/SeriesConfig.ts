import { AxisComponent } from "../Axis/AxisComponent";
import { SeriesType } from "@/types/Series";
import { DataParam } from "@/types/Param";
import { Color } from "@/types/Color";

export interface SeriesGroupConfig {
  axisGroup: AxisComponent[];
  type: SeriesType;
  valueParams: DataParam[];
  dimensionParam: DataParam;
  colors?: Color[];
  custom?: any;
}
