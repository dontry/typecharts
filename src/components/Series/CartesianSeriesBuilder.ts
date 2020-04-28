import {
  SeriesComponent,
  SeriesComponentConfig,
  Series,
} from "./SeriesComponent";
import { Encode } from "@/types/Encode";
import { BaseSeriesBuilder } from "./SeriesBuilder";

export class CartesianSeriesBuilder extends BaseSeriesBuilder<
  Series,
  SeriesComponent<Series>
> {
  constructor(protected config: SeriesComponentConfig) {
    super(config);
    this.initializeComponent();
  }

  public initializeComponent(): void {
    this.component = new SeriesComponent<Series>();
  }

  public setXAxisIndex(index: number): void {
    this.component.xAxisIndex = index;
  }

  public setYAxisIndex(index: number): void {
    this.component.yAxisIndex = index;
  }

  public setEncode(encode: Encode): void {
    this.component.encode = encode;
  }

  public build(): SeriesComponent {
    const { axisIndex, encode, custom } = this.config;

    super.build();
    this.setXAxisIndex(axisIndex);
    this.setYAxisIndex(axisIndex);
    this.setEncode(encode);
    this.setCustom(custom);

    return this.component;
  }
}
