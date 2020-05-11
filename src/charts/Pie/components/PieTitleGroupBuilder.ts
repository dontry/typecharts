import { TitleGroupConfig } from "@/components/Title/TitleGroupBuilder";
import { TitleComponent, Title } from "@/components/Title/TitleComponent";
import { SeriesComponent } from "@/components/Series/SeriesComponent";
import { LayoutConfig } from "@/components/Layout/LayoutConfig";
import { isNil } from "lodash";
import { AbstractComponentBuilder } from "@/components/AbstractComponentBuilder";
import { TitleBuilder } from "@/components/Title/TitleBuilder";
import { PieLayout } from "../PieLayout";
import { TextAlign } from "@/types/TextAlign";

export class PieTitleGroupBuilder extends AbstractComponentBuilder<
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
    layout: LayoutConfig,
  ): TitleComponent[] {
    const key = `${layout.rows},${layout.cols}` as keyof typeof PieLayout;
    const grid = PieLayout[key];
    return seriesGroup.map((seriesComponent, index) => {
      const pieTitle = grid[index].title;
      const titleConfig = {
        show: config.show,
        text: seriesComponent.info.facetName || "",
        textAlign: pieTitle.textAlign as TextAlign,
        left: pieTitle.left,
        top: pieTitle.top,
        custom: {
          textStyle: pieTitle.textStyle,
        },
      };

      const builder = new TitleBuilder(titleConfig);
      const titleComponent = builder.build();
      return titleComponent;
    });
  }

  public build(
    seriesGroup: SeriesComponent[],
    layout: LayoutConfig,
  ): TitleComponent[] | null {
    if (isNil(this.config)) {
      return null;
    }
    const titles = this.createTitles(this.config, seriesGroup, layout);
    return titles;
  }
}
