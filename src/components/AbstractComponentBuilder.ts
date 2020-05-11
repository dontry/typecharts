import { ComponentBuilderInterface } from "./ComponentBuilderInterface";
import { AbstractComponent } from "./AbstractComponent";

export abstract class AbstractComponentBuilder<
  T,
  K extends AbstractComponent<T>
> implements ComponentBuilderInterface<K> {
  protected component!: K;
  constructor(protected config?: Record<string, any>) {}
  public setCustom(custom: any): void {
    this.component.custom = custom;
  }
  protected abstract initializeComponent(args?: any): void;
  public abstract build(...args: any[]): K | null | (K | null)[];
  public getComponent(): K {
    return this.component;
  }
}
