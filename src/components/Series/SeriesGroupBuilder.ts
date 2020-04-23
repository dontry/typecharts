import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import {
  SeriesComponent,
  SeriesComponentConfig,
  Series,
} from "./SeriesComponent";
import { SeriesGroupConfig } from "./SeriesConfig";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { DataParam } from "@/types/Param";
import { isNil, flatten } from "lodash";
import { SeriesBuilder } from "./SeriesBuilder";
import { Color } from "@/types/Color";

export class SeriesGroupBuilder extends AbstractComponentBuilder<
  Series,
  SeriesComponent
> {
  /**
   *
   */
  constructor(
    protected datasets: DatasetComponent[],
    protected config: SeriesGroupConfig,
  ) {
    super(config);
  }

  private getPlotSeriesFromPlotDataset(
    plotDataset: DatasetComponent,
    index: number,
    config: SeriesGroupConfig,
  ): SeriesComponent[] {
    const { valueParams, axisGroup, dimensionParam, type, colors } = config;
    const valueSeries = valueParams.map((valueParam: DataParam) => {
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
      const axisIndex = axisGroup.findIndex(
        (axis) => axis.facetName === axisIdentifier,
      );
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

      const seriesComponent = new SeriesBuilder(config).build();
      return seriesComponent;
    });

    return valueSeries;
  }

  private getMatchedColor(
    seriesName = "",
    colors: Color[] = [],
  ): Color | undefined {
    return seriesName === ""
      ? colors[0]
      : colors.find((color) => color.name === seriesName);
  }

  private getSeriesName(
    valueName: string,
    facetName?: string,
    categoryName?: string,
    subgroupName?: string,
  ): string {
    let seriesName;
    if (isNil(categoryName) && isNil(facetName)) {
      seriesName = subgroupName ? subgroupName : valueName;
    } else {
      seriesName = categoryName ? categoryName : facetName;
    }

    return seriesName || valueName;
  }

  public build(): SeriesComponent[] {
    const components = flatten(
      this.datasets.map((plotDataset: DatasetComponent, index: number) =>
        this.getPlotSeriesFromPlotDataset(plotDataset, index, this.config),
      ),
    );
    return components;
  }
}
