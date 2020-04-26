import { AbstractCartesianChart } from "@/charts/AbstractCartesianChart";
import { BaseCartesianChartConfig } from "@/charts/BaseCartesianChartConfig";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { DataItem } from "@/types/DataItem";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { EntityDiff } from "@/utils/EntityDiff";

export class ScatterChart extends AbstractCartesianChart {
  protected seriesType: SeriesType = "scatter";
  constructor(
    protected data: DataItem[],
    protected config: BaseCartesianChartConfig,
  ) {
    super(data, config);
    super.constructComponentBuilders();
  }

  public compareConfig(newConfig: BaseCartesianChartConfig): void {
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
}
