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
import { mean } from "lodash";

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

  public compareConfig(newConfig: LineChartConfig): void {
    const diff = new EntityDiff(this.config, newConfig);
    // TODO: Update chart based on diff;
    this.config = newConfig;
  }

  public constructSeriesGroupBuilder(
    datasets: DatasetComponent[],
    seriesType: SeriesType,
    config: LineChartConfig,
    axisGroup: AxisComponent[] = [],
  ): CartesianSeriesGroupBuilder {
    const seriesGroupConfig: CartesianSeriesGroupConfig = {
      axisGroup: axisGroup,
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
    return new CartesianSeriesGroupBuilder(datasets, seriesGroupConfig);
  }

  public buildEChartOption(): EChartOption {
    const xAxisGroupComponent = this.xAxisGroupBuilder.build();
    const yAxisGroupComponent = this.yAxisGroupBuilder.build();
    const gridComponent = this.gridBuilder.build();
    const seriesGroupComponent = this.seriesGroupBuilder.build();
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const pageIndex = this.config.pageIndex;
    const paginateDatasets = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageSize,
      pageIndex,
    );
    // const datasetGroupComponent = new DatasetGroupComponent(paginateDatasets);

    const pipeline = [
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
    ];

    return this.generateEChartOptionWithPipeline(pipeline);
  }

  private getSampling(
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
