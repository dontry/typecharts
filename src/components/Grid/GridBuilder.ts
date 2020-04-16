import { Grid, GridComponent } from "./GridComponent";
import { GridConfig } from "./GridConfig";
import { AbstractComponentBuilder } from "../AbstractComponentBuilder";

export class GridBuilder extends AbstractComponentBuilder<Grid, GridComponent> {
  constructor(protected config?: GridConfig) {
    super(config);
    this.component = new GridComponent(config);
  }

  public setConfig(config: GridConfig): void {
    this.component.config = config;
  }

  public build(): GridComponent | null {
    return this.component;
  }
}
