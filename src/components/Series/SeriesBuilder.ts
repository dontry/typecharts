import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import {
  SeriesComponent,
  SeriesComponentConfig,
  Series,
  SeriesType,
} from "./SeriesComponent";
import { PlotDatasetInfo } from "../Dataset/DatasetComponent";
import { Encode } from "@/types/Encode";

export class SeriesBuilder extends AbstractComponentBuilder<
  Series,
  SeriesComponent
> {
  constructor(protected config: SeriesComponentConfig) {
    super(config);
    this.component = new SeriesComponent();
  }

  public setType(type: SeriesType): void {
    this.component.type = type;
  }

  public setName(name: string): void {
    this.component.name = name;
  }

  public setXAxisIndex(index: number): void {
    this.component.xAxisIndex = index;
  }

  public setYAxisIndex(index: number): void {
    this.component.yAxisIndex = index;
  }

  public setDatasetIndex(index: number): void {
    this.component.datasetIndex = index;
  }
  public setInfo(info: PlotDatasetInfo): void {
    this.component.info = info;
  }

  public setEncode(encode: Encode): void {
    this.component.encode = encode;
  }
  public setColor(color: string | undefined): void {
    this.component.color = color;
  }

  public build(): SeriesComponent {
    const {
      type,
      name,
      info,
      encode,
      axisIndex,
      datasetIndex,
      color,
    } = this.config;

    this.setType(type);
    this.setName(name);
    this.setEncode(encode);
    this.setColor(color);
    this.setXAxisIndex(axisIndex);
    this.setYAxisIndex(axisIndex);
    this.setInfo(info);
    this.setDatasetIndex(datasetIndex);

    return this.component;
  }
}
