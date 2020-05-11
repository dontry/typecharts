import { EChartTitleOption } from "echarts";
import { AbstractComponent } from "@/components/AbstractComponent";
import { Position } from "@/types/Position";
import { TextAlign } from "@/types/TextAlign";

export type Title = EChartTitleOption;

export class TitleComponent extends AbstractComponent<Title> {
  protected _text = "";
  protected _show = true;
  protected _left: Position = "0%";
  protected _top: Position = "0%";
  protected _textAlign: TextAlign = "center";

  constructor() {
    super();
    this.fieldName = "title";
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

  public get left(): Position {
    return this._left;
  }
  public set left(value: Position) {
    this._left = value;
  }
  public get top(): Position {
    return this._top;
  }
  public set top(value: Position) {
    this._top = value;
  }

  public get textAlign(): TextAlign {
    return this._textAlign;
  }
  public set textAlign(value: TextAlign) {
    this._textAlign = value;
  }

  public toEChartOption(): Title {
    return {
      text: this._text,
      show: this._show,
      top: this._top,
      left: this._left,
      textAlign: this._textAlign,
      ...this._custom,
    };
  }
}
