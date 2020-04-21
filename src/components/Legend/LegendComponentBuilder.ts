import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { LegendComponent, Legend } from "./LegendComponent";
import { LegendConfig } from "./LegendConfig";
import { SeriesComponent } from "../Series/SeriesComponent";
import { flow, map, compact, uniq } from "lodash/fp";
import { PlotDatasetInfo } from "../Dataset/DatasetComponent";

export class LegendBuilder extends AbstractComponentBuilder<
  Legend,
  LegendComponent
> {
  constructor(
    private seriesGroup: SeriesComponent[],
    protected config: LegendConfig,
  ) {
    super(config);
    this.component = new LegendComponent();
  }

  private getParamsWith(paramName: keyof PlotDatasetInfo) {
    return (seriesGroup: SeriesComponent[]): string[] => {
      const chain = flow(
        map((series: SeriesComponent) => series.info[paramName]),
        compact,
        uniq,
      );
      const params = chain(seriesGroup);
      return params;
    };
  }

  public setData(data: string[]): void {
    this.component.data = data;
  }

  public getDataFromSeriesGroup(seriesGroup: SeriesComponent[]): string[] {
    const facets = this.getParamsWith("facetName")(seriesGroup);
    const categories = this.getParamsWith("categoryName")(seriesGroup);

    if (facets.length === 0 && categories.length === 0) {
      if (this.seriesGroup.length <= 1) {
        return [];
      } else {
        return seriesGroup.map((series: SeriesComponent) => series.name);
      }
    } else if (facets.length > 0 && categories.length === 0) {
      return facets;
    } else {
      return categories;
    }
  }

  public build(): LegendComponent {
    const data = this.getDataFromSeriesGroup(this.seriesGroup);
    this.setData(data);
    return this.component;
  }
}
