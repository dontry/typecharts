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
import { AxisComponent } from "../Axis/AxisComponent";
import { isArray, flatten } from "lodash";

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

      const config: SeriesComponentConfig = {
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
