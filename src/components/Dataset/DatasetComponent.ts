import { EChartOption } from "echarts";
import { DataParam } from "@/types/Param";
import { flow, flatten, min, max, compact, isNil, map } from "lodash/fp";
import { DataItem } from "@/types/DataItem";
import { checkArrayType } from "@/utils/misc";
import { AbstractComponent } from "../AbstractComponent";

export type Dataset = EChartOption.Dataset;

export interface PlotDatasetInfo {
  dimensionName?: string;
  facetName?: string;
  subgroupName?: string;
  categoryName?: string;
}
export class DatasetComponent extends AbstractComponent<Dataset> {
  constructor(
    private source: DataItem[],
    private dimensions: string[],
    private info: PlotDatasetInfo,
  ) {
    super();
    this.optionName = "dataset";
  }

  public getEChartOptionDataset(): EChartOption.Dataset {
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
    datasets: DatasetComponent[],
    dataParams: DataParam[],
  ): [number, number] {
    const chain = flow(
      map((dataset: DatasetComponent) =>
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
        dataParams.map((param) => source.map((data) => data[param.name])),
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

  public toEChartOption(): Dataset {
    return {
      id: this.id,
      source: this.source,
      dimensions: this.dimensions.length === 0 ? undefined : this.dimensions,
    };
  }
}
