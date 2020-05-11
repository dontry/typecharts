import { AbstractCartesianChart } from "@/charts/AbstractCartesianChart";
import { BaseCartesianChartConfig } from "@/charts/BaseCartesianChartConfig";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { DataItem } from "@/types/DataItem";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { EntityDiff } from "@/utils/EntityDiff";
import { ContinuousVisualMapBuilder } from "@/components/VisualMap/ContinuousVisualMapBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import { VisualMapComponentConfig } from "@/components/VisualMap/VisualMapComponent";
import { compact, isNil } from "lodash";
import { AxisGroupBuilder } from "@/components/Axis/AxisGroupBuilder";

export interface ScatterChartConfig extends BaseCartesianChartConfig {
  isBubble?: boolean;
  bubble?: {
    symbol?: string;
    size?: [number, number];
  };
}

export class ScatterChart extends AbstractCartesianChart {
  protected seriesType: SeriesType = "scatter";
  protected visualMapBuilder?: ContinuousVisualMapBuilder;
  constructor(
    protected data: DataItem[],
    protected config: ScatterChartConfig,
  ) {
    super(data, config);
    super.constructComponentBuilders();
    this.constructVisualMapBuilder(this.plotDatasets, config);
  }

  public constructVisualMapBuilder(
    datasets: DatasetComponent[],
    config: ScatterChartConfig,
  ): void {
    if (!config.isBubble || isNil(config.bubble)) {
      return;
    }
    const [minRange, maxRange] = DatasetComponent.getMinmaxOfDatasets(
      datasets,
      config.valueParams,
    );
    const overallScale = AxisGroupBuilder.createNiceScale(
      this.plotDatasets,
      config.valueParams,
      config.yAxis.onZero,
    );
    let min, max;
    if (overallScale) {
      [min, max] = overallScale.calculate();
    }
    const visualMapConfig: VisualMapComponentConfig = {
      min: min as number,
      max: max as number,
      minRange: minRange,
      maxRange: maxRange,
      show: false,
      inRange: {
        symbolSize: config.bubble?.size,
        symbol: config.bubble?.symbol,
      },
    };
    this.visualMapBuilder = new ContinuousVisualMapBuilder(visualMapConfig);
  }

  public compareConfig(newConfig: ScatterChartConfig): void {
    const diff = new EntityDiff(this.config, newConfig);
    // TODO: Update chart based on diff;
    this.config = newConfig;
  }
  public buildEChartOption(): echarts.EChartOption<
    echarts.EChartOption.Series
  > {
    const xAxisGroupComponent = this.xAxisGroupBuilder.build();
    const yAxisGroupComponent = this.yAxisGroupBuilder.build();
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
      gridComponent,
    );
    const visualMapComponent = this.visualMapBuilder?.build();

    const pipeline = compact([
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
      titleGroupComponent,
      visualMapComponent,
    ]);

    return this.generateEChartOptionWithPipeline(pipeline);
  }
}
