import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { SeriesComponent, Series, SeriesType } from "./SeriesComponent";
import { PlotDatasetInfo } from "../Dataset/DatasetComponent";
import { Encode } from "@/types/Encode";

export interface SeriesBuilderConfig extends BaseSeriesBuilderConfig {
  axisIndex: number;
  encode: Encode;
}
export interface BaseSeriesBuilderConfig {
  type: SeriesType;
  name: string;
  info: PlotDatasetInfo;
  datasetIndex: number;
  color?: string;
  custom?: any;
}

export class BaseSeriesBuilder<
  S extends Series = Series,
  K extends SeriesComponent<S> = SeriesComponent<S>,
  T extends BaseSeriesBuilderConfig = BaseSeriesBuilderConfig
> extends AbstractComponentBuilder<S, K> {
  constructor(protected config: T) {
    super(config);
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.component = new SeriesComponent<Series>() as K;
  }

  public setType(type: SeriesType): void {
    this.component.type = type;
  }

  public setName(name: string): void {
    this.component.name = name;
  }

  public setDatasetIndex(index: number): void {
    this.component.datasetIndex = index;
  }
  public setInfo(info: PlotDatasetInfo): void {
    this.component.info = info;
  }

  public setColor(color: string | undefined): void {
    this.component.color = color;
  }

  public build(): K {
    const { type, name, info, datasetIndex, color } = this.config;

    this.setType(type);
    this.setName(name);
    this.setColor(color);
    this.setInfo(info);
    this.setDatasetIndex(datasetIndex);

    return this.component;
  }
}
