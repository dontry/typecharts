import { TitleConfig } from "@/components/Title/TitleConfig";
import { LegendConfig } from "@/components/Legend/LegendConfig";
import { LayoutConfig } from "./Layout/LayoutConfig";
import { ColorConfig } from "./Color/ColorConfig";
import { Dimension } from "@/types/DataParam";
import { DataParam } from "@/types/Param";

export interface BaseConfig<T> {
  valueParams: DataParam[];
  dimensionParam: DataParam;
  subgroupName: string;
  facetName: string;
  layout: LayoutConfig;
  pageIndex: number;
  subtitle: TitleConfig;
  color: ColorConfig;
  legend: LegendConfig;
}
