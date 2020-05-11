import { PieLayout, Layout } from "../PieLayout";
import {
  PieSeriesComponent,
  PieSeriesBuilderConfig,
  PieData,
} from "./PieSeriesComponent";
import { Series } from "@/components/Series/SeriesComponent";
import { BaseSeriesBuilder } from "@/components/Series/SeriesBuilder";

export class PieSeriesBuilder extends BaseSeriesBuilder<
  Series,
  PieSeriesComponent,
  PieSeriesBuilderConfig
> {
  constructor(protected config: PieSeriesBuilderConfig) {
    super(config);
  }

  public initializeComponent(): void {
    this.component = new PieSeriesComponent();
  }

  public calculateLayout(rows: number, cols: number, index: number): Layout {
    const key = `${rows},${cols}`;
    return (PieLayout as Record<string, any>)[key][index];
  }

  public setLayout(layout: Layout): void {
    this.component.layout = layout;
  }

  public setData(data: PieData[]): void {
    this.component.data = data;
  }

  public build(): PieSeriesComponent {
    const { rows, cols, datasetIndex, data } = this.config;
    const layout = this.calculateLayout(rows, cols, datasetIndex);

    super.build();
    this.setLayout(layout);
    this.setData(data);
    return this.component;
  }
}
