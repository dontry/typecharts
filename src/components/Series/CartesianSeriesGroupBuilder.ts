import { SeriesGroupBuilder } from "./SeriesGroupBuilder";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import {
  Series,
  SeriesComponent,
  SeriesComponentConfig,
} from "./SeriesComponent";
import { CartesianSeriesGroupConfig } from "./SeriesConfig";
import { DataParam } from "@/types/Param";
import { CartesianSeriesBuilder } from "./CartesianSeriesBuilder";

export class CartesianSeriesGroupBuilder extends SeriesGroupBuilder<
  Series,
  SeriesComponent<Series>,
  CartesianSeriesGroupConfig
> {
  constructor(
    protected datasets: DatasetComponent[],
    protected config: CartesianSeriesGroupConfig,
  ) {
    super(datasets, config);
  }

  protected initializeComponent(): void {
    this.component = new SeriesComponent();
  }

  protected getPlotSeriesFromPlotDataset(
    plotDataset: DatasetComponent,
    index: number,
    config: CartesianSeriesGroupConfig,
  ): SeriesComponent<Series> | SeriesComponent<Series>[] {
    const { valueParams, axisGroup, dimensionParam, type, colors } = config;
    const plotSeries = valueParams.map((valueParam: DataParam) => {
      const { facetName, subgroupName, categoryName } = plotDataset.getInfo();
      // extract series
      const seriesName = this.getSeriesName(
        valueParam.name,
        facetName,
        subgroupName,
        categoryName,
      );
      // TODO: flipped attribute, markline attribute
      const axisIdentifier = facetName === "" ? dimensionParam.name : facetName;
      const axisIndex = axisGroup
        ? axisGroup.findIndex((axis) => axis.facetName === axisIdentifier)
        : -1;
      const x = dimensionParam.name;
      const y = valueParam.name;
      const matchedColor = this.getMatchedColor(seriesName, colors);

      const config: SeriesComponentConfig = {
        type: type,
        name: seriesName,
        info: plotDataset.getInfo(),
        encode: { x, y },
        color: matchedColor?.value,
        axisIndex: axisIndex,
        datasetIndex: index,
      };

      const seriesComponent = new CartesianSeriesBuilder(config).build();
      return seriesComponent;
    });

    return plotSeries;
  }
}
