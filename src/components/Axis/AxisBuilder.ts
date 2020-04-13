import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { Axis, AxisComponent } from "./AxisComponent";
import { AxisConfig } from "./AxisConfig";
import { Minmax } from "@/types/Minmax";
import { format } from "d3-format";
import { DataValue } from "@/types/DataItem";

export type AxisType = "category" | "value" | "time";
export type AxisDimension = "x" | "y";

export interface AxisComponentConfig extends AxisConfig {
  type: AxisType;
  axisDimension: AxisDimension;
  gridIndex: number;
  count: number;
  data?: DataValue[];
}

export class AxisBuilder extends AbstractComponentBuilder<Axis, AxisComponent> {
  constructor(protected config: AxisComponentConfig) {
    super();
    this.component = new AxisComponent();
  }

  public reset(): void {
    this.component = new AxisComponent();
  }

  // TODO: gridIndex, axisTick, axisLabel, custom, facetName

  public setData(data: DataValue[] | undefined): void {
    this.component.data = data;
  }

  public setCount(count: number): void {
    this.component.count = count;
  }

  public setName(name: string): void {
    this.component.name = name;
  }

  public setMin(min?: Minmax): void {
    this.component.min = min;
  }

  public setMax(max?: Minmax): void {
    this.component.max = max;
  }

  public setScale(toggleScale: boolean): void {
    this.component.scale = toggleScale;
  }

  public setShow(show: boolean): void {
    this.component.show = show;
  }

  public setGridIndex(gridIndex: number): void {
    this.component.gridIndex = gridIndex;
  }

  public setNameGap(
    axisDimension: string,
    nameGap?: number,
    max?: Minmax,
  ): void {
    if (nameGap) {
      this.component.nameGap = nameGap;
    } else if (axisDimension === "y" && max) {
      this.component.nameGap = this.computeNameGap(max);
    } else {
      console.warn("setNameGap arguments are invalid");
    }
  }

  public setPosition(axisDimension: string): void {
    this.component.position = axisDimension === "x" ? "left" : "bottom";
  }

  private computeNameGap(value: Minmax): number | undefined {
    if (typeof value === "number") {
      const decimalFormat = format(".3");
      return decimalFormat(value).toString().length * 10;
    } else if (typeof value === "string") {
      return value.length + 10;
    } else {
      return undefined;
    }
  }

  public build(): AxisComponent | null {
    if (!this.config) return null;

    const {
      axisDimension,
      data,
      min,
      max,
      scale,
      nameGap,
      show,
      name,
      gridIndex,
      count,
    } = this.config;

    this.setName(name);
    this.setData(data);
    this.setMin(min);
    this.setMax(max);
    this.setCount(count);
    this.setScale(scale);
    this.setGridIndex(gridIndex);
    this.setNameGap(axisDimension, nameGap, max);
    this.setShow(show);
    this.setPosition(axisDimension);

    return this.component;
  }
}
