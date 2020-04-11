import { EChartTitleOption as Title } from "echarts";
import { TitleComponent } from "./TitleComponent";
import { TitleConfig } from "./TitleConfig";
import { AbstractComponentBuilder } from "@/components/AbstractComponentBuilder";

export class TitleBuilder extends AbstractComponentBuilder<
  Title,
  TitleComponent
> {
  constructor(protected config?: TitleConfig) {
    super(config);
    this.reset();
  }

  public reset(): void {
    this.component = new TitleComponent();
  }

  public setText(text: string): void {
    this.component.text = text;
  }

  public setShow(show: boolean): void {
    this.component.show = show;
  }
}
