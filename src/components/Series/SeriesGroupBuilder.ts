import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { SeriesComponent, Series, SeriesType } from "./SeriesComponent";
import { DatasetComponent } from "../Dataset/DatasetComponent";
import { flatten, isArray, isNil } from "lodash";
import { Color } from "@/types/Color";
import { PlotIdentifier } from "../Dataset/PlotIdentifier";
import { DataParam } from "@/types/Param";
import { AxisComponent } from "../Axis/AxisComponent";

export interface SeriesGroupConfig {
  type: SeriesType;
  valueParams: DataParam[];
}

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

  public build(datasets: DatasetComponent[], axisGroup?: AxisComponent[]): K[] {
    let config = this.config;
    if (!isNil(axisGroup)) {
      config = {
        ...this.config,
        axisGroup: axisGroup,
      };
    }
    const series = datasets.map(
      (plotDataset: DatasetComponent, index: number) =>
        this.getPlotSeriesFromPlotDataset(plotDataset, index, config),
    );
    const components = isArray(series) ? flatten(series) : series;
    return components;
  }
}
