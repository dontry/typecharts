import {
  SeriesComponent,
  Series,
  BaseSeriesComponentConfig,
} from "@/components/Series/SeriesComponent";
import { PieType } from "../PieChart";
import { Layout } from "../PieLayout";

interface PieStyle {
  radius: number[] | string[] | number | string;
  roseType?: "radius";
}

export interface PieData {
  name: string;
  value: number;
  itemStyle?: { color: string };
}

export interface PieSeriesComponentConfig extends BaseSeriesComponentConfig {
  rows: number;
  cols: number;
  data: PieData[];
}

export class PieSeriesComponent extends SeriesComponent<Series> {
  private _pieType: PieType = "round";
  private _layout!: Layout;
  private _data!: PieData[];

  constructor() {
    super();
  }
  public get pieType(): PieType {
    return this._pieType;
  }
  public set pieType(value: PieType) {
    this._pieType = value;
  }
  public get layout(): Layout {
    return this._layout;
  }
  public set layout(value: Layout) {
    this._layout = value;
  }
  public get data(): PieData[] {
    return this._data;
  }
  public set data(value: PieData[]) {
    this._data = value;
  }

  private getPieStyle(type: PieType, layout: Layout): PieStyle {
    switch (type) {
      case "ring":
        return { radius: layout.ring };
      case "radar":
        return { radius: layout.radius, roseType: "radius" };
      case "round":
      default:
        return { radius: layout.radius };
    }
  }

  public toEChartOption(): Series {
    const style = this.getPieStyle(this._pieType, this._layout);
    return {
      id: this.id,
      type: this._type,
      name: this._name,
      center: this._layout.center,
      ...style,
      data: this._data,
    };
  }
}
