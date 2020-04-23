import {
  Axis,
  AxisComponent,
  AxisComponentConfig,
  AxisDimension,
  AxisType,
} from "./AxisComponent";
import { AxisBuilder } from "./AxisBuilder";
import { DataParam } from "@/types/Param";
import { EChartOption } from "echarts";
import { flow, map, uniq, sortBy } from "lodash/fp";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { DataSourceType as DataSourceItem } from "@/types/DataSourceType";
import { NiceScale } from "@/utils/NiceScale";
import { isNil, compact } from "lodash";
import { DataItem, DataValue } from "@/types/DataItem";
import { naturalSort } from "@/utils/misc";
import { AbstractComponentBuilder } from "../AbstractComponentBuilder";

export enum AxisTypeEnum {
  string = "category",
  number = "value",
  date = "category",
}

export interface AxisGroupConfig {
  axis: AxisDimension;
  dataParams: DataParam[];
  count: number;
  onZero: boolean;
  scale: boolean;
  show: boolean;
  uniformMinmax?: boolean;
  isDimension?: boolean;
  name?: string;
  data?: DataSourceItem[] | DataSourceItem[][];
  custom?: EChartOption.BasicComponents.CartesianAxis;
}

export class AxisGroupBuilder extends AbstractComponentBuilder<
  Axis,
  AxisComponent
> {
  constructor(
    protected datasets: DatasetComponent[],
    protected config: AxisGroupConfig,
  ) {
    super(config);
  }

  private getFacetNamesFromDatasets(datasets: DatasetComponent[]): string[] {
    const chain = flow(
      map(this.getFacetNameFromDataset),
      uniq,
      compact,
      naturalSort, // should return string
    );
    return chain(datasets) as string[];
  }

  private getFacetNameFromDataset(dataset: DatasetComponent): string {
    return dataset.getInfo().facetName || dataset.getInfo().dimensionName || "";
  }

  private getAxisType(dimension: DataParam): AxisType {
    if (dimension.type === "date" && !dimension.aggregation) {
      return "time";
    }
    return AxisTypeEnum[dimension.type];
  }

  private calculateDimensionData(
    index: number,
    dimensionParam: DataParam,
    source: DataItem[],
    axisData?: DataSourceItem[] | DataSourceItem[][],
  ): DataSourceItem[] {
    let dimensionData: DataSourceItem[];
    if (!isNil(axisData)) {
      if (axisData[index] instanceof Array) {
        dimensionData = axisData[index] as DataSourceItem[]; // FIXME: type guards of array
      } else {
        dimensionData = axisData as DataSourceItem[];
      }
    } else {
      dimensionData = this.getDimensionDataFromSource(source, dimensionParam);
    }
    return dimensionData;
  }

  private getDimensionDataFromSource(
    source: DataItem[],
    dimensionParam: DataParam,
  ): DataSourceItem[] {
    // if dimension is date type, then data item should have an extra field data
    const key = dimensionParam.type === "date" ? "date" : undefined;
    if (!isNil(key)) {
      const chain = flow(
        sortBy(key),
        map((r: DataItem) => r[dimensionParam.name]),
        uniq,
        compact,
      );
      return chain(source);
    } else {
      const chain = flow(
        map((r: DataItem) => r[dimensionParam.name]),
        uniq,
        compact,
      );
      return naturalSort(chain(source));
    }
  }

  private shouldGetAxisData(axis: string, data?: DataValue[]): boolean {
    return axis === "x" && data != null;
  }

  public build(): AxisComponent[] {
    const {
      uniformMinmax,
      dataParams,
      onZero,
      axis,
      count,
      scale,
      show,
      data,
      isDimension,
      name,
    } = this.config;
    const facetNames = this.getFacetNamesFromDatasets(this.datasets);
    const axisType = this.getAxisType(dataParams[0]);

    let overallNiceScale: NiceScale;

    if (uniformMinmax === true && axisType === "value") {
      const [min, max] = DatasetComponent.getMinmaxOfDatasets(
        this.datasets,
        dataParams,
      );
      overallNiceScale = new NiceScale(min, max, onZero);
    }

    const axisGroup = compact(
      this.datasets.map((dataset: DatasetComponent, index: number) => {
        const facetName = this.getFacetNameFromDataset(dataset);
        const facetIndex = facetName ? facetNames.indexOf(facetName) : 0;

        let axisNiceScale: NiceScale | undefined = overallNiceScale;

        if (uniformMinmax === false && axisType === "value") {
          const [_min, _max] = DatasetComponent.getMinmaxListOfSource(
            dataset.getSource(),
            dataParams,
          );

          axisNiceScale = new NiceScale(_min, _max, onZero);
        }
        let axisMin, axisMax;
        if (axisNiceScale) {
          const [_min, _max] = axisNiceScale.calculate();
          axisMin = _min;
          axisMax = _max;
        }

        // dimension axis should be retrieved from data source
        const axisData = isDimension
          ? this.calculateDimensionData(
              index,
              dataParams[0],
              dataset.getSource(),
              data,
            )
          : undefined;

        const axisConfig: AxisComponentConfig = {
          data: axisData,
          type: axisType,
          axisDimension: axis,
          gridIndex: facetIndex,
          min: axisMin,
          max: axisMax,
          count: count,
          facetName: facetName,
          name: name,
          show: show,
          scale: scale,
        };
        const axisComponent = new AxisBuilder(axisConfig).build();
        return axisComponent;
      }),
    );

    return axisGroup;
  }
}
