import { ComponentBuilderInterface } from "./ComponentBuilderInterface";
import { capitalize, isUndefined } from "lodash";
import { AbstractComponent } from "./AbstractComponent";

export abstract class AbstractComponentBuilder<
  T,
  K extends AbstractComponent<T>
> implements ComponentBuilderInterface<T, K> {
  protected component!: K;
  constructor(protected config?: Record<string, any>) {}
  public abstract reset(): void;
  public build(): K | null {
    if (isUndefined(this.config)) return null;
    Object.keys(this.config).forEach((key: string) => {
      const setterName = `set${capitalize(key)}`;
      // @ts-ignore
      if (this[setterName]) {
        // @ts-ignore
        this[setterName](this.config[key]);
      }
    });
    return this.component;
  }

  public getComponent(): K {
    return this.component;
  }
}
