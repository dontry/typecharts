import { DataItem } from "@/types/DataItem";
import { EntityDiff } from "@/utils/EntityDiff";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { AbstractCartesianChart } from "@/charts/AbstractCartesianChart";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { EChartOption } from "echarts";
import { BaseCartesianChartConfig } from "../BaseCartesianChartConfig";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { AxisComponent } from "@/components/Axis/AxisComponent";
import { CartesianSeriesGroupBuilder } from "@/components/Series/CartesianSeriesGroupBuilder";
import { CartesianSeriesGroupConfig } from "@/components/Series/SeriesConfig";
import { Sampling } from "@/types/Sampling";
import { mean, compact } from "lodash";
import { AbstractComponent } from "@/components/AbstractComponent";
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
    const titleGroupComponent = this.titleGroupBuilder.build(
      seriesGroupComponent,
      gridComponent,
    );

    return compact([
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      titleGroupComponent,
      seriesGroupComponent,
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
