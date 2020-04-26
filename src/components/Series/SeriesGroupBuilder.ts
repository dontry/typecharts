import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { SeriesComponent, Series } from "./SeriesComponent";
import { SeriesGroupConfig } from "./SeriesConfig";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { isNil, flatten, isArray } from "lodash";
import { Color } from "@/types/Color";

export abstract class SeriesGroupBuilder<
  S extends Series = Series,
  K extends SeriesComponent<S> = SeriesComponent<S>,
  T extends SeriesGroupConfig = SeriesGroupConfig
> extends AbstractComponentBuilder<S, K> {
  constructor(protected datasets: DatasetComponent[], protected config: T) {
    super(config);
  }

  protected abstract getPlotSeriesFromPlotDataset(
    plotDataset: DatasetComponent,
    index: number,
    config: T,
  ): K | K[];

  protected getMatchedColor(
    seriesName = "",
    colors: Color[] = [],
  ): Color | undefined {
    return seriesName === ""
      ? colors[0]
      : colors.find((color) => color.name === seriesName);
  }

  protected getSeriesName(
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

  public build(): K[] {
    const series = this.datasets.map(
      (plotDataset: DatasetComponent, index: number) =>
        this.getPlotSeriesFromPlotDataset(plotDataset, index, this.config),
    );
    const components = isArray(series) ? flatten(series) : series;
    return components;
  }
}
