import { EChartOption } from "echarts";
export type DataValue =
  | string
  | number
  | EChartOption.BasicComponents.CartesianAxis.DataObject;
export interface DataItem {
  [key: string]: DataValue;
}

export interface DateItem extends DataItem {
  date: number;
}
