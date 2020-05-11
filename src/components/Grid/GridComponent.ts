import { AbstractComponent } from "../AbstractComponent";
import { GridConfig } from "./GridConfig";

export interface Grid {
  left: string | number;
  right: string | number;
  bottom: string | number;
  top: string | number;
  height: string | number;
  width: string | number;
}

export interface SingleGridParam {
  colIndex: number;
  rowIndex: number;
  colGap: number;
  rowGap: number;
  width: number;
  height: number;
  topPadding: number;
  sidePadding: number;
}

export class GridComponent extends AbstractComponent<Grid[]> {
  private readonly DEFAULT_COL_GAP_SIZE = 8;
  private readonly DEFAULT_ROW_GAP_SIZE = 7;
  private readonly DEFAULT_TOP_PADDING = 5;
  private readonly DEFAULT_BOTTOM_PADDING = 7;
  private readonly DEFAULT_SIDE_PADDING = 5;
  private readonly DEFAULT_GRIDS_SETTING: Grid[] = [
    {
      left: "3%",
      right: "5%",
      top: "3%",
      bottom: "8%",
      height: "auto",
      width: "auto",
    },
  ];
  private _config: GridConfig;

  constructor(config: GridConfig = { rows: 1, cols: 1 }) {
    super();
    this.fieldName = "grid";
    this._config = config;
  }

  public set config(config: GridConfig) {
    this._config = config;
  }

  public get config(): GridConfig {
    return this._config;
  }

  /**
   * getGridsSetting
   */
  public getGridSetting({
    cols = 1,
    rows = 1,
    rowGap = this.DEFAULT_ROW_GAP_SIZE,
    colGap = this.DEFAULT_COL_GAP_SIZE,
    topPadding = this.DEFAULT_TOP_PADDING,
    bottomPadding = this.DEFAULT_BOTTOM_PADDING,
    sidePadding = this.DEFAULT_SIDE_PADDING,
  }: GridConfig): Grid[] {
    if (rows === 1 && cols === 1) {
      return this.DEFAULT_GRIDS_SETTING;
    }

    if (rows < 1 || cols < 1) {
      console.error("Neither rows or cols should be less than 1.");
      return this.DEFAULT_GRIDS_SETTING;
    }

    const width = (100 - 2 * sidePadding - colGap * (cols - 1)) / cols;
    const height =
      (100 - (topPadding + bottomPadding) - rowGap * (rows - 1)) / rows;

    const grids = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const grid = this.getGrid({
          rowIndex: r,
          colIndex: c,
          colGap,
          rowGap,
          width,
          height,
          sidePadding,
          topPadding,
        });
        grids.push(grid);
      }
    }

    return grids;
  }

  private getGrid(gridParam: SingleGridParam): Grid {
    const {
      width,
      height,
      rowIndex,
      colIndex,
      colGap,
      rowGap,
      sidePadding,
      topPadding,
    } = gridParam;

    const horizontalInterval = width + colGap;
    const verticalInterval = height + rowGap;
    const left = sidePadding + colIndex * horizontalInterval;
    const top = topPadding + rowIndex * verticalInterval;
    const right = left + width;
    const bottom = top + height;

    return {
      left: `${left}%`,
      top: `${top}%`,
      right: `${right}%`,
      bottom: `${bottom}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  }

  public toEChartOption(): Grid[] {
    return this.getGridSetting(this.config);
  }
}
