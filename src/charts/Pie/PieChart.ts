import { BaseChartConfig } from "../BaseChartConfig";
import { AbstractChart, ChartComponent } from "../AbstractChart";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { DataItem } from "@/types/DataItem";
import { EChartOption } from "echarts";
import {
  DatasetBuilder,
  DatasetConfig,
} from "@/components/Dataset/DatasetBuilder";
import {
  PieSeriesGroupBuilder,
  PieSeriesGroupConfig,
} from "./components/PieSeriesGroupBuilder";
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { LayoutConfig } from "@/components/Layout/LayoutConfig";
import { DataParam } from "@/types/Param";
import { PieTitleGroupBuilder } from "./components/PieTitleGroupBuilder";
import { compact } from "lodash";

export type PieType = "round" | "radar" | "ring";

export interface PieChartConfig
  extends Omit<BaseChartConfig, "dimensionParam"> {
  categoryParam: DataParam;
  layout: LayoutConfig;
  pieType: PieType;
  toggleLabel: boolean;
}

export class PieChart extends AbstractChart<PieChartConfig> {
  protected seriesType: SeriesType = "pie";
  protected titleGroupBuilder!: PieTitleGroupBuilder;

  constructor(protected data: DataItem[], protected config: PieChartConfig) {
    super(data, config);
    super.constructComponentBuilders();

    config = {
      ...config,
      // update layout
      layout: {
        rows: this.gridBuilder.getRows(),
        cols: this.gridBuilder.getCols(),
      },
    };
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      this.seriesType,
      config,
    );
    this.titleGroupBuilder = this.constructTitleGroupBuilder(this.config);
  }

  protected constructDatasetBuilder(
    data: DataItem[],
    config: PieChartConfig,
  ): DatasetBuilder {
    const datasetConfig: DatasetConfig = {
      valueParams: config.valueParams,
      dimensionParam: config.categoryParam,
      facetParam: config.facetParam,
      orderBy: config.orderBy,
    };
    return new DatasetBuilder(data, datasetConfig);
  }

  protected constructSeriesGroupBuilder(
    seriesType: SeriesType,
    config: PieChartConfig,
  ): SeriesGroupBuilder {
    const seriesGroupConfig: PieSeriesGroupConfig = {
      type: seriesType,
      valueParams: config.valueParams,
      categoryParam: config.categoryParam,
      layout: config.layout,
    };

    return new PieSeriesGroupBuilder(seriesGroupConfig);
  }

  protected constructTitleGroupBuilder(
    config: PieChartConfig,
  ): PieTitleGroupBuilder {
    const titleGroupConfig = config.title;
    return new PieTitleGroupBuilder(titleGroupConfig);
  }

  public updateChartByConfig(newConfig: BaseChartConfig): void {
    // TODO
  }
  protected getChartComponents(): ChartComponent[] {
    const gridComponent = this.gridBuilder.build();
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const pageIndex = this.config.pageIndex;
    const paginateDatasets = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageSize,
      pageIndex,
    );
    const seriesGroupComponent = this.seriesGroupBuilder.build(
      paginateDatasets,
    );
    const titleGroupComponent = this.titleGroupBuilder.build(
      seriesGroupComponent,
      this.config.layout,
    );

    return compact([gridComponent, seriesGroupComponent, titleGroupComponent]);
  }
}
