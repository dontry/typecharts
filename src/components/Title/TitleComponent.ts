import { EChartTitleOption as Title } from "echarts";
import { AbstractComponent } from "@/components/AbstractComponent";

export class TitleComponent extends AbstractComponent<Title> {
  private _text = "";
  private _show = true;

  constructor() {
    super();
  }

  public get show(): boolean {
    return this._show;
  }
  public set show(value: boolean) {
    this._show = value;
  }
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
  }

  public toEchartOption(): Title {
    return {
      text: this._text,
      show: this._show,
    };
  }
}
