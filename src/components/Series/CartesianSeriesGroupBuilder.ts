import { SeriesGroupBuilder, SeriesGroupConfig } from "./SeriesGroupBuilder";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { Series, SeriesComponent } from "./SeriesComponent";
import { DataParam } from "@/types/Param";
import { CartesianSeriesBuilder } from "./CartesianSeriesBuilder";
import { AxisComponent } from "../Axis/AxisComponent";
import { Color } from "@/types/Color";
import { SeriesBuilderConfig } from "./SeriesBuilder";

export interface CartesianSeriesGroupConfig extends SeriesGroupConfig {
  dimensionParam: DataParam;
  axisGroup?: AxisComponent[];
  colors?: Color[];
  custom?: any;
}

export class CartesianSeriesGroupBuilder extends SeriesGroupBuilder<
  Series,
  SeriesComponent<Series>,
  CartesianSeriesGroupConfig
> {
  constructor(protected config: CartesianSeriesGroupConfig) {
    super(config);
  }

  protected initializeComponent(): void {
    this.component = new SeriesComponent();
  }

  protected getPlotSeriesFromPlotDataset(
    plotDataset: DatasetComponent,
    index: number,
    config: CartesianSeriesGroupConfig,
  ): SeriesComponent<Series> | SeriesComponent<Series>[] {
    const {
      valueParams,
      axisGroup,
      dimensionParam,
      type,
      colors,
      custom,
    } = config;
    const plotSeries = valueParams.map((valueParam: DataParam) => {
      const { facetName, subgroupName, categoryName } = plotDataset.getInfo();
      const seriesIdentifier = this.getSeriesIdentifier(
        valueParam,
        facetName,
        subgroupName,
        categoryName,
      );
      // TODO: flipped attribute, markline attribute
      const axisIdentifier = facetName === "" ? dimensionParam.name : facetName;
      const axisIndex = axisGroup
        ? axisGroup.findIndex((axis) => axis.identifier === axisIdentifier)
        : -1;
      const x = dimensionParam.name;
      const y = valueParam.name;
      const matchedColor = this.getMatchedColor(seriesIdentifier, colors);

      const config: SeriesBuilderConfig = {
        type: type,
        name: seriesIdentifier,
        info: plotDataset.getInfo(),
        encode: { x, y },
        color: matchedColor?.value,
        axisIndex: axisIndex,
        datasetIndex: index,
        custom: custom,
      };

      const seriesComponent = new CartesianSeriesBuilder(config).build();
      return seriesComponent;
    });

    return plotSeries;
  }
}
