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

export type ChartOption = Dataset | Grid[] | Axis | Series[] | Legend;

export interface BaseChartConfig {
  valueParams: DataParam[];
  dimensionParam?: DataParam;
  categoryParam?: DataParam;
  subgroupParam?: DataParam;
  facetParam?: DataParam;
  orderBy?: string;
  layout?: LayoutConfig;
  pageIndex?: number;
  subtitle?: TitleConfig;
  color?: ColorConfig;
  legend?: LegendConfig;
}
