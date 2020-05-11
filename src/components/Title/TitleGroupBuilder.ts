import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { TitleComponent, Title } from "./TitleComponent";
import { TextAlign } from "@/types/TextAlign";
import { SeriesComponent } from "../Series/SeriesComponent";
import { GridComponent } from "../Grid/GridComponent";
import { isNil } from "lodash";
import { calculatePercentageOfString } from "@/utils/misc";
import { TitleBuilder, TitleBuilderConfig } from "./TitleBuilder";

export interface TitleGroupConfig {
  show: boolean;
  textAlign?: TextAlign;
  textVerticalAlign?: TextAlign;
  custom?: any;
}

export class TitleGroupBuilder extends AbstractComponentBuilder<
  Title,
  TitleComponent
> {
  constructor(protected config?: TitleGroupConfig) {
    super(config);
  }

  protected initializeComponent(): void {
    return;
  }

  protected createTitles(
    config: TitleGroupConfig,
    seriesGroup: SeriesComponent[],
    gridGroup: GridComponent,
  ): TitleComponent[] {
    const gridOption = gridGroup.toEChartOption();
    return seriesGroup.reduce(
      (titles: TitleComponent[], seriesComponent: SeriesComponent) => {
        const index = seriesComponent.xAxisIndex;
        if (isNil(titles[index])) {
          const { left, top, width } = gridOption[index];
          const titleTop = top;
          let titleLeft;
          if (typeof left === "string" && typeof width === "string") {
            titleLeft = calculatePercentageOfString(
              `${parseFloat(left)}+${parseFloat(width) / 2}%`,
            );
          } else if (typeof left === "number" && typeof width === "number") {
            titleLeft = `${left + width / 2}%`;
          } else {
            throw Error("Invalid left or width value");
          }

          const titleConfig: TitleBuilderConfig = {
            text: seriesComponent.info.facetName || "",
            textAlign: config.textAlign,
            textVerticalAlign: config.textVerticalAlign,
            show: config.show,
            custom: config.custom,
            left: titleLeft,
            top: titleTop,
          };

          const builder = new TitleBuilder(titleConfig);
          const titleComponent = builder.build();
          return [...titles, titleComponent];
        }
        return titles;
      },
      [],
    );
  }

  public build(
    seriesGroup: SeriesComponent[],
    grid: GridComponent,
  ): TitleComponent[] | null {
    if (isNil(this.config)) {
      return null;
    }
    const titles = this.createTitles(this.config, seriesGroup, grid);
    return titles;
  }
}
