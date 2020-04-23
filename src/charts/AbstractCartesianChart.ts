import {
  DatasetConfig,
  DatasetBuilder,
} from "@/components/Dataset/DatasetBuilder";
import { DataItem } from "@/types/DataItem";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { GridBuilder, GridConfig } from "@/components/Grid/GridBuilder";
import { AxisComponent } from "@/components/Axis/AxisComponent";
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { SeriesGroupConfig } from "@/components/Series/SeriesConfig";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { EChartOption } from "echarts";
import { AbstractComponent, ChartOption } from "@/components/AbstractComponent";
import { isNil, isArray } from "lodash";
import { BaseChartConfig } from "./BaseChartConfig";

export abstract class AbstractCartesianChart<
  T extends BaseChartConfig = BaseChartConfig
> {
  protected datasetBuilder!: DatasetBuilder;
  protected gridBuilder!: GridBuilder;
  protected xAxisGroupBuilder!: AxisGroupBuilder;
  protected yAxisGroupBuilder!: AxisGroupBuilder;
  protected seriesGroupBuilder!: SeriesGroupBuilder;
  protected seriesType!: SeriesType;
  protected plotDatasets!: DatasetComponent[];

  constructor(protected data: DataItem[], protected config: T) {}

  public constructBuilders(): void {
    this.datasetBuilder = this.constructDatasetBuilder(this.data, this.config);
    this.plotDatasets = this.datasetBuilder.getDatasets();
    const facetNames = DatasetBuilder.getNamesWithParam("facetName")(
      this.plotDatasets,
    );
    this.gridBuilder = this.constructGridBuilder(
      facetNames.length,
      this.config,
    );
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const pageIndex = this.config.pageIndex;
    const paginateDatasets = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageSize,
      pageIndex,
    );

    this.xAxisGroupBuilder = this.constructXAxisGroupBuilder(
      paginateDatasets,
      this.config,
      this.gridBuilder.getCols(),
    );
    this.yAxisGroupBuilder = this.constructYAxisGroupBuilder(
      paginateDatasets,
      this.config,
      this.gridBuilder.getRows(),
    );
    const xAxisGroup = this.xAxisGroupBuilder.build();
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      paginateDatasets,
      this.seriesType,
      xAxisGroup,
      this.config,
    );
  }

  public constructDatasetBuilder(data: DataItem[], config: T): DatasetBuilder {
    const datasetConfig: DatasetConfig = {
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
      facetParam: config.facetParam,
      categoryParam: config.categoryParam,
      subgroupParam: config.subgroupParam,
      orderBy: config.orderBy,
    };
    return new DatasetBuilder(data, datasetConfig);
  }

  public constructGridBuilder(facetCount: number, config: T): GridBuilder {
    const gridConfig: GridConfig = {
      facetCount,
      ...config.layout,
    };
    return new GridBuilder(gridConfig);
  }

  public constructXAxisGroupBuilder(
    datasets: DatasetComponent[],
    config: T,
    count: number,
  ): AxisGroupBuilder {
    const axisGroupConfig: AxisGroupConfig = {
      axis: "x",
      dataParams: [config.dimensionParam],
      isDimension: true,
      count,
      ...config.xAxisConfig,
    };
    const xAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return xAxisGroupBuilder;
  }

  public constructYAxisGroupBuilder(
    datasets: DatasetComponent[],
    config: BaseChartConfig,
    count: number,
  ): AxisGroupBuilder {
    const axisGroupConfig: AxisGroupConfig = {
      axis: "y",
      dataParams: config.valueParams,
      isDimension: false,
      count,
      ...config.yAxisConfig,
    };
    const yAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return yAxisGroupBuilder;
  }

  public constructSeriesGroupBuilder(
    datasets: DatasetComponent[],
    seriesType: SeriesType,
    axisGroup: AxisComponent[],
    config: T,
  ): SeriesGroupBuilder {
    const seriesGroupConfig: SeriesGroupConfig = {
      axisGroup: axisGroup,
      type: seriesType,
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
    };

    return new SeriesGroupBuilder(datasets, seriesGroupConfig);
  }

  public abstract compareConfig(newConfig: BaseChartConfig): void;
  public abstract buildEChartOption(): EChartOption;

  protected generateEChartOptionWithPipeline(
    pipeline: (
      | AbstractComponent<ChartOption>
      | AbstractComponent<ChartOption>[]
      | null
    )[],
  ): EChartOption {
    return pipeline.reduce(
      (
        option: any,
        component:
          | AbstractComponent<ChartOption>
          | AbstractComponent<ChartOption>[]
          | null,
      ) => {
        let field;
        if (isNil(component)) {
          return option;
        }
        if (isArray(component)) {
          const components = component;
          const optionName = components[0].getFieldName();
          field = {
            [optionName]: components.map(
              (com: AbstractComponent<ChartOption>) => com.toEchartOption(),
            ),
          };
        } else {
          const optionName = component.getFieldName();
          field = { [optionName]: component.toEchartOption() };
        }
        return {
          ...option,
          ...field,
        };
      },
      {},
    );
  }

  public toJson(): string {
    const option = this.buildEChartOption();
    return JSON.stringify(option, null, 2);
  }
}
