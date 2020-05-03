import { AbstractVisualMapBuilder } from "./AbstractVisualMapBuilder";
import { VisualMap } from "echarts";
import { ContinuousVisualMapComponent } from "./ContinuousVisualMapComponent";
import { VisualMapComponentConfig } from "./VisualMapComponent";

export class ContinuousVisualMapBuilder extends AbstractVisualMapBuilder<
  VisualMap.Continuous,
  ContinuousVisualMapComponent,
  VisualMapComponentConfig
> {
  constructor(config: VisualMapComponentConfig) {
    super(config);
  }
  protected initializeComponent(): void {
    this.component = new ContinuousVisualMapComponent();
  }
}
