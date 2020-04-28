import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { DataItem } from "@/types/DataItem";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { AbstractChart } from "./AbstractChart";
import { BaseCartesianChartConfig } from "./BaseCartesianChartConfig";
import { AxisComponent } from "@/components/Axis/AxisComponent";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { CartesianSeriesGroupConfig } from "@/components/Series/SeriesConfig";
import { CartesianSeriesGroupBuilder } from "@/components/Series/CartesianSeriesGroupBuilder";

export abstract class AbstractCartesianChart<
  T extends BaseCartesianChartConfig = BaseCartesianChartConfig
> extends AbstractChart {
  protected xAxisGroupBuilder!: AxisGroupBuilder;
  protected yAxisGroupBuilder!: AxisGroupBuilder;

  constructor(protected data: DataItem[], protected config: T) {
    super(data, config);
  }

  public constructComponentBuilders(): void {
    super.constructComponentBuilders();
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const pageIndex = this.config.pageIndex;
    const paginateDatasets = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageSize,
      pageIndex,
    );
    this.xAxisGroupBuilder = this.constructXAxisGroupBuilder(
      paginateDatasets,
      this.config,
      this.gridBuilder.getCols(),
    );
    this.yAxisGroupBuilder = this.constructYAxisGroupBuilder(
      paginateDatasets,
      this.config,
      this.gridBuilder.getRows(),
    );
    const xAxisGroup = this.xAxisGroupBuilder.build();
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      paginateDatasets,
      this.seriesType,
      this.config,
      xAxisGroup,
    );
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
      ...config.xAxis,
    };
    const xAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return xAxisGroupBuilder;
  }

  public constructYAxisGroupBuilder(
    datasets: DatasetComponent[],
    config: BaseCartesianChartConfig,
    count: number,
  ): AxisGroupBuilder {
    const axisGroupConfig: AxisGroupConfig = {
      axis: "y",
      dataParams: config.valueParams,
      isDimension: false,
      count,
      ...config.yAxis,
    };
    const yAxisGroupBuilder = new AxisGroupBuilder(datasets, axisGroupConfig);
    return yAxisGroupBuilder;
  }

  public constructSeriesGroupBuilder(
    datasets: DatasetComponent[],
    seriesType: SeriesType,
    config: T,
    axisGroup: AxisComponent[] = [],
  ): CartesianSeriesGroupBuilder {
    const seriesGroupConfig: CartesianSeriesGroupConfig = {
      axisGroup: axisGroup,
      type: seriesType,
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
      custom: config.custom?.series,
    };

    return new CartesianSeriesGroupBuilder(datasets, seriesGroupConfig);
  }
}
