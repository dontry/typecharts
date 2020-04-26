import { BaseChartConfig } from "../BaseChartConfig";
import { AbstractChart } from "../AbstractChart";
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
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { SeriesGroupBuilder } from "@/components/Series/SeriesGroupBuilder";
import { LayoutConfig } from "@/components/Layout/LayoutConfig";
import { DataParam } from "@/types/Param";

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

  constructor(protected data: DataItem[], protected config: PieChartConfig) {
    super(data, config);
    super.constructComponentBuilders();
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const pageIndex = this.config.pageIndex;
    const paginateDatasets = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageSize,
      pageIndex,
    );
    config = {
      ...config,
      // update layout
      layout: {
        rows: this.gridBuilder.getRows(),
        cols: this.gridBuilder.getCols(),
      },
    };
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      paginateDatasets,
      this.seriesType,
      config,
    );
  }

  public constructDatasetBuilder(
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

  public constructSeriesGroupBuilder(
    datasets: DatasetComponent[],
    seriesType: SeriesType,
    config: PieChartConfig,
  ): SeriesGroupBuilder {
    const seriesGroupConfig: PieSeriesGroupConfig = {
      type: seriesType,
      valueParams: config.valueParams,
      categoryParam: config.categoryParam,
      layout: config.layout,
    };

    return new PieSeriesGroupBuilder(datasets, seriesGroupConfig);
  }

  public compareConfig(newConfig: BaseChartConfig): void {
    // TODO
  }
  public buildEChartOption(): EChartOption {
    const gridComponent = this.gridBuilder.build();
    const seriesGroupComponent = this.seriesGroupBuilder.build();

    const pipeline = [gridComponent, seriesGroupComponent];

    return this.generateEChartOptionWithPipeline(pipeline);
  }
}
