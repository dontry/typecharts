import {
  SeriesGroupBuilder,
  SeriesGroupConfig,
} from "@/components/Series/SeriesGroupBuilder";
import { DatasetComponent } from "@/components/Dataset/DatasetComponent";
import {
  PieSeriesBuilderConfig,
  PieData,
  PieSeriesComponent,
} from "./PieSeriesComponent";
import { PieSeriesBuilder } from "./PieSeriesBuilder";
import { DataParam } from "@/types/Param";
import { DataItem } from "@/types/DataItem";
import { LayoutConfig } from "@/components/Layout/LayoutConfig";
import { Series } from "@/components/Series/SeriesComponent";

export interface PieSeriesGroupConfig extends SeriesGroupConfig {
  categoryParam: DataParam;
  layout?: LayoutConfig;
}

export class PieSeriesGroupBuilder extends SeriesGroupBuilder<
  Series,
  PieSeriesComponent,
  PieSeriesGroupConfig
> {
  constructor(protected config: PieSeriesGroupConfig) {
    super(config);
    this.initializeComponent();
  }

  protected initializeComponent(): void {
    this.component = new PieSeriesComponent();
  }

  protected getPlotSeriesFromPlotDataset(
    plotDataset: DatasetComponent,
    index: number,
    config: PieSeriesGroupConfig,
  ): PieSeriesComponent {
    const { valueParams, categoryParam } = config;
    const source = plotDataset.getSource();
    const data = source.map((item: DataItem) =>
      this.getPieData(item, valueParams, categoryParam),
    );
    const { facetName, subgroupName, categoryName } = plotDataset.getInfo();
    const seriesName = this.getSeriesIdentifier(
      valueParams[0],
      facetName,
      categoryName,
      subgroupName,
    );

    const layout = config.layout || { rows: 1, cols: 1 };
    const componentConfig: PieSeriesBuilderConfig = {
      type: config.type,
      name: seriesName,
      info: plotDataset.getInfo(),
      rows: layout.rows,
      cols: layout.cols,
      data: data,
      datasetIndex: index,
    };
    const component = new PieSeriesBuilder(componentConfig).build();
    return component;
  }

  private getPieData(
    item: DataItem,
    valueParams: DataParam[],
    categoryParam?: DataParam,
  ): PieData {
    const name = categoryParam ? categoryParam.name : valueParams[0].name;
    return {
      name: item[name] as string,
      value: item[valueParams[0].name] as number,
    };
  }
}
