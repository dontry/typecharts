import { TitleConfig } from "@/components/Title/TitleConfig";
import { LegendConfig } from "@/components/Legend/LegendConfig";
import { LayoutConfig } from "@/components/Layout/LayoutConfig";
import { ColorConfig } from "@/components/Color/ColorConfig";
import { DataParam } from "@/types/Param";
import { Dataset } from "@/components/Dataset/DatasetComponent";
import { Grid } from "@/components/Grid/GridComponent";
import { Axis } from "@/components/Axis/AxisComponent";
import { Series } from "@/components/Series/SeriesComponent";
import { Legend } from "@/components/Legend/LegendComponent";
import { Minmax } from "@/types/Minmax";

export type ChartOption = Dataset | Grid[] | Axis | Series[] | Legend;

export interface BaseChartConfig {
  valueParams: DataParam[];
  dimensionParam: DataParam;
  categoryParam?: DataParam;
  subgroupParam?: DataParam;
  facetParam?: DataParam;
  orderBy?: string;
  xAxisConfig: {
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
  yAxisConfig: {
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
  layout?: LayoutConfig;
  pageIndex?: number;
  subtitle?: TitleConfig;
  color?: ColorConfig;
  legend?: LegendConfig;
}
