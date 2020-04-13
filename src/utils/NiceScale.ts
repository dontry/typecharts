import { Minmax } from "@/types/Minmax";

export class NiceScale {
  private readonly DEFAULT_MAX_TICKS = 5;
  private readonly DEFAULT_TICK_SPACING = 0;
  private readonly DEFAULT_RANGE = 10;

  private maxTicks: number = this.DEFAULT_MAX_TICKS;
  private tickSpacing: number = this.DEFAULT_TICK_SPACING;
  private range: number | undefined;
  private niceMin = 0;
  private niceMax = 0;
  private minRange = 0;
  private maxRange = 0;

  constructor(
    private minPoint: number,
    private maxPoint: number,
    private onZero: boolean = false,
    private factor: number = 0.5,
  ) {}

  public calculate(): [Minmax, Minmax] {
    this.range = this.getNiceNumber(this.maxPoint - this.minPoint, false);
    this.tickSpacing = this.getNiceNumber(
      this.range / (this.maxTicks - 1),
      true,
    );
    this.niceMin =
      Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
    this.niceMax =
      Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
    this.minRange = this.onZero
      ? this.niceMin === 0
        ? this.niceMin
        : this.niceMin - this.factor * this.tickSpacing
      : this.niceMin - this.factor * this.tickSpacing;
    this.maxRange = this.niceMax + this.factor * this.tickSpacing;
    return [this.minRange, this.maxRange];
  }

  public setMinmaxPoint(minPoint: number, maxPoint: number): void {
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
  }

  public setMaxTicks(maxTicks: number): void {
    this.maxTicks = maxTicks;
  }

  public setTickSpacing(tickSpacing: number): void {
    this.tickSpacing = tickSpacing;
  }

  public getMaxRange(): number {
    return this.maxRange;
  }

  public getMinRange(): number {
    return this.minRange;
  }

  public getNiceMax(): number {
    return this.niceMax;
  }

  public getNiceMin(): number {
    return this.niceMin;
  }

  private getNiceNumber(range: number, round: boolean): number {
    const isNegative = range < 0;
    const exponent = this.quantifyExponent(range);
    const exp10 = Math.pow(10, exponent);
    const fraction = range / exp10;
    let niceFraction = 1;

    if (round) {
      if (fraction < 1.5) {
        niceFraction = 1;
      } else if (fraction < 3) {
        niceFraction = 2;
      } else if (fraction < 7) {
        niceFraction = 5;
      } else {
        niceFraction = 10;
      }
    } else {
      if (fraction <= 1) {
        niceFraction = 1;
      } else if (fraction <= 2) {
        niceFraction = 2;
      } else if (fraction <= 5) {
        niceFraction = 5;
      } else {
        niceFraction = 10;
      }
    }

    const value = niceFraction * exp10;
    const result =
      exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value;

    return isNegative ? -result : result;
  }

  private quantifyExponent(value: number): number {
    return Math.floor(Math.log(value) / Math.LN10);
  }
}
