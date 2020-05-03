import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import {
  AbstractVisualMapComponent,
  VisualMap,
  VisualMapComponentConfig,
  RangeObject,
} from "./VisualMapComponent";
import { isNil } from "lodash";

export abstract class AbstractVisualMapBuilder<
  S extends VisualMap,
  K extends AbstractVisualMapComponent<S>,
  T extends VisualMapComponentConfig = VisualMapComponentConfig
> extends AbstractComponentBuilder<S, K> {
  constructor(protected config: T) {
    super(config);
    this.initializeComponent();
  }
  public setMin(min: number): void {
    this.component.min = min;
  }

  public setMax(max: number): void {
    this.component.max = max;
  }

  public setMinRange(min: number, minRange?: number): void {
    this.component.minRange = !isNil(minRange) ? minRange : min;
  }

  public setMaxRange(max: number, maxRange?: number): void {
    this.component.maxRange = !isNil(maxRange) ? maxRange : max;
  }

  public setInRange(range?: RangeObject): void {
    this.component.inRange = range;
  }

  public setOutRange(range?: RangeObject): void {
    this.component.outRange = range;
  }

  public setShow(show = false): void {
    this.component.show = show;
  }

  public build(): K {
    const {
      min,
      max,
      minRange,
      maxRange,
      show,
      inRange,
      outRange,
      custom,
    } = this.config;
    this.setMin(min);
    this.setMax(max);
    this.setMinRange(min, minRange);
    this.setMaxRange(max, maxRange);
    this.setShow(show);
    this.setInRange(inRange);
    this.setOutRange(outRange);
    this.setCustom(custom);

    return this.component;
  }
}
