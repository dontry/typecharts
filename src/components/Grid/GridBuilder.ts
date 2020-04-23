import { GridComponent, Grid } from "./GridComponent";
import { AbstractComponentBuilder } from "../AbstractComponentBuilder";

export interface GridConfig {
  facetCount?: number;
  rows?: number;
  cols?: number;
}

export class GridBuilder extends AbstractComponentBuilder<
  Grid[],
  GridComponent
> {
  public static DEFAULT_COLUMN_COUNT = 3;
  public static DEFAULT_ROW_COUNT = 3;
  public static DEFAULT_SIZE = 9;
  private rows = -1;
  private cols = -1;

  constructor(protected config: GridConfig) {
    super(config);
    const componentConfig = this.getGridLayout(config);
    this.component = new GridComponent(componentConfig);
  }

  public getRows(): number {
    return this.rows;
  }

  public getCols(): number {
    return this.cols;
  }

  public setGrid(config: GridConfig): void {
    const componentConfig = this.getGridLayout(config);
    this.component.config = componentConfig;
  }

  public build(): GridComponent | null {
    return this.component;
  }

  private getGridLayout(config: GridConfig): { rows: number; cols: number } {
    const count = config.facetCount || 1;
    let { rows, cols } = config;
    if (!cols && !rows) {
      if (count === 4) {
        cols = 2;
        rows = 2;
      } else {
        cols =
          count > GridBuilder.DEFAULT_COLUMN_COUNT
            ? GridBuilder.DEFAULT_COLUMN_COUNT
            : count;
        rows = cols >= count ? 1 : Math.ceil(count / cols);
        rows =
          rows * cols > GridBuilder.DEFAULT_SIZE
            ? GridBuilder.DEFAULT_ROW_COUNT
            : rows;
      }
    } else if (!!cols && !rows) {
      cols = Math.min(count, cols);
      rows = cols >= count ? 1 : Math.ceil(count / cols);
      rows =
        rows * cols > GridBuilder.DEFAULT_SIZE
          ? GridBuilder.DEFAULT_ROW_COUNT
          : rows;
    } else if (!cols && !!rows) {
      rows = Math.min(count, rows);
      cols = rows >= count ? 1 : Math.ceil(count / rows);
      cols =
        rows * cols > GridBuilder.DEFAULT_SIZE
          ? GridBuilder.DEFAULT_COLUMN_COUNT
          : cols;
    }
    this.rows = rows as number;
    this.cols = cols as number;
    return { rows: this.rows, cols: this.cols };
  }
}
