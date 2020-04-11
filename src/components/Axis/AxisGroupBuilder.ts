import { AxisComponent } from "./AxisComponent";
import {
  AxisDimension,
  AxisType,
  AxisBuilder,
  AxisComponentConfig,
} from "./AxisBuilder";
import { DataParam } from "@/types/Param";
import { EChartOption } from "echarts";
import { flow, map, uniq, compact, sortBy } from "lodash/fp";
import { PlotDataset } from "../Dataset/PlotDataset";
import { Minmax } from "@/types/Minmax";
import { DataSourceType } from "@/types/DataSourceType";
import { NiceScale } from "@/utils/NiceScale";
import { isNil } from "lodash";
import { DataItem } from "@/types/DataItem";
import { naturalSort } from "@/utils/misc";

export enum AxisTypeEnum {
  string = "category",
  number = "value",
  date = "category",
}

export interface AxisGroupConfig {
  datasets: PlotDataset[];
  axis: AxisDimension;
  dimensionParam: DataParam;
  count: number;
  name: string;
  data: (number | string)[];
  onZero: boolean;
  custom: EChartOption.BasicComponents.CartesianAxis;
  uniformMinmax: boolean;
  scale: boolean;
  show: boolean;
}

export class AxisGroupBuilder {
  private uniformAxisRange: [Minmax, Minmax] | undefined;
  constructor(private config: AxisGroupConfig) {}

  private getFacetNamesFromDatasets(datasets: PlotDataset[]): string[] {
    const chain = flow(
      map(this.getFacetNameFromDataset),
      uniq,
      compact,
      // TODO: naturalSort
    );
    return chain(datasets);
  }

  private getFacetNameFromDataset(dataset: PlotDataset): string {
    return dataset.getInfo().facet || dataset.getInfo().dimension || "";
  }

  private getAxisType(dimension: DataParam): AxisType {
    if (dimension.type === "date" && !dimension.aggregation) {
      return "time";
    }
    return AxisTypeEnum[dimension.type];
  }

  private calculateAxisData(
    axisData: DataSourceType[] | DataSourceType[][],
    index: number,
    dimensionParam: DataParam,
    source: DataItem[],
  ): DataSourceType[] | undefined {
    let result: DataSourceType[];
    if (!isNil(axisData)) {
      if (axisData[index] instanceof Array) {
        result = axisData[index] as DataSourceType[]; // FIXME: type guards of array
      } else {
        result = axisData as DataSourceType[];
      }
    } else {
      //if(dimensionParam.type === "date"  && dimensionParam.aggregation! in DATE_AGGREGATION ) {
      const key = dimensionParam.type === "date" ? "date" : undefined; //(a: DateItem,  b: DateItem) => a.date - b.date : undefined;
      result = this.getSubgroupsFromSource(source, dimensionParam, key);
    }
    return result;
  }

  private getSubgroupsFromSource(
    source: DataItem[],
    dimensionParam: DataParam,
    key?: string,
  ): DataSourceType[] {
    if (!isNil(key)) {
      const chain = flow(
        sortBy(key),
        map((r: DataItem) => r[dimensionParam.title]),
        uniq,
        compact,
      );
      return chain(source);
    } else {
      const chain = flow(
        map((r: DataItem) => r[dimensionParam.title]),
        uniq,
        compact,
      );
      return naturalSort(chain(source));
    }
  }

  build(): (AxisComponent | null)[] {
    // TODO: cache some variables
    const {
      datasets,
      uniformMinmax,
      dimensionParam,
      onZero,
      axis,
      data,
      count,
      scale,
      show,
    } = this.config;
    const facetNames = this.getFacetNamesFromDatasets(datasets);
    const axisType = this.getAxisType(dimensionParam);

    let overallNiceScale: NiceScale | undefined;

    if (uniformMinmax === true && axisType === "value") {
      const [min, max] = PlotDataset.getMinmaxOfDatasets(datasets, [
        dimensionParam,
      ]);
      overallNiceScale = new NiceScale(min, max, onZero);
    }

    const axisGroup = datasets.map((dataset: PlotDataset, index: number) => {
      const facetName = this.getFacetNameFromDataset(dataset);
      const facetIndex = facetName ? facetNames.indexOf(facetName) : 0;

      let axisNiceScale: NiceScale | undefined = overallNiceScale;

      if (uniformMinmax === false && axisType === "value") {
        const [
          _min,
          _max,
        ] = PlotDataset.getMinmaxListOfSource(dataset.getSource(), [
          dimensionParam,
        ]);

        axisNiceScale = new NiceScale(_min, _max, onZero);
      }
      let axisMin, axisMax;
      if (axisNiceScale) {
        const [_min, _max] = axisNiceScale.calculate();
        axisMin = _min;
        axisMax = _max;
      }

      const axisData = this.calculateAxisData(
        data,
        index,
        dimensionParam,
        dataset.getSource(),
      );

      const axisConfig: AxisComponentConfig = {
        data: axisData,
        type: axisType,
        axisDimension: axis,
        gridIndex: facetIndex,
        min: axisMin,
        max: axisMax,
        count: count,
        name: facetName,
        show: show,
        scale: scale,
      };
      const axisComponent = new AxisBuilder(axisConfig).build();
      return axisComponent;
    });

    return axisGroup;
  }
}
