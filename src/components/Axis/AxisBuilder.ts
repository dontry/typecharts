import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import { Axis, AxisComponent, AxisComponentConfig } from "./AxisComponent";
import { Minmax } from "@/types/Minmax";
import { format } from "d3-format";
import { DataValue } from "@/types/DataItem";

export class AxisBuilder extends AbstractComponentBuilder<Axis, AxisComponent> {
  constructor(protected config: AxisComponentConfig) {
    super();
    const axis = config.axisDimension;
    this.component = new AxisComponent(axis);
  }

  // TODO: gridIndex, axisTick, axisLabel, custom,

  public setData(data: DataValue[] | undefined): void {
    this.component.data = data;
  }

  public setCount(count: number): void {
    this.component.count = count;
  }

  public setName(name = ""): void {
    this.component.name = name;
  }

  public setFacetName(name = ""): void {
    this.component.facetName = name;
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
    }
  }

  public setPosition(axisDimension: string): void {
    this.component.position = axisDimension === "x" ? "left" : "bottom";
  }

  // FIXME: improve nameGap algorithm
  private computeNameGap(value: Minmax): number | undefined {
    if (typeof value === "number") {
      const decimalFormat = format(".3");
      const offset = decimalFormat(value).toString().length - 10;
      return AxisComponent.DEFAULT_NAME_GAP + (offset > 0 ? offset * 0.5 : 0);
    } else if (typeof value === "string") {
      const offset = value.length - 10;
      return AxisComponent.DEFAULT_NAME_GAP + (offset > 0 ? offset * 0.5 : 0);
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
      facetName,
      gridIndex,
      count,
    } = this.config;

    this.setName(name);
    this.setFacetName(facetName);
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
