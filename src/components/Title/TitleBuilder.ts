import { EChartTitleOption as Title } from "echarts";
import { TitleComponent } from "./TitleComponent";
import { AbstractComponentBuilder } from "@/components/AbstractComponentBuilder";
import { TextAlign } from "@/types/TextAlign";
import { Position } from "@/types/Position";

export interface TitleBuilderConfig {
  text: string;
  show: boolean;
  textAlign?: TextAlign;
  textVerticalAlign?: TextAlign;
  left?: Position;
  top?: Position;
  custom?: any;
}

export class TitleBuilder extends AbstractComponentBuilder<
  Title,
  TitleComponent
> {
  constructor(protected config: TitleBuilderConfig) {
    super(config);
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.component = new TitleComponent();
  }

  public setText(text = ""): void {
    this.component.text = text;
  }

  public setTop(top: Position = 0): void {
    this.component.top = top;
  }

  public setLeft(left: Position = 0): void {
    this.component.left = left;
  }

  public setTextAlign(textAlign: TextAlign = "center"): void {
    this.component.textAlign = textAlign;
  }

  public setShow(show: boolean): void {
    this.component.show = show;
  }

  public build(): TitleComponent {
    const { text, show, textAlign, top, left, custom } = this.config;
    this.setText(text);
    this.setShow(show);
    this.setTextAlign(textAlign);
    this.setTop(top);
    this.setLeft(left);
    this.setCustom(custom);
    return this.component;
  }
}
