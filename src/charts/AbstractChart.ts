import { BaseChartConfig } from "./BaseChartConfig";
import {
  DatasetBuilder,
  DatasetConfig,
} from "@/components/Dataset/DatasetBuilder";
import { GridBuilder, GridBuilderConfig } from "@/components/Grid/GridBuilder";
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { DataItem } from "@/types/DataItem";
import { EChartOption } from "echarts";
import { AbstractComponent, ChartOption } from "@/components/AbstractComponent";
import { isArray, isNil } from "lodash";

export type ChartComponent =
  | AbstractComponent<ChartOption>
  | AbstractComponent<ChartOption>[];

export abstract class AbstractChart<
  T extends BaseChartConfig = BaseChartConfig
> {
  protected datasetBuilder!: DatasetBuilder;
  protected gridBuilder!: GridBuilder;
  protected seriesGroupBuilder!: SeriesGroupBuilder;
  protected seriesType!: SeriesType;
  protected plotDatasets!: DatasetComponent[];

  constructor(protected data: DataItem[], protected config: T) {}

  public buildEChartOption(): EChartOption {
    const components = this.getChartComponents();
    return this.generateEChartOptionByComponents(components);
  }

  protected constructComponentBuilders(): void {
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

  protected constructGridBuilder(facetCount: number, config: T): GridBuilder {
    const gridConfig: GridBuilderConfig = {
      facetCount,
      ...config.layout,
    };
    return new GridBuilder(gridConfig);
  }

  protected constructDatasetBuilder(
    data: DataItem[],
    config: T,
  ): DatasetBuilder {
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

  protected toJson(): string {
    const option = this.buildEChartOption();
    return JSON.stringify(option, null, 2);
  }

  protected abstract constructSeriesGroupBuilder(
    seriesType: SeriesType,
    config: T,
    datasets?: DatasetComponent[],
  ): SeriesGroupBuilder;

  protected generateEChartOptionByComponents(
    pipeline: ChartComponent[],
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
          if (component.length > 0) {
            const components = component;
            const fieldName = components[0].getFieldName();
            field = {
              [fieldName]: components.map(
                (com: AbstractComponent<ChartOption>) => com.toEChartOption(),
              ),
            };
          }
        } else {
          const fieldName = component.getFieldName();
          field = { [fieldName]: component.toEChartOption() };
        }
        return {
          ...option,
          ...field,
        };
      },
      {},
    );
  }

  protected abstract updateChartByConfig(newConfig: BaseChartConfig): void;

  protected abstract getChartComponents(): ChartComponent[];
}
