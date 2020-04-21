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
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { SeriesGroupConfig } from "@/components/Series/SeriesConfig";
import { AxisComponent } from "@/components/Axis/AxisComponent";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { EChartOption } from "echarts";
import { AbstractComponent, ChartOption } from "@/components/AbstractComponent";
import { isNil, isArray } from "lodash";
import { BaseChartConfig } from "./BaseChartConfig";

export abstract class AbstractCartesianChartBuilder<
  T extends BaseChartConfig = BaseChartConfig
> {
  protected datasetBuilder: DatasetBuilder;
  protected gridBuilder: GridBuilder;
  protected xAxisGroupBuilder: AxisGroupBuilder;
  protected yAxisGroupBuilder: AxisGroupBuilder;
  protected seriesGroupBuilder: SeriesGroupBuilder;
  protected seriesType!: SeriesType;
  protected plotDatasets: DatasetComponent[];

  constructor(protected data: DataItem[], protected config: T) {
    this.datasetBuilder = this.protected(data, config);
    this.plotDatasets = this.datasetBuilder.getDatasets();
    const facetNames = DatasetBuilder.getNamesWithParam("facetName")(
      this.plotDatasets,
    );
    this.gridBuilder = this.constructGridBuilder(facetNames.length, config);
    this.xAxisGroupBuilder = this.constructXAxisGroupBuilder(
      this.plotDatasets,
      config,
      this.gridBuilder.getCols(),
    );
    this.yAxisGroupBuilder = this.constructYAxisGroupBuilder(
      this.plotDatasets,
      config,
      this.gridBuilder.getRows(),
    );
    const xAxisGroup = this.xAxisGroupBuilder.build();
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      this.plotDatasets,
      this.seriesType,
      xAxisGroup,
      config,
    );
  }

  public protected(data: DataItem[], config: T): DatasetBuilder {
    const datasetConfig: DatasetConfig = {
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
      facetParam: config.facetParam,
      subgroupParam: config.subgroupParam,
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
      dataParams: [config.dimensionParam],
      isDimension: false,
      count,
      ...config.xAxisConfig,
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
          const fieldName = components[0].getFieldName();
          field = {
            [fieldName]: components.map((com: AbstractComponent<ChartOption>) =>
              com.toEchartOption(),
            ),
          };
        } else {
          const fieldName = component.getFieldName();
          field = { [fieldName]: component };
        }
        return {
          ...option,
          field,
        };
      },
      {},
    );
  }
}
