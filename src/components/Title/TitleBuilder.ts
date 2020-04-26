import { EChartTitleOption as Title } from "echarts";
import { TitleComponent } from "./TitleComponent";
import { TitleConfig } from "./TitleConfig";
import { AbstractComponentBuilder } from "@/components/AbstractComponentBuilder";
import { isNil } from "lodash";

export class TitleBuilder extends AbstractComponentBuilder<
  Title,
  TitleComponent
> {
  constructor(protected config?: TitleConfig) {
    super(config);
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.component = new TitleComponent();
  }

  public setText(text = ""): void {
    this.component.text = text;
  }

  public setShow(show: boolean): void {
    this.component.show = show;
  }

  public build(): TitleComponent {
    if (isNil(this.config)) {
      return this.component;
    }
    const { text, show } = this.config;
    this.setText(text);
    this.setShow(show);
    return this.component;
  }
}
