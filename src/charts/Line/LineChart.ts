import { DataItem } from "@/types/DataItem";
import { EntityDiff } from "@/utils/EntityDiff";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { AbstractCartesianChart } from "@/charts/AbstractCartesianChart";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { BaseCartesianChartConfig } from "../BaseCartesianChartConfig";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import {
  CartesianSeriesGroupBuilder,
  CartesianSeriesGroupConfig,
} from "@/components/Series/CartesianSeriesGroupBuilder";
import { Sampling } from "@/types/Sampling";
import { mean, compact } from "lodash";
import { ChartComponent } from "../AbstractChart";

export interface LineChartConfig extends BaseCartesianChartConfig {
  isStacked?: boolean;
  isSolid?: boolean;
  sampling?: Sampling;
}

export class LineChart extends AbstractCartesianChart<LineChartConfig> {
  private static SAMPLING_THRESHOLD = 1000;
  protected seriesType: SeriesType = "line";
  constructor(protected data: DataItem[], protected config: LineChartConfig) {
    super(data, config);
    super.constructComponentBuilders();
    this.tooltipBuilder = this.constructTooltipBuilder(this.config, "axis");
  }

  protected updateChartByConfig(newConfig: LineChartConfig): void {
    const diff = new EntityDiff(this.config, newConfig);
    // TODO: Update chart based on diff;
    this.config = newConfig;
  }

  protected constructSeriesGroupBuilder(
    seriesType: SeriesType,
    config: LineChartConfig,
    datasets: DatasetComponent[],
  ): CartesianSeriesGroupBuilder {
    const seriesGroupConfig: CartesianSeriesGroupConfig = {
      type: seriesType,
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
    };
    const sampling = this.getSampling(datasets, config.sampling);
    const stack = config.isStacked && "stack";
    const areaStyle = config.isSolid && { origin: "start" };

    seriesGroupConfig.custom = {
      ...config.custom?.series,
      stack,
      sampling,
      areaStyle,
    };
    return new CartesianSeriesGroupBuilder(seriesGroupConfig);
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
    const xAxisGroupComponent = this.xAxisGroupBuilder.build(paginateDatasets);
    const yAxisGroupComponent = this.yAxisGroupBuilder.build(paginateDatasets);

    const seriesGroupComponent = this.seriesGroupBuilder.build(
      paginateDatasets,
      xAxisGroupComponent,
    );
    const tooltipComponent = this.tooltipBuilder.build();
    const titleGroupComponent = this.titleGroupBuilder.build(
      seriesGroupComponent,
      gridComponent,
    );

    return compact([
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
      tooltipComponent,
      titleGroupComponent,
    ]);
  }

  protected getSampling(
    datasets: DatasetComponent[],
    method?: Sampling,
  ): Sampling | undefined {
    const averageCount = mean(
      datasets.map((dataset) => dataset.getSource().length),
    );
    if (averageCount > LineChart.SAMPLING_THRESHOLD && method) {
      return method;
    }
  }
}
