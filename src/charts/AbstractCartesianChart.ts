import { DataItem } from "@/types/DataItem";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { AbstractChart } from "./AbstractChart";
import { BaseCartesianChartConfig } from "./BaseCartesianChartConfig";
import { SeriesType } from "@/components/Series/SeriesComponent";
import {
  CartesianSeriesGroupBuilder,
  CartesianSeriesGroupConfig,
} from "@/components/Series/CartesianSeriesGroupBuilder";
import { TitleGroupBuilder } from "@/components/Title/TitleGroupBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";

export abstract class AbstractCartesianChart<
  T extends BaseCartesianChartConfig = BaseCartesianChartConfig
> extends AbstractChart {
  protected xAxisGroupBuilder!: AxisGroupBuilder;
  protected yAxisGroupBuilder!: AxisGroupBuilder;
  protected titleGroupBuilder!: TitleGroupBuilder;

  constructor(protected data: DataItem[], protected config: T) {
    super(data, config);
  }

  protected constructComponentBuilders(): void {
    super.constructComponentBuilders();
    this.xAxisGroupBuilder = this.constructXAxisGroupBuilder(
      this.config,
      this.gridBuilder.getCols(),
    );
    this.yAxisGroupBuilder = this.constructYAxisGroupBuilder(
      this.config,
      this.gridBuilder.getRows(),
    );
    this.titleGroupBuilder = this.constructTitleGroupBuilder(this.config);
    this.seriesGroupBuilder = this.constructSeriesGroupBuilder(
      this.seriesType,
      this.config,
      this.plotDatasets,
    );
  }

  protected constructTitleGroupBuilder(config: T): TitleGroupBuilder {
    const titleGroupConfig = config.title;
    return new TitleGroupBuilder(titleGroupConfig);
  }

  protected constructXAxisGroupBuilder(
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
    const xAxisGroupBuilder = new AxisGroupBuilder(axisGroupConfig);
    return xAxisGroupBuilder;
  }

  protected constructYAxisGroupBuilder(
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
    const yAxisGroupBuilder = new AxisGroupBuilder(axisGroupConfig);
    return yAxisGroupBuilder;
  }

  protected constructSeriesGroupBuilder(
    seriesType: SeriesType,
    config: T,
    datasets?: DatasetComponent[],
  ): CartesianSeriesGroupBuilder {
    const seriesGroupConfig: CartesianSeriesGroupConfig = {
      type: seriesType,
      valueParams: config.valueParams,
      dimensionParam: config.dimensionParam,
      custom: config.custom?.series,
    };

    return new CartesianSeriesGroupBuilder(seriesGroupConfig);
  }
}
