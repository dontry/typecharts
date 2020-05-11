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
import { flow, map, uniq, sortBy, groupBy, toPairs } from "lodash/fp";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { DataSourceType as DataSourceItem } from "@/types/DataSourceType";
import { NiceScale } from "@/utils/NiceScale";
import { isNil, compact, flatten } from "lodash";
import { DataItem, DataValue } from "@/types/DataItem";
import { naturalSort } from "@/utils/misc";
import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { DateTimeDataSource } from "../DataSource/DateTimeDataSource";

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
  public static createNiceScale(
    datasets: DatasetComponent[],
    dataParams: DataParam[],
    onZero: boolean,
  ): NiceScale {
    const [min, max] = DatasetComponent.getMinmaxOfDatasets(
      datasets,
      dataParams,
    );
    return new NiceScale(min, max, onZero);
  }

  constructor(
    protected datasets: DatasetComponent[],
    protected config: AxisGroupConfig,
  ) {
    super(config);
  }

  public initializeComponent(): void {
    return;
  }

  private getFacetNamesFromDatasets(datasets: DatasetComponent[]): string[] {
    const chain = flow(
      map(this.getFacetNameFromDataset),
      compact,
      uniq,
      naturalSort, // should return string
    );
    return chain(datasets) as string[];
  }

  private getFacetNameFromDataset(
    dataset: DatasetComponent,
  ): string | undefined {
    return dataset.getInfo().facetName;
  }

  private getSeriesNameFromDataset(
    dataset: DatasetComponent,
  ): string | undefined {
    return (
      dataset.getInfo().facetName ||
      dataset.getInfo().categoryName ||
      dataset.getInfo().dimensionName
    );
  }

  private getAxisType(dimension: DataParam): AxisType {
    if (dimension.type === "date" && !dimension.aggregation) {
      return "time";
    }
    return AxisTypeEnum[dimension.type];
  }

  private calculateDimensionData(
    source: DataItem[],
    dimensionParam: DataParam,
    axisData?: DataSourceItem[] | DataSourceItem[][],
    axisDataIndex?: number,
  ): DataSourceItem[] {
    let dimensionData: DataSourceItem[];
    if (!isNil(axisData)) {
      if (!isNil(axisDataIndex) && axisData[axisDataIndex] instanceof Array) {
        dimensionData = (axisData[axisDataIndex] as DataItem[]).map(
          (data) => data[dimensionParam.name],
        );
      } else {
        dimensionData = (axisData as DataItem[]).map(
          (data) => data[dimensionParam.name],
        );
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
    if (dimensionParam.type === "date") {
      const key = DateTimeDataSource.FORMATTED_TIMESTAMP;
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

    let overallNiceScale: NiceScale | undefined = undefined;
    if (
      this.shouldCreateOverallNiceScale(
        facetNames.length,
        axisType,
        uniformMinmax,
      )
    ) {
      overallNiceScale = AxisGroupBuilder.createNiceScale(
        this.datasets,
        dataParams,
        onZero,
      );
    }

    let axisGroup: AxisComponent[] = [];

    // not facet
    if (facetNames.length === 0) {
      // dimension axis should be retrieved from data source
      let axisMin, axisMax, axisData;
      if (axisType === "value" && !isNil(overallNiceScale)) {
        [axisMin, axisMax] = overallNiceScale.calculate();
      }

      if (isDimension && axisType !== "value") {
        const data = flatten(
          this.datasets.map((dataset) => dataset.getSource()),
        );
        axisData = this.calculateDimensionData(data, dataParams[0]);
      }

      const dimensionName = this.datasets[0].getInfo().dimensionName;
      const axisConfig: AxisComponentConfig = {
        data: axisData,
        type: axisType,
        axisDimension: axis,
        gridIndex: 0,
        min: axisMin,
        max: axisMax,
        count: count,
        identifier: dimensionName,
        name: name,
        show: show,
        scale: scale,
      };
      const axisComponent = new AxisBuilder(axisConfig).build();
      return axisComponent ? [axisComponent] : [];
    }

    let axisIndex = 0;
    const chain = flow(
      groupBy((dataset: DatasetComponent) =>
        this.getFacetNameFromDataset(dataset),
      ),
      toPairs,
      map(([facetName, datasets]: [string, DatasetComponent[]]) => {
        const facetData = flatten(
          datasets.map((dataset) => dataset.getSource()),
        );
        const facetIndex = facetName ? facetNames.indexOf(facetName) : 0;

        let axisNiceScale: NiceScale | undefined = overallNiceScale;

        if (uniformMinmax === false && axisType === "value") {
          const [_min, _max] = DatasetComponent.getMinmaxListOfSource(
            facetData,
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

        let axisData: DataValue[] | undefined = undefined;
        if (isDimension && axisType !== "value") {
          axisData = this.calculateDimensionData(
            facetData,
            dataParams[0],
            data,
            axisIndex,
          );
          axisIndex++;
        }

        const axisConfig: AxisComponentConfig = {
          data: axisData,
          type: axisType,
          axisDimension: axis,
          gridIndex: facetIndex,
          min: axisMin,
          max: axisMax,
          count: count,
          identifier: facetName,
          name: name,
          show: show,
          scale: scale,
        };
        const axisComponent = new AxisBuilder(axisConfig).build();
        return axisComponent;
      }),
    );

    axisGroup = chain(this.datasets);

    return axisGroup;
  }

  protected shouldCreateOverallNiceScale(
    facetCount: number,
    axisType: AxisType,
    uniformMinmax = true,
  ): boolean {
    return (uniformMinmax || facetCount === 0) && axisType === "value";
  }
}
