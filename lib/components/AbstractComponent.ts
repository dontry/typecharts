import { BaseOption } from "./BaseOption";
import { v4 as uuid } from "uuid";

export abstract class AbstractComponent<T> implements BaseOption<T> {
  protected id: string;
  constructor() {
    this.id = uuid();
  }
  toEchartOption(): T {
    throw new Error("Method not implemented.");
  }
}