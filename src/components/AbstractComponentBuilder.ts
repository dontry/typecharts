import { ComponentBuilderInterface } from "./ComponentBuilderInterface";
import { AbstractComponent } from "./AbstractComponent";

export abstract class AbstractComponentBuilder<
  T,
  K extends AbstractComponent<T>
> implements ComponentBuilderInterface<T, K> {
  protected component!: K;
  constructor(protected config?: Record<string, any>) {}
  public abstract build(): K | null | (K | null)[];
  public getComponent(): K {
    return this.component;
  }
}
