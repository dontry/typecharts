import { AbstractCartesianChart } from "../AbstractCartesianChart";
import { DataItem } from "@/types/DataItem";
import { BaseCartesianChartConfig } from "../BaseCartesianChartConfig";
import { Position } from "@/types/Position";
import { SeriesType } from "@/components/Series/SeriesComponent";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";

export interface BarLabelConfig {
  show: boolean;
  position: Position;
  fontSize: number;
  color: string;
  direction: string;
}

export interface BarChartConfig extends BaseCartesianChartConfig {
  barLabelConfig?: BarLabelConfig;
}

export class BarChart extends AbstractCartesianChart<BarChartConfig> {
  protected seriesType: SeriesType = "bar";
  constructor(protected data: DataItem[], protected config: BarChartConfig) {
    super(data, config);
    super.constructComponentBuilders();
  }

  public constructXAxisGroupBuilder(
    datasets: DatasetComponent[],
    config: BarChartConfig,
    count: number,
  ): AxisGroupBuilder {
    const axisGroupConfig: AxisGroupConfig = {
      axis: "x",
      dataParams: [config.dimensionParam],
      isDimension: true,
      count,
      ...config.xAxis,
      custom: {
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: true,
        },
      },
    };

    const xAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return xAxisGroupBuilder;
  }

  public constructYAxisGroupBuilder(
    datasets: DatasetComponent[],
    config: BarChartConfig,
    count: number,
  ): AxisGroupBuilder {
    const axisGroupConfig: AxisGroupConfig = {
      axis: "y",
      dataParams: config.valueParams,
      isDimension: false,
      count,
      ...config.yAxis,
      custom: {
        boundaryGap: false,
        axisLine: {
          onZero: false,
        },
      },
    };
    const yAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return yAxisGroupBuilder;
  }

  public compareConfig(newConfig: BarChartConfig): void {
    throw new Error("Method not implemented.");
  }

  public buildEChartOption(): echarts.EChartOption<
    echarts.EChartOption.Series
  > {
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

    const pipeline = [
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
    ];

    return this.generateEChartOptionWithPipeline(pipeline);
  }
}
