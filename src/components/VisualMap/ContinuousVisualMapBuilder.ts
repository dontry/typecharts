import { AbstractVisualMapBuilder } from "./AbstractVisualMapBuilder";
import { VisualMap } from "echarts";
import { ContinuousVisualMapComponent } from "./ContinuousVisualMapComponent";
import { RangeObject } from "./VisualMapComponent";

export interface VisualMapBuilderConfig {
  min: number;
  max: number;
  show?: boolean;
  minRange?: number;
  maxRange?: number;
  inRange?: RangeObject;
  outRange?: RangeObject;
  custom?: any;
}

export class ContinuousVisualMapBuilder extends AbstractVisualMapBuilder<
  VisualMap.Continuous,
  ContinuousVisualMapComponent,
  VisualMapBuilderConfig
> {
  constructor(config: VisualMapBuilderConfig) {
    super(config);
  }
  protected initializeComponent(): void {
    this.component = new ContinuousVisualMapComponent();
  }
}
