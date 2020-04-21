import { DataItem } from "@/types/DataItem";
import { EntityDiff } from "@/utils/EntityDiff";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { AbstractCartesianChartBuilder } from "@/charts/AbstractCartesianChartBuilder";
import { BaseChartConfig } from "@/charts/BaseChartConfig";
import { SeriesType } from "@/components/Series/SeriesComponent";
import { EChartOption } from "echarts";

export interface LineChartConfig extends BaseChartConfig {
  custom?: any;
}

export class LineChartBuilder extends AbstractCartesianChartBuilder<
  LineChartConfig
> {
  protected seriesType: SeriesType = "line";
  constructor(protected data: DataItem[], protected config: LineChartConfig) {
    super(data, config);
  }

  public compareConfig(newConfig: LineChartConfig): void {
    const diff = new EntityDiff(this.config, newConfig);
    // TODO: Update chart based on diff;
    this.config = newConfig;
  }

  public buildEChartOption(): EChartOption {
    const xAxisGroupComponent = this.xAxisGroupBuilder.build();
    const yAxisGroupComponent = this.yAxisGroupBuilder.build();
    const gridComponent = this.gridBuilder.build();
    const seriesGroupComponent = this.seriesGroupBuilder.build();
    const pageIndex = this.config.pageIndex;
    const pageSize = this.gridBuilder.getCols() * this.gridBuilder.getRows();
    const paginateDatasetsComponent = DatasetBuilder.getPaginateDatasets(
      this.plotDatasets,
      pageIndex,
      pageSize,
    );
    // const datasetGroupComponent = new DatasetGroupComponent(paginateDatasets);

    const pipeline = [
      paginateDatasetsComponent,
      xAxisGroupComponent,
      yAxisGroupComponent,
      gridComponent,
      seriesGroupComponent,
    ];

    return this.generateEChartOptionWithPipeline(pipeline);
  }
}
