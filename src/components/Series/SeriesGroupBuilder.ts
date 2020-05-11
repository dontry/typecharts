import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { SeriesComponent, Series } from "./SeriesComponent";
import { SeriesGroupConfig } from "./SeriesConfig";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { flatten, isArray } from "lodash";
import { Color } from "@/types/Color";
import { PlotIdentifier } from "../Dataset/PlotIdentifier";
import { DataParam } from "@/types/Param";

export abstract class SeriesGroupBuilder<
  S extends Series = Series,
  K extends SeriesComponent<S> = SeriesComponent<S>,
  T extends SeriesGroupConfig = SeriesGroupConfig
> extends AbstractComponentBuilder<S, K> {
  constructor(protected config: T) {
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

  protected getSeriesIdentifier(
    valueParam: DataParam,
    facetName?: string,
    categoryName?: string,
    subgroupName?: string,
  ): string {
    const plotIdentifier = new PlotIdentifier(
      valueParam.type,
      facetName,
      categoryName,
      subgroupName,
    ).toString();
    if (plotIdentifier === "") {
      return valueParam.name;
    } else {
      return plotIdentifier;
    }
  }

  public build(datasets: DatasetComponent[]): K[] {
    const series = datasets.map(
      (plotDataset: DatasetComponent, index: number) =>
        this.getPlotSeriesFromPlotDataset(plotDataset, index, this.config),
    );
    const components = isArray(series) ? flatten(series) : series;
    return components;
  }
}
