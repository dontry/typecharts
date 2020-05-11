import { AbstractCartesianChart } from "../AbstractCartesianChart";
import { DataItem } from "@/types/DataItem";
import { BaseCartesianChartConfig } from "../BaseCartesianChartConfig";
import { Position } from "@/types/Position";
import { SeriesType } from "@/components/Series/SeriesComponent";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { ChartComponent } from "../AbstractChart";
import { compact } from "lodash";

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
    this.tooltipBuilder = this.constructTooltipBuilder(this.config, "item");
  }

  protected constructXAxisGroupBuilder(
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

    const xAxisGroupBuilder = new AxisGroupBuilder(axisGroupConfig);
    return xAxisGroupBuilder;
  }

  protected constructYAxisGroupBuilder(
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
    const yAxisGroupBuilder = new AxisGroupBuilder(axisGroupConfig);
    return yAxisGroupBuilder;
  }

  protected updateChartByConfig(newConfig: BarChartConfig): void {
    throw new Error("Method not implemented.");
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
      tooltipComponent,
      gridComponent,
      seriesGroupComponent,
      titleGroupComponent,
    ]);
  }
}
