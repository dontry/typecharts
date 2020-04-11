import { Grid, GridComponent } from "./GridComponent";
import { GridConfig } from "./GridConfig";
import { AbstractComponentBuilder } from "../AbstractComponentBuilder";

export class GridBuilder extends AbstractComponentBuilder<Grid, GridComponent> {
  constructor(protected config?: GridConfig) {
    super(config);
    this.component = new GridComponent(config);
  }

  public reset(): void {
    this.component = new GridComponent();
  }

  public build(): GridComponent | null {
    this.config && this.component.getGridSetting(this.config);
    return this.component;
  }

  public setConfig(config: GridConfig): void {
    this.component.config = config;
  }
}
