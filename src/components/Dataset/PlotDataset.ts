import { EChartOption } from "echarts";
import { v4 as uuid } from "uuid";
import { DataParam } from "@/types/Param";
import { flow, flatten, min, max, compact, isNil, map } from "lodash/fp";
import { DataItem } from "@/types/DataItem";
import { checkArrayType } from "@/utils/misc";

export interface PlotDatasetInfo {
  dimension?: string;
  facet?: string;
  subgroup?: string;
  category?: string;
}
export class PlotDataset {
  private id: string;
  constructor(
    private source: DataItem[],
    private dimensions: string[],
    private info: PlotDatasetInfo,
  ) {
    this.id = uuid();
  }

  public getEchartOptionDataset(): EChartOption.Dataset {
    return {
      id: this.id,
      source: this.source,
      dimensions: this.dimensions,
    };
  }

  public getInfo(): PlotDatasetInfo {
    return this.info;
  }

  public getSource(): DataItem[] {
    return this.source;
  }

  public static getMinmaxOfDatasets(
    datasets: PlotDataset[],
    dataParams: DataParam[],
  ): [number, number] {
    const chain = flow(
      map((dataset: PlotDataset) =>
        this.getMinmaxListOfSource(dataset.source, dataParams),
      ),
      flatten,
      compact,
    );
    const minmaxList = chain(datasets);
    const _min = min(minmaxList) || -Infinity;
    const _max = max(minmaxList) || +Infinity;
    return [_min, _max];
  }

  public static getMinmaxListOfSource(
    source: DataItem[],
    dataParams: DataParam[],
  ): [number, number] {
    const paramData = compact(
      flatten(
        dataParams.map((param) => source.map((data) => data[param.title])),
      ),
    );
    if (checkArrayType(paramData, "number") && !isNil(paramData)) {
      const _min = min(paramData as number[]) || NaN;
      const _max = max(paramData as number[]) || NaN;

      return [_min, _max];
    } else {
      throw Error("data source type should be number");
    }
  }
}
