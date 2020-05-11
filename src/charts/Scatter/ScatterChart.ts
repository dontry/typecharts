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
import { ChartComponent } from "../AbstractChart";

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
    this.visualMapBuilder = this.constructVisualMapBuilder(
      this.plotDatasets,
      config,
    );
  }

  protected constructVisualMapBuilder(
    datasets: DatasetComponent[],
    config: ScatterChartConfig,
  ): ContinuousVisualMapBuilder | undefined {
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
    return new ContinuousVisualMapBuilder(visualMapConfig);
  }

  protected updateChartByConfig(newConfig: ScatterChartConfig): void {
    const diff = new EntityDiff(this.config, newConfig);
    // TODO: Update chart based on diff;
    this.config = newConfig;
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
    const visualMapComponent = this.visualMapBuilder?.build();

    return compact([
      paginateDatasets,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
      titleGroupComponent,
      visualMapComponent,
    ]);
  }
}
