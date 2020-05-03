import { BaseChartConfig } from "./BaseChartConfig";
import {
  DatasetBuilder,
  DatasetConfig,
} from "@/components/Dataset/DatasetBuilder";
import { GridBuilder, GridConfig } from "@/components/Grid/GridBuilder";
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { DataItem } from "@/types/DataItem";
import { EChartOption } from "echarts";
import { AxisComponent } from "@/components/Axis/AxisComponent";
import { AbstractComponent, ChartOption } from "@/components/AbstractComponent";
import { isArray, isNil } from "lodash";

export abstract class AbstractChart<
  T extends BaseChartConfig = BaseChartConfig
> {
  protected datasetBuilder!: DatasetBuilder;
  protected gridBuilder!: GridBuilder;
  protected seriesGroupBuilder!: SeriesGroupBuilder;
  protected seriesType!: SeriesType;
  protected plotDatasets!: DatasetComponent[];

  constructor(protected data: DataItem[], protected config: T) {}

  public constructComponentBuilders(): void {
    this.datasetBuilder = this.constructDatasetBuilder(this.data, this.config);
    this.plotDatasets = this.datasetBuilder.getDatasets();
    const facetNames = DatasetBuilder.getNamesWithParam("facetName")(
      this.plotDatasets,
    );
    this.gridBuilder = this.constructGridBuilder(
      facetNames.length,
      this.config,
    );
  }

  public constructGridBuilder(facetCount: number, config: T): GridBuilder {
    const gridConfig: GridConfig = {
      facetCount,
      ...config.layout,
    };
    return new GridBuilder(gridConfig);
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

  public abstract constructSeriesGroupBuilder(
    datasets: DatasetComponent[],
    seriesType: SeriesType,
    config: T,
    axisGroup: AxisComponent[],
  ): SeriesGroupBuilder;

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
          const optionName = components[0].getOptionName();
          field = {
            [optionName]: components.map(
              (com: AbstractComponent<ChartOption>) => com.toEChartOption(),
            ),
          };
        } else {
          const optionName = component.getOptionName();
          field = { [optionName]: component.toEChartOption() };
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

  public abstract compareConfig(newConfig: BaseChartConfig): void;
  public abstract buildEChartOption(): EChartOption;
}
